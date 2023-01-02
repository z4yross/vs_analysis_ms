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

    // get zone of sample
    async cityOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {provided_by: $provided_by} --> z:zone) RETURN z`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('z')))
            : undefined
    }
}
