import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j/dist'

import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'
import { Entity } from './entity/entity'

@Injectable()
export class PipelineService {
    private readonly CLASS_LABEL: string = 'pipeline'

    constructor(private readonly neo4jService: Neo4jService) {}

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

    // all pipelines of a sample
    async pipelinesOfSample(
        provided_by: string
    ): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (a:sample{provided_by: $provided_by}) RETURN p`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    async update(id: string, state: string): Promise<Entity | undefined> {
        const update: UpdateDTO = new UpdateDTO()

        if (
            state !== 'started' &&
            state !== 'processed' &&
            state !== 'failed' &&
            state !== 'deleted'
        )
            throw new Error('Invalid state')

        update.processing_state = state

        // if current state is 'failed' or 'deleted', then we cannot update the state
        const current = (await this.get(id)).get()
        if (
            current.processing_state === 'failed' ||
            current.processing_state === 'deleted'
        ) {
            throw new Error(
                'Cannot update the state of a failed or deleted pipeline'
            )
        }

        update.modified_at = new Date().toISOString()

        // TODO:
        // If the processing_state is = 'started', then we need to update the processing_date, start the processing pipeline, notify by message queue and update processing_message
        // If the processing_state is = 'processed', then we need to update the processing_date, notify by message queue and update processing_message
        // If the processing_state is = 'failed', then we need to update the processing_date, stop the processing pipeline, notify by message queue and update processing_message
        // If the processing_state is = 'deleted', then we need to update the processing_date, stop the processing pipeline, notify by message queue and update processing_message

        if (update.processing_state === 'started') {
            update.processing_date = new Date().toISOString()
            update.processing_message = 'started'
        } else if (update.processing_state === 'processed') {
            update.processing_date = new Date().toISOString()
            update.processing_message = 'processed'
        } else if (update.processing_state === 'failed') {
            update.processing_date = new Date().toISOString()
            update.processing_message = 'failed'
        } else if (update.processing_state === 'deleted') {
            update.processing_date = new Date().toISOString()
            update.processing_message = 'deleted'
        }

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

    async addPipelineToSample(
        pipeline_id: string,
        sample_id: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            })
            MATCH (s:sample {
                ID: $sample_id
            })
            CREATE (p)-[:PROCESS]->(s)
            RETURN p`,
            { pipeline_id, sample_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async removePipelineFromSample(
        pipeline_id: string,
        sample_id: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            })
            MATCH (s:sample {
                ID: $sample_id
            })
            MATCH (p)-[r:PROCESS]->(s)
            DELETE r
            RETURN p`,
            { pipeline_id, sample_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async addAssembly(
        pipeline_id: string,
        assembly_id: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            })
            MATCH (a:assembly {
                ID: $assembly_id
            })
            CREATE (p)-[:PRODUCE]->(a)
            RETURN p`,
            { pipeline_id, assembly_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async removeAssembly(
        pipeline_id: string,
        assembly_id: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $pipeline_id
            })
            MATCH (a:assembly {
                ID: $assembly_id
            })
            MATCH (p)-[r:PRODUCE]->(a)
            DELETE r
            RETURN p`,
            { pipeline_id, assembly_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }
}
