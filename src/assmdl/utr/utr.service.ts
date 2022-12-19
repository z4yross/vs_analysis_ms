import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class UtrService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (u:utr {
                    name: $name
                }) RETURN u`,
                {
                    ...data,
                }
            )
            .then(({ records }) => new Entity(records[0].get('u')))
    }

    // assembly with id
    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (u:utr {
                ID: $id
            }) RETURN u`,
            { id }
        )

        return res.records.length ? new Entity(res.records[0].get('u')) : undefined
    }

    // all utr of a feature
    async all(assemblyID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (u:utr-[HAS]-f:feature{ID:$id}) RETURN u`,
            { id: assemblyID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('u')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (u:utr {
                ID: $id
            })
            SET u += $update
            RETURN u`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('u'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (u:utr{
                ID: $id
            })
            REMOVE u
            RETURN u`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
