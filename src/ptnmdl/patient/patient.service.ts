import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class PatientService {
    private readonly CLASS_LABEL: string = 'patient'

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
            `MATCH (p:${this.CLASS_LABEL})
            WHERE ID(p) = $id
            RETURN p`,
            { id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // all patients for a sample
    async patientsOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (a:sample{provided_by: $provided_by}) RETURN p`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    async update(id: string, update: UpdateDTO): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL})
            WHERE ID(p) = $id
            SET p += $update
            RETURN p`,
            { id, update }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    async delete(id: string): Promise<string | undefined> {
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL})
            WHERE ID(p) = $id
            REMOVE p
            RETURN p`,
            { id }
        )

        console.log(res)

        return res.records.length ? 'done' : undefined
    }

    // add a sample to a patient
    async addSample(sample_id: string, patient_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL}), (s:sample)
            WHERE ID(p) = $patient_id AND ID(s) = $sample_id
            CREATE (p) -[:HAS_SAMPLE]-> (s)
            RETURN p`,
            { patient_id, sample_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }

    // remove a sample from a patient
    async removeSample(sample_id: string, patient_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `MATCH (p:${this.CLASS_LABEL}) -[r]- (s:sample)
            WHERE ID(p) = $patient_id AND ID(s) = $sample_id
            DELETE r
            RETURN p`,
            { patient_id, sample_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('p'))
            : undefined
    }
}
