import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class AssemblyService {
    private readonly CLASS_LABEL: string = 'assembly'

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

    // all asseblys of a sample
    async assemblysOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (a:sample{provided_by: $provided_by}) RETURN p`,
            { provided_by }
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

    // add sample to assembly
    async addSampleToAssembly(id: string, provided_by: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            })
            MATCH (s:sample {
                provided_by: $provided_by
            })
            CREATE (p) -[:ASSEMBLY_OF]-> (s)
            RETURN p`,
            { id, provided_by }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // remove sample from assembly
    async removeSampleFromAssembly(id: string, provided_by: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $id
            })
            MATCH (s:sample {
                provided_by: $provided_by
            })
            MATCH (p) -[r:ASSEMBLY_OF]-> (s)
            DELETE r
            RETURN p`,
            { id, provided_by }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }
}
