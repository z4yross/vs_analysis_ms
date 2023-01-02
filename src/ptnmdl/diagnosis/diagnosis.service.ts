import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class DiagnosisService {
    private readonly CLASS_LABEL: string = 'diagnosis'

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

    // all diagnoses for a patient
    async diagnosesOfPation(id: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (a:patient{ID: $id}) RETURN p`,
            { id }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // all diagnoses for a sample
    async diagnosesOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:${this.CLASS_LABEL}) -- (:patient) -- (a:sample{provided_by: $provided_by}) RETURN p`,
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

    // add a patient to a diagnosis
    async addPatientToDiagnosis(patient_id: string, diagnosis_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (d:${this.CLASS_LABEL} {
                ID: $diagnosis_id
            })
            MATCH (p:patient {
                ID: $patient_id
            })
            MERGE (d) - [:has_patient] -> (p)
            RETURN d`,
            { patient_id, diagnosis_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('d'))
            : undefined
    }

    // remove a patient from a diagnosis
    async removePatientFromDiagnosis(patient_id: string, diagnosis_id: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (d:${this.CLASS_LABEL} {
                ID: $diagnosis_id
            })
            MATCH (p:patient {
                ID: $patient_id
            })
            MATCH (d) - [r:has_patient] -> (p)
            DELETE r
            RETURN d`,
            { patient_id, diagnosis_id }
        )

        return res.records.length
            ? new Entity(res.records[0].get('d'))
            : undefined
    }
}
