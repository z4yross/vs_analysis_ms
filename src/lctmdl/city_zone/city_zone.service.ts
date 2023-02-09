import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'

@Injectable()
export class CityZoneService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async get(code: number): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (z:zone {
                code: $code
            }) RETURN z`,
            { code }
        )

        return res.records.length
            ? new Entity(res.records[0].get('z'))
            : undefined
    }

    // find zone by name
    async findByName(name: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (z:zone {
                name: $name
            }) RETURN z`,
            { name }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('z')))[0]
            : undefined
    }

    // get zone of sample
    async zoneOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {provided_by: $provided_by} --> z:zone) RETURN z`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('z')))
            : undefined
    }

    // add zone to sample
    async addZoneToSample(sample_id: string, code: number): Promise<Entity | undefined> { // add zone to sample
        const res = await this.neo4jService.write(
            `MATCH (s:sample {
                ID: $sample_id
            })
            MATCH (z:zone {
                code: $code
            })
            MERGE (s)-[:in]->(z)
            RETURN s`,
            { sample_id, code }
        )

        return res.records.length
            ? new Entity(res.records[0].get('s'))
            : undefined
    }

    // remove zone from sample
    async removeZoneFromSample(sample_id: string, code: number): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `MATCH (s:sample {
                ID: $sample_id
            }),
            MATCH (z:zone {
                code: $code
            })
            MATCH (s)-[r:in]->(z)
            DELETE r
            RETURN s`,
            { sample_id, code }
        )

        return res.records.length
            ? new Entity(res.records[0].get('s'))
            : undefined
    }
}
