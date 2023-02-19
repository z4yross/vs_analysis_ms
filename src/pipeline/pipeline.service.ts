import { Inject, Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j/dist'

import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'
import { Entity } from './entity/entity'

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PipelineService {
    private readonly CLASS_LABEL: string = 'pipeline'

    constructor(
        private readonly neo4jService: Neo4jService,
        @Inject('PROJECTS_DATA_SERVICE') private client: ClientProxy
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
            `MATCH (p:${this.CLASS_LABEL})
            WHERE ID(p) = $id
            RETURN p`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // all pipeline of a batch
    async getBatchPipelines(batch_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (b:batch) -- (p:${this.CLASS_LABEL})
            WHERE ID(b) = $batch_id
            RETURN p`,
            { batch_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // batch of a pipeline
    async getPipelineBatch(pipeline_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (b:batch)
            WHERE ID(p) = $pipeline_id
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
        
        update.processing_state = state
        update.processing_message = state
        update.modified_at = new Date().toISOString()
        update.processing_date = undefined
        
        if(state === 'started')
            update.processing_date = new Date().toISOString()

        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL})
            WHERE ID(p) = $id
            SET p += $update
            RETURN p`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async delete(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL})
            WHERE ID(p) = $id
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
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL}), (b:batch)
            WHERE ID(p) = $pipeline_id AND ID(b) = $batch_id
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
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL}) -[r]- (b:batch)
            WHERE ID(p) = $pipeline_id AND ID(b) = $batch_id
            DELETE r
            RETURN p`,
            { pipeline_id, batch_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async getPipelinesWithStatus( status: string): Promise<Entity[] | undefined> {
        // get all batches of pipelines with a specific status and order by modified_at

        const req = await this.neo4jService.read(
            `MATCH (p:pipeline {processing_state: $status}) -- (b:batch)
            RETURN b
            ORDER BY p.modified_at DESC`,
            { status }
        )

        return req.records.length ?
            req.records.map((record) => new Entity(record.get('b'))) :
            undefined      
    }

    async sendMsgToQueue(data: any) {
        const pattern = { cmd: 'send' };
        return this.client.emit(pattern, data);
    }
}
