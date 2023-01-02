import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class SampleService {
    private readonly CLASS_LABEL: string = 'sample'

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

    // all samples
    async samplesOfProvider(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} { provided_by: $provided_by }) RETURN p`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
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

    // update sample state
    async updateState(id: string, state: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            })
            SET p.state = $state
            RETURN p`,
            { id, state }
        )

        // TODO:
        // If the sample state is = 'processing', then we need to update the processing_date, start the processing pipeline and notify by message queue
        // If the sample state is = 'processed', then we need to update the processing_date and notify by message queue
        // If the sample state is = 'failed', then we need to update the processing_date, stop the processing pipeline and notify by message queue
        // If the sample state is = 'deleted', then we need to update the processing_date, stop the processing pipeline and notify by message queue

        if (res.records.length) {
            const sample = new Entity(res.records[0].get('p')).get()

            if (sample.state === 'processing') {
                // start the processing pipeline and notify by message queue
            }

            if (sample.state === 'processed') {
                // notify by message queue
            }

            if (sample.state === 'failed') {
                // stop the processing pipeline and notify by message queue
            }

            if (sample.state === 'deleted') {
                // stop the processing pipeline and notify by message queue
            }
        }

        return res.records.length
            ? new Entity(res.records[0].get('p'))46
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            })
            REMOVE p
            RETURN p`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
