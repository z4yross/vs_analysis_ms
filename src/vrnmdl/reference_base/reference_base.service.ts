import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class ReferenceBaseService {
    private readonly CLASS_LABEL: string = 'reference_base'

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

    async all(id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} -- a:assembly_base{ID: $id}) RETURN p`,
            { id }
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
