import { Injectable } from '@nestjs/common'

import { CreateDTO } from './dto/create.dto'
import { Entity } from './entity/entity'

import { Neo4jService } from 'nest-neo4j'

import dayjs from 'dayjs'

import * as fs from 'fs'

import { SampleService } from '../sample/sample.service'
import { CreateDTO as CreateSampleDTO } from '../sample/dto/create.dto'

import { CityService } from '../lctmdl/city/city.service'
import { CityZoneService } from '../lctmdl/city_zone/city_zone.service'
import { CountryService } from '../lctmdl/country/country.service'
import { ProvinceService } from '../lctmdl/province/province.service'

import { PatientService } from '../ptnmdl/patient/patient.service'
import { CreateDTO as CreatePatientDTO } from '../ptnmdl/patient/dto/create.dto'

import { PipelineService } from '../pipeline/pipeline.service'
import { CreateDTO as CreatePipelineDTO } from '../pipeline/dto/create.dto'

@Injectable()
export class ParserService {
    regexes = {
        patient_id: /^\d{1,20}$/,
        patient_first_names: /^[a-zA-Z ]{1,30}$/,
        patient_last_names: /^[a-zA-Z ]{1,30}$/,
        patient_birth_date: /^\d{2}\/\d{2}\/\d{4}$/,
        patient_gender: /^[MFN]$/,
        patient_height: /^\d{1,3}(\.\d{1,2})?|N$/,
        patient_weight: /^\d{1,3}(\.\d{1,2})?|N$/,
        patient_marital_status: /^[SMDN]$/,
        patient_alive: /^[01]$/,
        zone: /^[0-9]{1,5}$/,
        city: /^[0-9]{1,5}$/,
        province: /^[0-9]{1,5}$/,
        // country: /^[a-zA-Z ]{1,30}$/,
        sample_barcode: /^\d{1,20}$/,
        sample_id: /^\d{1,20}$/,
        sample_alias: /^[a-zA-Z0-9 ]{1,30}$/,
    }

    constructor(
        private readonly neo4jService: Neo4jService,
        private readonly sampleService: SampleService,
        private readonly cityService: CityService,
        private readonly cityZoneService: CityZoneService,
        private readonly countryService: CountryService,
        private readonly provinceService: ProvinceService,
        private readonly patientService: PatientService,
        private readonly pipelineService: PipelineService
    ) {}

    async read_csv(csv_loc: string): Promise<string> {
        const csv = fs.readFileSync(csv_loc, 'utf8')
        return csv
    }

    validateCSV(csv: String) {
        const lines = csv.split('\r')
        const fields = lines.map((line) =>
            line.split(',').map((field) => field.trim())
        )

        for (let i = 1; i < fields.length; i++) {
            if (fields[i].length !== fields[0].length) return false
            for (let j = 0; j < fields[i].length; j++) {
                if (
                    !this.regexes[Object.keys(this.regexes)[j]].test(
                        fields[i][j]
                    )
                )
                    return false
            }
        }
    }

    csvToJson(csv: String) {
        const lines = csv.split('\r')
        const fields = lines.map((line) =>
            line.split(',').map((field) => field.trim())
        )

        const json = fields.map((line, index) => {
            if (index === 0) return
            const obj = {}
            for (let i = 0; i < line.length; i++) {
                obj[fields[0][i]] = line[i]
            }
            return obj
        })

        json.shift()
        return json
    }

    async createBatch(
        provided_by: string,
        date: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `CREATE (b:batch {provided_by: $provided_by, date: $date}) RETURN b`,
            { provided_by, date }
        )

