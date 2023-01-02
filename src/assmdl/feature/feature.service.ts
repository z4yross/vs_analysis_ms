import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'
import dayjs from 'dayjs'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class FeatureService {
    private readonly CLASS_LABEL: string = 'feature'

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

        const e = new Entity(res.records[0].get('p'))
        const u: UpdateDTO = new UpdateDTO()

        u.access_time = dayjs().format()

        await this.update(e.get().ID, u)

        return res.records.length ? e : undefined
    }

    // all features of an assembly
    async featuresOfAssembly(id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (a:assembly{ID: $id}) RETURN p`,
            { id }
        )

        res.records.forEach(async (r) => {
            const e = new Entity(r.get('p'))
            const u: UpdateDTO = new UpdateDTO()

            u.access_time = dayjs().format()

            await this.update(e.get().ID, u)
        })

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // all features of a sample
    async featuresOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (:assembly) -- (s:sample{provided_by: $provided_by}) RETURN p`,
            { provided_by }
        )

        res.records.forEach(async (r) => {
            const e = new Entity(r.get('p'))
            const u: UpdateDTO = new UpdateDTO()

            u.access_time = dayjs().format()

            await this.update(e.get().ID, u)
        })

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

    // add a feature to an assembly
    async addFeatureToAssembly(assembly_id: string, feature_id: string) {
        const res = await this.neo4jService.write(
            `MATCH (f:${this.CLASS_LABEL} {
                ID: $feature_id
            })
            MATCH (a:assembly {
                ID: $assembly_id
            })
            CREATE (a) -[:has]-> (f)
            RETURN f`,
            { assembly_id, feature_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('f'))
            : undefined
    }
}
