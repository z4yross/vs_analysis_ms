import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'

@Injectable()
export class CityService {
    constructor(private readonly neo4jService: Neo4jService) {}

    async get(code: number): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (c:city {
                code: $code
            }) RETURN c`,
            { code }
        )

        return res.records.length
            ? new Entity(res.records[0].get('c'))
            : undefined
    }

    // get city of a zone
    async cityOfZone(zone: number): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (z:zone {code: $code} --> c:city) RETURN c`,
            { zone }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('c')))
            : undefined
    }

    // get city of a sample
    async cityOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {provided_by: $provided_by} -- z:zone --> c:city) RETURN c`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('c')))
            : undefined
    }
}
