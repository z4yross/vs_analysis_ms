import { Injectable } from '@nestjs/common';
import { Client } from 'kubernetes-client';

import * as PipelineManifest from './manifests/pipeline.json';

// Pipeline monitor and control class for spawning and managing child processes
// This should be a custom singleton provider 

@Injectable()
export class PipelineMonitor{
    private KubeClient: Client;

    constructor() {
        this.KubeClient = new Client({ version: '1.9' });
    }

    // run pipiline container with given image name, and data volumes
    async runPipeline(imageName: string, provided_by: string, project_id: string): Promise<void> {

        const volumeName: string = `${provided_by}/${project_id}`;


        const deployment = PipelineManifest;
        deployment.metadata.name = "pipeline" + '-' + provided_by.toLowerCase() + '-' + project_id.toLowerCase();
        deployment.spec.template.spec.containers[0]['env'] = [
            {
                name: 'FASTQ',
                value: `/storage/${volumeName}/fastq`
            },
            {
                name: 'SUMMARY',
                value: `/storage/${volumeName}/summary`
            },
            {
                name: 'SAMPLE_SHEET',
                value: `/storage/${volumeName}/sample_sheet`
            },
            {
                name: 'OUT',
                value: `/storage/${volumeName}/out`
            },
            {
                name: 'VARIANT',
                value: `/storage/${volumeName}/variant`
            },
        ];


        const create = await Client.apis.apps.v1.namespaces('default').deployments.post({ body: deployment });
        return create;
    }

    // stop pipeline container
    async stopPipeline(provided_by: string, project_id: string): Promise<void> {
        await Client.apis.apps.v1.namespaces('default').deployments("pipeline" + '-' + provided_by.toLowerCase() + '-' + project_id.toLowerCase()).delete();
    }

    // get pipeline container status
    async getPipelineStatus(provided_by: string, project_id: string): Promise<void> {
        const deployment = await Client.apis.apps.v1.namespaces('default').deployments("pipeline" + '-' + provided_by.toLowerCase() + '-' + project_id.toLowerCase()).get();
        return deployment;
    }

    // get pipeline container logs
    async getPipelineLogs(provided_by: string, project_id: string): Promise<void> {
        // get deployment 
        const deployment = await Client.apis.apps.v1.namespaces('default').deployments("pipeline" + '-' + provided_by.toLowerCase() + '-' + project_id.toLowerCase()).get();
        // get all pods of deployment
        const pod = await Client.api.v1.namespaces('default').pods.get({ qs: { labelSelector: `app=${deployment.body.spec.selector.matchLabels.app}` } });
        // get logs of pod
        const logs = await Client.api.v1.namespaces('default').pods(pod.body.items[0].metadata.name).log.get();
        return logs;
    }

    // get node cpu and memory usage
    async getNodeUsage(): Promise<void> {
        const node = await Client.api.v1.nodes.get();
        return node;
    }
}