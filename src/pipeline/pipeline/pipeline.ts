import { Injectable } from '@nestjs/common'
import { Client1_13 } from 'kubernetes-client'

import { Cron } from '@nestjs/schedule'

import { Neo4jService } from 'nest-neo4j/dist'
import { InjectAmqpConnection } from 'nestjs-amqp'
import { Connection } from 'amqplib'

import * as PipelineManifest from './manifests/pipeline.json'

// Pipeline monitor and control class for spawning and managing child processes
// This should be a custom singleton provider

@Injectable()
export class PipelineMonitor {
    private KubeClient: any
    private readonly CONCURRENT_PIPELINES = Number(process.env.CONCURRENT_PIPELINES) || 5
    private readonly SPARE_CPUS = Number(process.env.SPARE_CPUS) || 4

    private currentRunningPipelines: number = 0
    private currentCpusByPipeline: number = 0

    constructor(
        private readonly neo4jService: Neo4jService,
        @InjectAmqpConnection()
        private readonly amqp: Connection
    ) {
        this.KubeClient = new Client1_13({ version: '1.9' })
    }

    // run pipiline container with given image name, and data volumes
    async runPipeline(provided_by: string, project_id: string, requestCpu: number): Promise<void> {
        const volumeName: string = `${provided_by}/${project_id}`

        const deployment = PipelineManifest
        deployment.metadata.name =
            'pipeline' +
            '-' +
            provided_by.toLowerCase() +
            '-' +
            project_id.toLowerCase()
        deployment.spec.template.spec.containers[0]['env'] = [
            {
                name: 'FASTQ',
                value: `/storage/${volumeName}/fastq`,
            },
            {
                name: 'SUMMARY',
                value: `/storage/${volumeName}/summary`,
            },
            {
                name: 'SAMPLE_SHEET',
                value: `/storage/${volumeName}/sample_sheet`,
            },
            {
                name: 'OUT',
                value: `/storage/${volumeName}/out`,
            },
            {
                name: 'VARIANT',
                value: `/storage/${volumeName}/variant`,
            },
        ]

        deployment.spec.template.spec.containers[0].resources.requests.cpu = requestCpu.toString()

        const create = await this.KubeClient.apis.apps.v1
            .namespaces('default')
            .deployments.post({ body: deployment })
        return create
    }

    // stop pipeline container
    async stopPipeline(provided_by: string, project_id: string): Promise<void> {
        await this.KubeClient.apis.apps.v1
            .namespaces('default')
            .deployments(
                'pipeline' +
                    '-' +
                    provided_by.toLowerCase() +
                    '-' +
                    project_id.toLowerCase()
            )
            .delete()
    }

    // get pipeline container status
    async getPipelineStatus(
        provided_by: string,
        project_id: string
    ): Promise<void> {
        const deployment = await this.KubeClient.apis.apps.v1
            .namespaces('default')
            .deployments(
                'pipeline' +
                    '-' +
                    provided_by.toLowerCase() +
                    '-' +
                    project_id.toLowerCase()
            )
            .get()
        return deployment
    }

    // get pipeline container logs
    async getPipelineLogs(
        provided_by: string,
        project_id: string
    ): Promise<void> {
        // get deployment
        const deployment = await this.KubeClient.apis.apps.v1
            .namespaces('default')
            .deployments(
                'pipeline' +
                    '-' +
                    provided_by.toLowerCase() +
                    '-' +
                    project_id.toLowerCase()
            )
            .get()
        // get all pods of deployment
        const pod = await this.KubeClient.api.v1
            .namespaces('default')
            .pods.get({
                qs: {
                    labelSelector: `app=${deployment.body.spec.selector.matchLabels.app}`,
                },
            })
        // get logs of pod
        const logs = await this.KubeClient.api.v1
            .namespaces('default')
            .pods(pod.body.items[0].metadata.name)
            .log.get()
        return logs
    }

    // // get node cpu and memory usage
    // async getNodeUsage(): Promise<void> {
    //     const node = await this.KubeClient.api.v1.nodes.get()
    //     return node
    // }

    @Cron('*/5 * * * * *')
    async runQueued() {
        if (this.currentRunningPipelines >= this.CONCURRENT_PIPELINES) return
        
        // get all pipelines with status queued in the database
        // order by modified_date (oldest first)
        const result = await this.neo4jService.read(`
            MATCH (p:Pipeline {status: 'queued'})
            RETURN p
            ORDER BY p.modified_date
        `)

        // get all nodes and add their cpu allocation to a int
        const node = await this.KubeClient.api.v1.nodes.get()
        const availableCpu = node.body.items.reduce((acc, cur) => {
            return acc + cur.status.allocatable.cpu
        }, 0) - this.SPARE_CPUS

        if(this.currentRunningPipelines === 0)
            this.currentCpusByPipeline = availableCpu / this.CONCURRENT_PIPELINES
        
        if (this.currentCpusByPipeline < 1) {
            console.log('Not enough cpu to run pipelines')
            return
        }

        // find out how many pipelines can be run with the current cpu allocation and the available cpu
        const freePipelineSockets = Math.floor(availableCpu / this.currentCpusByPipeline)
        // run pipelines unitl all cpu is used or all pipelines are running

        for (let i = 0; i < freePipelineSockets; i++) {
            if (i >= result.records.length) break
            if (this.currentRunningPipelines >= this.CONCURRENT_PIPELINES) break

            // get batch of pipeline
            const batch = (
                await this.neo4jService.read(
                    `MATCH (p:pipeline {ID: $id})-[:PROCESS]->(b:batch)
                RETURN b
            `,
                    { id: result.records[i].get('p').properties.id }
                )
            ).records[0]

            // run pipeline
            await this.runPipeline(
                batch.get('b').properties.provided_by,
                batch.get('b').properties.identity.low,
                this.currentCpusByPipeline
            )

            // update state to started
            await this.neo4jService.write(
                `MATCH (p:Pipeline {id: $id})
                SET p.status = 'started'
                RETURN p
            `,
                { id: result.records[i].get('p').properties.id }
            )

            this.currentRunningPipelines++
        }
    }

    // stop aborted pipelines
    @Cron('*/5 * * * * *')
    async stopAborted() {
        // get all pipelines with status aborted in the database
        const result = await this.neo4jService.read(`
            MATCH (p:Pipeline {status: 'aborted'})
            RETURN p
        `)

        // stop all pipelines
        for (const pipeline of result.records) {
            // get batch of pipeline
            const batch = (
                await this.neo4jService.read(
                    `
                MATCH (p:pipeline {ID: $id})-[:PROCESS]->(b:batch)'
                RETURN b
            `,
                    { id: pipeline.get('p').properties.id }
                )
            ).records[0]

            // stop pipeline
            await this.stopPipeline(
                batch.get('b').properties.provided_by,
                batch.get('b').properties.identity.low
            )

            // update state to stopped
            await this.neo4jService.write(
                `MATCH (p:Pipeline {id: $id})
                SET p.status = 'stopped'
                RETURN p
            `,
                { id: pipeline.get('p').properties.id }
            )
        }
    }

    // check finished pipelines, update database and free cpu variables
    @Cron('*/5 * * * * *')
    async checkFinished() {
        // get all pods in default namespace with label io.kompose.service=vs-pipeline-pp
        const pod = await this.KubeClient.api.v1
            .namespaces('default')
            .pods.get({
                qs: {
                    labelSelector: 'io.kompose.service=vs-pipeline-pp',
                },
            })
        
        
    }
}
