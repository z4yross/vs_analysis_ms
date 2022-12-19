import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class SampleService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (d:sample {
                    seq_method: $seq_method,
                    date: $date,
                    processing_date: $processing_date,
                    origin: $origin,
                    type: $type,
                    provided_by: $provided_by
                }) RETURN d`,
                {
                    seq_method: data.seq_method,
                    date: data.date,
                    processing_date: data.processing_date,
                    origin: data.origin,
                    type: data.type,
                    provided_by: data.provided_by,
                }
            )
            .then(({ records }) => new Entity(records[0].get('d')))
    }

    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (d:sample {
                ID: $id
            }) RETURN d`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('d'))
            : undefined
    }

    async all(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (d:sample {
                provided_by: $provided_by
            }) RETURN d`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('s')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (d:sample {
                ID: $id
            })
            SET d += $update
            RETURN d`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('d'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (d:sample {
                ID: $id
            })
            REMOVE d
            RETURN d`,
            { id }
        )

        console.log(res);

        return res.records.length
            ? 'done'
            : undefined
    }
}