        return res.records.length
            ? new Entity(res.records[0].get('b'))
            : undefined
    }

    async createSamples(rows: any[], batch_id: number) {
        for (const row of rows) {
            const sampleDTO: CreateSampleDTO = {
                seq_method: row.seq_method,
                date: row.date,
                provided_by: row.provided_by,
                origin: row.origin,
                type: 'nanopore',
                processing_date: undefined,
                alias: row.alias,
                barcode: row.barcode,
            }

            const patientDTO: CreatePatientDTO = {
                first_names: row.patient_first_names,
                last_names: row.patient_last_names,
                birth_date: row.patient_birth_date,
                code: row.patient_id,
                gender: row.gender,
                height: row.height,
                weight: row.weight,
                marital_status: row.marital_status,
                alive: row.alive,
            }

            const patient = (await this.patientService.create(patientDTO)).get()
            const sample = (await this.sampleService.create(sampleDTO)).get()

            // set patient to sample
            await this.patientService.addSample(
                sample.identity.low,
                patient.identity.low
            )

            // get zone
            const zone = (await this.cityZoneService.get(row.zone)).get()

            // set zone to sample
            await this.cityZoneService.addZoneToSample(
                sample.identity.low,
                zone.code
            )

            // add relationship between sample and batch
            await this.neo4jService.write(
                `MATCH (s:sample), (b:batch) WHERE ID(s) = $sample_id AND ID(b) = $batch_id CREATE (s)-[:sample_of]->(b)`,
                { sample_id: sample.identity.low, batch_id }
            )
        }
    }

    // creates a cvb file with columns sample_id, barcode
    async createSampleSheet(data: CreateDTO, parsed: any[], batch_id: number) {
        const csv_loc = `/storage/${data.provided_by}/${batch_id}/sample_sheet/sample_sheet.csv`
        const csv = 'sample_id,barcode\r'
        const rows = parsed.map((row) => {
            return `${row.sample_id},${row.sample_barcode}`
        })

        fs.writeFileSync(csv_loc, csv + rows.join('\r'))

        // TODO: notify to storage ms using the message queue that a new file has been created
    }

    async create(data: CreateDTO): Promise<Entity | undefined> {
        const csv_loc = data.data
        const csv = await this.read_csv(csv_loc)

        const valid = this.validateCSV(csv)
        if (!valid) return undefined

        const parsed = this.csvToJson(csv)

        const batch_entity = await this.createBatch(data.provided_by, data.date)

        const batch = batch_entity.get()
        const batch_id = batch.identity.low

        await this.createSampleSheet(data, parsed, batch_id)
        // register pipeline

        const pipelineDTO: CreatePipelineDTO = new CreatePipelineDTO()
        const pipe = (await this.pipelineService.create(pipelineDTO)).get()
        const pipe_id = pipe.identity.low

        // add relationship between batch and pipeline
        await this.pipelineService.addPipeilineToBatch(pipe_id, batch_id)

        return batch_entity
    }

    async queueBatchProcessing(
        batch_id: string,
        provided_by: string
    ): Promise<boolean> {
        // TODO: get pipiline with relationship batch->pipeline
        // update pipeline processing_state to queued

        // check if there is a batch with the id and provided_by
        const batch = (
            await this.neo4jService.read(
                `MATCH (b:batch) WHERE ID(b) = $batch_id AND b.provided_by = $provided_by RETURN b`,
                { batch_id, provided_by }
            )
        ).records[0].get('b')

        if (!batch) throw new Error('Batch not found')

        const pipeline = (
            await this.pipelineService.getPipelineBatch(batch_id)
        ).get()
        // if the pipeline is not in [created, processed, failed, stopped] state, throw error
        const allowed_states = ['created', 'processed', 'failed', 'stopped']
        if (!allowed_states.includes(pipeline.properties.processing_state))
            throw new Error('Pipeline is not in a valid state')

        // update pipeline processing_state to queued
        await this.pipelineService.update(pipeline.identity.low, 'queued')

        return true
    }

    async abortBatchProcessing(
        batch_id: string,
        provided_by: string
    ): Promise<boolean> {
        // TODO: get pipiline with relationship batch->pipeline
        // update pipeline processing_state to aborted

        // check if there is a batch with the id and provided_by
        const batch = (
            await this.neo4jService.read(
                `MATCH (b:batch) WHERE ID(b) = $batch_id AND b.provided_by = $provided_by RETURN b`,
                { batch_id, provided_by }
            )
        ).records[0].get('b')

        if (!batch) throw new Error('Batch not found')

        const pipeline = (
            await this.pipelineService.getPipelineBatch(batch_id)
        ).get()
        // if the pipeline is not in [started] state, throw error
        const allowed_states = ['started']
        if (!allowed_states.includes(pipeline.properties.processing_state))
            throw new Error('Pipeline is not in a valid state')

        // update pipeline processing_state to aborted
        await this.pipelineService.update(pipeline.identity.low, 'aborted')
        return true
    }

    async getAllBatchsOfProvider(provided_by: string): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (b:batch) WHERE b.provided_by = $provided_by RETURN b`,
            { provided_by }
        )

        return res.records.length ?
            res.records.map((record) => new Entity(record.get('b'))) :
            undefined
    }
}
