import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class GeneService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (g:gene {
                    name: $name
                    ncbiref: $ncbiref
                    enaref: $enaref
                }) RETURN g`,
                {
                    ...data,
                }
            )
            .then(({ records }) => new Entity(records[0].get('g')))
    }

    // assembly with id
    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (g:gene {
                ID: $id
            }) RETURN g`,
            { id }
        )

        return res.records.length ? new Entity(res.records[0].get('g')) : undefined
    }

    // all utr of a feature
    async all(assemblyID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (g:gene-[HAS]-f:feature{ID:$id}) RETURN g`,
            { id: assemblyID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('g')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (g:gene {
                ID: $id
            })
            SET g += $update
            RETURN g`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('g'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (g:gene{
                ID: $id
            })
            REMOVE g
            RETURN g`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
