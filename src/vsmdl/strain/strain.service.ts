import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class StrainService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (s:strain {
                    name: $name
                    description: $description
                }) RETURN s`,
                {
                    name: data.name,
                    description: data.description
                }
            )
            .then(({ records }) => new Entity(records[0].get('s')))
    }

    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:strain {
                ID: $id
            }) RETURN s`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('s'))
            : undefined
    }

    async all(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:strain -- a:sample{provided_by: $provided_by}) RETURN s`,
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

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
