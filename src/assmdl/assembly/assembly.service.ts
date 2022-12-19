import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class AssemblyService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        return this.neo4jService
            .write(
                `CREATE (a:assembly {
                    length: $length,
                    perc_GC: $perc_GC,
                    completness: $completness,
                    contigs_num: $contigs_num,
                    gene_num: $gene_num,
                    startegy: $startegy,
                    fasta: $fasta,
                    vcf: $vcf,
                    bam: $bam,
                    depht: $depht,
                    coverage: $coverage,
                    prequalityfile: $prequalityfile,
                    postqualityfile: $postqualityfile,
                }) RETURN a`,
                {
                    ...data,
                }
            )
            .then(({ records }) => new Entity(records[0].get('a')))
    }

    // assembly with id
    async get(id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (a:assembly {
                ID: $id
            }) RETURN a`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('a'))
            : undefined
    }

    // all asseblys that process a sample
    async all(sampleID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (a:assembly-[PROCESS]-s:sample{ID:$id}) RETURN a`,
            { id: sampleID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('a')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (a:assembly {
                ID: $id
            })
            SET a += $update
            RETURN a`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('a'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (a:assembly{
                ID: $id
            })
            REMOVE a
            RETURN a`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }
}
