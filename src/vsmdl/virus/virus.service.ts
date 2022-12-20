import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class VirusService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (v:virus {
                    name: $name
                    type: $type
                    description: $description
                }) RETURN v`,
                {
                    name: data.name,
                    type: data.type,
                    description: data.description
                }
            )
            .then(({ records }) => new Entity(records[0].get('v')))
    }

    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:virus {
                ID: $id
            }) RETURN v`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('v'))
            : undefined
    }

    async all(strainID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:virus -- s:strain{ID: $strainID}) RETURN v`,
            { strainID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('v')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:virus {
                ID: $id
            })
            SET v += $update
            RETURN v`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('v'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:virus {
                ID: $id
            })
            REMOVE v
            RETURN v`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
