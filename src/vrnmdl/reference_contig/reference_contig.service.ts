import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class ReferenceContigService {
    private readonly CLASS_LABEL: string = 'reference_contig'

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

    // all reference_contig of a reference_base
    async referenceContigsOfReferenceBase(id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (a:reference_base{ID: $id}) RETURN p`,
            { id }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // all reference_contig of a assembly_base
    async referenceContigsOfAssemblyBase(id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (:reference_base) -- (a:assembly_base{ID: $id}) RETURN p`,
            { id }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // all reference_contig of a assembly_read
    async referenceContigsOfAssemblyRead(id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (:reference_base) -- (:assembly_base) -- (a:assembly_read{ID: $id}) RETURN p`,
            { id }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // all reference_contig of a sample
    async referenceContigsOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (:reference_base) -- (:assembly_base) -- (:assembly_read) -- (a:sample{provided_by: $provided_by}) RETURN p`,
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

    // add a reference_base to a reference_contig
    async addReferenceBaseToReferenceContig(reference_contig_id: string, reference_base_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $reference_contig_id
            })
            MATCH (a:reference_base {
                ID: $reference_base_id
            })
            CREATE (p) -[r:reference_base]-> (a)
            RETURN p`,
            { reference_contig_id, reference_base_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // remove a reference_base from a reference_contig
    async removeReferenceBaseFromReferenceContig(reference_contig_id: string, reference_base_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL} {
                ID: $reference_contig_id
            })
            MATCH (a:reference_base {
                ID: $reference_base_id
            })
            MATCH (p) -[r:reference_base]-> (a)
            DELETE r
            RETURN p`,
            { reference_contig_id, reference_base_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }
}
