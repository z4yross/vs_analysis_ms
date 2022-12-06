import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'
import { Entity } from './entity/entity'
import { Injectable } from '@nestjs/common'
import { Neo4jService } from 'nest-neo4j'

@Injectable()
export class SampleService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(sample: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (s:sample {
                    seq_method: $seq_method,
                    date: $date,
                    processing_date: $processing_date,
                    origin: $origin,
                    type: $type,
                    provided_by: $provided_by
                }) RETURN s`,
                {
                    seq_method: sample.seq_method,
                    date: sample.date,
                    processing_date: sample.processing_date,
                    origin: sample.origin,
                    type: sample.type,
                    provided_by: sample.provided_by,
                }
            )
            .then(({ records }) => new Entity(records[0].get('s')))
    }

    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {
                ID: $id
            }) RETURN u`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('s'))
            : undefined
    }

    async all(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {
                provided_by: $provided_by
            }) RETURN u`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('s')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {
                ID: $id
            })
            SET s += $update
            RETURN s`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('s'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {
                ID: $id
            })
            REMOVE s
            RETURN s`,
            { id }
        )

        console.log(res);

        return res.records.length
            ? 'done'
            : undefined
    }
}
