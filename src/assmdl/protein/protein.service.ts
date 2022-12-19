import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class ProteinService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (p:protein {
                    name: $name
                    ncbiref: $ncbiref
                    uniprotref: $uniprotref
                    pdref: $pdref
                }) RETURN p`,
                {
                    ...data,
                }
            )
            .then(({ records }) => new Entity(records[0].get('p')))
    }

    // assembly with id
    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:protein {
                ID: $id
            }) RETURN p`,
            { id }
        )

        return res.records.length ? new Entity(res.records[0].get('p')) : undefined
    }

    // all utr of a feature
    async all(assemblyID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:protein-[HAS]-g:gene{ID:$id}) RETURN p`,
            { id: assemblyID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:protein {
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

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:protein{
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
