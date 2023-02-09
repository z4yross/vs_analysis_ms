import { Injectable } from '@nestjs/common'
import { Connection } from 'amqplib'

import { Neo4jService } from 'nest-neo4j/dist'
import { InjectAmqpConnection } from 'nestjs-amqp'

import { PipelineMonitor } from './pipeline/pipeline'

import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'
import { Entity } from './entity/entity'

@Injectable()
export class PipelineService {
    private readonly CLASS_LABEL: string = 'pipeline'

    constructor(
        private readonly neo4jService: Neo4jService,
        @InjectAmqpConnection()
        private readonly amqp: Connection,
        // @Inject()
        // private readonly pipelineMonitor: PipelineMonitor
    ) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(`CREATE (p:${this.CLASS_LABEL} $data) RETURN p`, {
                data: data,
            })
            .then(({ records }) => new Entity(records[0].get('p')))
    }

    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            }) RETURN p`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // all pipelines of a batch
    async getBatchPipelines(batch_id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (b:batch {
                ID: $batch_id
            }) -- (p:${this.CLASS_LABEL})
            RETURN p`,
            { batch_id }
        )

        return res.records.length
            ? res.records.map((record) => new Entity(record.get('p')))
            : undefined
    }

    // batch of a pipeline
    async getPipelineBatch(pipeline_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            }) -- (b:batch)
            RETURN b`,
            { pipeline_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('b'))
            : undefined
    }

    async update(id: string, state: string): Promise<Entity | undefined> {
        const update: UpdateDTO = new UpdateDTO()
        const current = (await this.get(id)).get()

        // validate state [queued, started, processed, failed, deleted, aborted]
        if (
            state !== 'queued' &&
            state !== 'started' &&
            state !== 'processed' &&
            state !== 'failed' &&
            state !== 'deleted' &&
            state !== 'aborted' &&
            state !== 'stopped'
        )
            throw new Error('Invalid state')

        // if current state is same as the new state, then we cannot update the state
        if (current.processing_state === state)
            throw new Error('Cannot update the state to the same state')

        // get batch of the pipeline
        const batch = (await this.getPipelineBatch(id)).get()
        
        update.processing_state = state
        update.processing_message = state
        update.modified_at = new Date().toISOString()
        update.processing_date = undefined
        
        if(state === 'started')
            update.processing_date = new Date().toISOString()

        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            })
            SET p += $update
            RETURN p`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async delete(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            })
            DELETE p
            RETURN p`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async addPipeilineToBatch(
        pipeline_id: string,
        batch_id: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            })
            MATCH (b:batch {
                ID: $batch_id
            })
            CREATE (p)-[:PROCESS]->(b)
            RETURN p`,
            { pipeline_id, batch_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async removePipelineFromBatch(
        pipeline_id: string,
        batch_id: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            })
            MATCH (b:batch {
                ID: $batch_id
            })
            DELETE (p)-[:PROCESS]->(b)
            RETURN p`,
            { pipeline_id, batch_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // async addPipelineToSample(
    //     pipeline_id: string,
    //     sample_id: string
    // ): Promise<Entity | undefined> {
    //     const res = await this.neo4jService.read(
    //         `MATCH (p:${this.CLASS_LABEL} {
    //             ID: $pipeline_id
    //         })
    //         MATCH (s:sample {
    //             ID: $sample_id
    //         })
    //         CREATE (p)-[:PROCESS]->(s)
    //         RETURN p`,
    //         { pipeline_id, sample_id }
    //     )

    //     return res.records.length
    //         ? new Entity(res.records[0].get('p'))
    //         : undefined
    // }

    // async removePipelineFromSample(
    //     pipeline_id: string,
    //     sample_id: string
    // ): Promise<Entity | undefined> {
    //     const res = await this.neo4jService.read(
    //         `MATCH (p:${this.CLASS_LABEL} {
    //             ID: $pipeline_id
    //         })
    //         MATCH (s:sample {
    //             ID: $sample_id
    //         })
    //         MATCH (p)-[r:PROCESS]->(s)
    //         DELETE r
    //         RETURN p`,
    //         { pipeline_id, sample_id }
    //     )

    //     return res.records.length
    //         ? new Entity(res.records[0].get('p'))
    //         : undefined
    // }

    // async addAssembly(
    //     pipeline_id: string,
    //     assembly_id: string
    // ): Promise<Entity | undefined> {
    //     const res = await this.neo4jService.read(
    //         `MATCH (p:${this.CLASS_LABEL} {
    //             ID: $pipeline_id
    //         })
    //         MATCH (a:assembly {
    //             ID: $assembly_id
    //         })
    //         CREATE (p)-[:PRODUCE]->(a)
    //         RETURN p`,
    //         { pipeline_id, assembly_id }
    //     )

    //     return res.records.length
    //         ? new Entity(res.records[0].get('p'))
    //         : undefined
    // }

    // async removeAssembly(
    //     pipeline_id: string,
    //     assembly_id: string
    // ): Promise<Entity | undefined> {
    //     const res = await this.neo4jService.read(
    //         `MATCH (p:${this.CLASS_LABEL} {
    //             ID: $pipeline_id
    //         })
    //         MATCH (a:assembly {
    //             ID: $assembly_id
    //         })
    //         MATCH (p)-[r:PRODUCE]->(a)
    //         DELETE r
    //         RETURN p`,
    //         { pipeline_id, assembly_id }
    //     )

    //     return res.records.length
    //         ? new Entity(res.records[0].get('p'))
    //         : undefined
    // }
}
