import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class IntergenicRegionService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (ir:intergenic_region {
                    name: $name
                }) RETURN ir`,
                {
                    ...data,
                }
            )
            .then(({ records }) => new Entity(records[0].get('ir')))
    }

    // assembly with id
    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (ir:intergenic_region {
                ID: $id
            }) RETURN ir`,
            { id }
        )

        return res.records.length ? new Entity(res.records[0].get('g')) : undefined
    }

    // all utr of a feature
    async all(assemblyID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (ir:intergenic_region-[HAS]-f:feature{ID:$id}) RETURN ir`,
            { id: assemblyID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('ir')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (ir:intergenic_region {
                ID: $id
            })
            SET ir += $update
            RETURN ir`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('ir'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (ir:intergenic_region{
                ID: $id
            })
            REMOVE ir
            RETURN ir`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
