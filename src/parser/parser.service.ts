import { Injectable } from '@nestjs/common'

import { CreateDTO } from './dto/create.dto'
import { Entity } from './entity/entity'

import { Neo4jService } from 'nest-neo4j'

import * as dayjs from 'dayjs'

import * as fs from 'fs'

import { SampleService } from '../sample/sample.service'
import { CreateDTO as CreateSampleDTO } from '../sample/dto/create.dto'

import { CityZoneService } from '../lctmdl/city_zone/city_zone.service'

import { PatientService } from '../ptnmdl/patient/patient.service'
import { CreateDTO as CreatePatientDTO } from '../ptnmdl/patient/dto/create.dto'

import { PipelineService } from '../pipeline/pipeline.service'
import { CreateDTO as CreatePipelineDTO } from '../pipeline/dto/create.dto'

@Injectable()
export class ParserService {
    constructor(
        private readonly neo4jService: Neo4jService,
        private readonly sampleService: SampleService,
        private readonly cityZoneService: CityZoneService,
        private readonly patientService: PatientService,
        private readonly pipelineService: PipelineService
    ) {}

    async createBatch(
        provided_by: string,
        date: string,
        virus: string
    ): Promise<Entity | undefined> {
        const res = await this.neo4jService.write(
            `CREATE (b:batch $data) RETURN b`,
            { data: { provided_by, date, virus } }
        )

        return res.records.length
            ? new Entity(res.records[0].get('b'))
            : undefined
    }

    async createSamples(data: CreateDTO, batch_id: number) {
        for (const row of data.data) {
            const sampleDTO: CreateSampleDTO = {
                seq_method: data.seq_method,
                date: data.date,
                provided_by: data.provided_by,
                origin: data.origin,
                processing_date: undefined,
                alias: row.sample_alias,
                barcode: row.sample_barcode,
            }

            const patientDTO: CreatePatientDTO = {
                first_names: row.patient_first_names,
                last_names: row.patient_last_names,
                birth_date: row.patient_birth_date,
                code: row.patient_id,
                gender: row.patient_gender,
                height: row.patient_height,
                weight: row.patient_weight,
                marital_status: row.patient_marital_status,
                alive: row.patient_alive,
            }

            const patient = (await this.patientService.create(patientDTO)).get()
            const sample = (await this.sampleService.create(sampleDTO)).get()

            // set patient to sample
            await this.patientService.addSample(
                sample.id,
                patient.id
            )

            // get zone
            const zone = (await this.cityZoneService.get(row.sample_zone)).get()

            // set zone to sample
            await this.cityZoneService.addZoneToSample(
                sample.id,
                zone.code
            )

            // add relationship between sample and batch
            await this.neo4jService.write(
                `MATCH (s:sample), (b:batch) WHERE ID(s) = $sample_id AND ID(b) = $batch_id CREATE (s)-[:sample_of]->(b)`,
                { sample_id: sample.id, batch_id }
            )
        }
    }

    async create(data: CreateDTO): Promise<Entity | undefined> {
        const batch_entity = await this.createBatch(
            data.provided_by,
            data.date,
            data.virus
        )
        this.createSamples(data, batch_entity.get().id)

        const batch = batch_entity.get()
        const batch_id = batch.id

        // register pipeline
        const pipelineDTO: CreatePipelineDTO = new CreatePipelineDTO()
        const pipe = (await this.pipelineService.create(pipelineDTO)).get()
        const pipe_id = pipe.id

        // add relationship between batch and pipeline
        await this.pipelineService.addPipeilineToBatch(pipe_id, batch_id)

        return batch_entity
    }

    async queueBatchProcessing(
        batch_id: string,
        provided_by: string
    ): Promise<boolean> {
        const batch_entity = (
            await this.neo4jService.read(
                `MATCH (b:batch) WHERE ID(b) = $batch_id AND b.provided_by = $provided_by RETURN b`,
                { batch_id, provided_by }
            )
        )

        if (!batch_entity.records.length) throw new Error('Batch not found')    

        const pipeline_entity = (
            await this.pipelineService.getBatchPipelines(batch_id)
        )

        const pipeline = pipeline_entity.get()

        // if the pipeline is not in [created, processed, failed, stopped] state, throw error
        const allowed_states = ['created', 'processed', 'failed', 'stopped', 'aborted']
        if (!allowed_states.includes(pipeline.processing_state))
            throw new Error('Pipeline is not in a valid state')

        // update pipeline processing_state to queued
        await this.pipelineService.update(pipeline.id, 'queued')

        return true
    }

    async abortBatchProcessing(
        batch_id: string,
        provided_by: string
    ): Promise<boolean> {
        const batch_entity = (
            await this.neo4jService.read(
                `MATCH (b:batch) WHERE ID(b) = $batch_id AND b.provided_by = $provided_by RETURN b`,
                { batch_id, provided_by }
            )
        )

        if (!batch_entity.records.length) throw new Error('Batch not found')  

        const pipeline_entity = (
            await this.pipelineService.getBatchPipelines(batch_id)
        )

        const pipeline = pipeline_entity.get()
        
        // if the pipeline is not in [started] state, throw error
        const allowed_states = ['started', 'queued']
        if (!allowed_states.includes(pipeline.processing_state))
            throw new Error('Pipeline is not in a valid state')

        // update pipeline processing_state to aborted
        await this.pipelineService.update(pipeline.id, 'aborted')
        return true
    }

    async getAllBatchsOfProvider(
        provided_by: string
    ): Promise<Entity[] | undefined> {
        const res = await this.neo4jService.read(
            `MATCH (b:batch) WHERE b.provided_by = $provided_by RETURN b`,
            { provided_by }
        )

        return res.records.length
            ? res.records.map((record) => new Entity(record.get('b')))
            : undefined
    }
}
