import { Injectable } from '@nestjs/common'

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'

@Injectable()
export class ProvinceService {
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

    // get province of a city
    async provinceOfCity(city: number): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (c:city {code: $code} --> p:province) RETURN p`,
            { city }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // get province of a zone
    async provinceOfZone(zone: number): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (z:zone {code: $code} --> c:city --> p:province) RETURN p`,
            { zone }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }

    // get province of a sample
    async provinceOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (s:sample {provided_by: $provided_by} -- z:zone --> c:city --> p:province) RETURN p`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('p')))
            : undefined
    }
}
