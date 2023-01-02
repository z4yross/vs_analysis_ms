import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'

@Injectable()
export class CountryService {
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

    // get country of a province
    async countryOfProvince(province: number): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (p:province {code: $code} --> co:country) RETURN co`,
            { province }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('co')))
            : undefined
    }

    // get country of a city
    async countryOfCity(city: number): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (c:city {code: $code} --> p:province --> co:country) RETURN co`,
            { city }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('co')))
            : undefined
    }

    // get country of a zone
    async countryOfZone(zone: number): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (z:zone {code: $code} --> c:city --> p:province --> co:country) RETURN co`,
            { zone }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('co')))
            : undefined
    }

    // get country of a sample
    async countryOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {provided_by: $provided_by} -- z:zone --> c:city --> p:province --> co:country) RETURN co`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('co')))
            : undefined
    }
}
