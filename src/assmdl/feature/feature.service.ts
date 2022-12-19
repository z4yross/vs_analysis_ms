import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'
import dayjs from 'dayjs'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class FeatureService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (f:feature {
                    type: $type
                    start: $start
                    end: $end
                    name: $name
                    sequence: $sequence
                    length: $length
                    md5checksum: $md5checksum
                    annotation_level: $annotation_level
                    access_time: $access_time
                    last_modified: $last_modified
                    frame: $frame
                }) RETURN f`,
                {
                    ...data,
                }
            )
            .then(({ records }) => new Entity(records[0].get('f')))
    }

    // assembly with id
    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (f:feature {
                ID: $id
            }) RETURN f`,
            { id }
        )

        const e = new Entity(res.records[0].get('f'))
        const u: UpdateDTO = new UpdateDTO()

        u.access_time = dayjs().format()

        await this.update(e.get().ID, u)

        return res.records.length ? e : undefined
    }

    // all features of an assembly
    async all(assemblyID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (f:feature-[HAS]-a:assembly{ID:$id}) RETURN f`,
            { id: assemblyID }
        )

        res.records.forEach(async (r) => {
            const e = new Entity(r.get('f'))
            const u: UpdateDTO = new UpdateDTO()

            u.access_time = dayjs().format()

            await this.update(e.get().ID, u)
        })

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('f')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (f:feature {
                ID: $id
            })
            SET f += $update
            RETURN f`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('f'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (f:feature{
                ID: $id
            })
            REMOVE f
            RETURN f`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
