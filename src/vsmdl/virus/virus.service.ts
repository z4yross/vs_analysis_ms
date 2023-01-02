import { Injectable } from '@nestjs/common';

import { Neo4jService } from 'nest-neo4j'

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

@Injectable()
export class VirusService {
    private readonly CLASS_LABEL: string = 'virus'

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
    
    // all virus of a strain
    async virusOfStrain(strainID: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:virus) -- (s:strain{ID: $strainID}) RETURN v`,
            { strainID }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('v')))
            : undefined
    }

    // all virus of a sample
    async virusOfSample(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:virus) -- (:strain) -- (s:sample{provided_by: $provided_by}) RETURN v`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((r) => new Entity(r.get('v')))
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

    // add a virus to a strain
    async addVirusToStrain(virusID: string, strainID: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:${this.CLASS_LABEL} {
                ID: $virusID
            })
            MATCH (s:strain {
                ID: $strainID
            })
            CREATE (v) -[:HAS_VIRUS]-> (s)
            RETURN v`,
            { virusID, strainID }
        )

        return res.records.length
            ? new Entity(res.records[0].get('v'))
            : undefined
    }

    // remove a virus from a strain
    async removeVirusFromStrain(virusID: string, strainID: string): Promise<Entity | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (v:${this.CLASS_LABEL} {
                ID: $virusID
            })
            MATCH (s:strain {
                ID: $strainID
            })
            MATCH (v) -[r:HAS_VIRUS]-> (s)
            DELETE r
            RETURN v`,
            { virusID, strainID }
        )

        return res.records.length
            ? new Entity(res.records[0].get('v'))
            : undefined
    }
}
