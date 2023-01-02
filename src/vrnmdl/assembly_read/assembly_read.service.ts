import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class AssemblyReadService {
    private readonly CLASS_LABEL: string = 'assembly_read'

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

    // all assembly_read of a sample
    async assemblyReadsOfSample(provided_by: string): Promise<Entity[] | undefined> {
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

    // add a sample to an assembly
    async addSampleToAssemblyRead(assembly_id: string, provided_by: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $assembly_id
            })
            MATCH (a:sample {
                provided_by: $provided_by
            })
            CREATE (p) -[:HAS_SAMPLE]-> (a)
            RETURN p`,
            { assembly_id, provided_by }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // remove a sample from an assembly
    async removeSampleFromAssemblyRead(assembly_id: string, provided_by: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $assembly_id
            })
            MATCH (a:sample {
                provided_by: $provided_by
            })
            MATCH (p) -[r:HAS_SAMPLE]-> (a)
            DELETE r
            RETURN p`,
            { assembly_id, provided_by }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }
}
