import { Injectable } from '@nestjs/common'

import { CreateDTO } from './dto/create.dto'
import { Entity } from './entity/entity'

import { Neo4jService } from 'nest-neo4j'

import fs from 'fs'

import { SampleService } from '../sample/sample.service'
import { CreateDTO as CreateSampleDTO } from '../sample/dto/create.dto'

import { CityService } from '../lctmdl/city/city.service'
import { CityZoneService } from '../lctmdl/city_zone/city_zone.service'
import { CountryService } from '../lctmdl/country/country.service'
import { ProvinceService } from '../lctmdl/province/province.service'

import { PatientService } from '../ptnmdl/patient/patient.service'
import { CreateDTO as CreatePatientDTO } from '../ptnmdl/patient/dto/create.dto'

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
        zone: /^[a-zA-Z0-9 ]{1,30}$/,
        city: /^[a-zA-Z ]{1,30}$/,
        province: /^[a-zA-Z ]{1,30}$/,
        country: /^[a-zA-Z ]{1,30}$/,
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
        private readonly patientService: PatientService
    ) {}

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
            const zone = (await this.cityZoneService.findByName(row.zone)).get()
            // TODO: if zone does not exist, create it

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

    async create(data: CreateDTO): Promise<Entity | undefined> {
        // read csv file
        const csv_loc = data.data
        const csv = await this.read_csv(csv_loc)

        // validate csv file
        const valid = this.validateCSV(csv)
        if (!valid) return undefined
        // parse csv file
        const parsed = this.csvToJson(csv)

        // create batch
        const batch_entity = await this.createBatch(data.provided_by, data.date)

        const batch = batch_entity.get()
        const batch_id = batch.identity.low

        // create samples
        await this.createSamples(parsed, batch_id)
        return batch_entity
    }

    async read_csv(csv_loc: string): Promise<string> {
        const csv = fs.readFileSync(csv_loc, 'utf8')
        return csv
    }

    // validate fields of csv string separated by commas with regexes
    validateCSV(csv: String) {
        // split csv string into array of lines backslash r is carriage return
        const lines = csv.split('\r')
        // split each line into array of fields
        // clean trailing spaces of each field
        const fields = lines.map((line) =>
            line.split(',').map((field) => field.trim())
        )
        // validate each field, skip first line (headers)
        // if there is a field that does not match the regex, return false
        // if line does not have the same number of fields as headers, return false
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
        // split csv string into array of lines backslash r is carriage return
        const lines = csv.split('\r')
        // split each line into array of fields
        // clean trailing spaces of each field
        // for the zone, city, province and country fields replace empty spaces with underscore and set to lower caseF
        const fields = lines.map((line) => {
            const fields = line.split(',').map((field) => field.trim())
            fields[9] = fields[9].replace(/ /g, '_').toLowerCase()
            fields[10] = fields[10].replace(/ /g, '_').toLowerCase()
            fields[11] = fields[11].replace(/ /g, '_').toLowerCase()
            fields[12] = fields[12].replace(/ /g, '_').toLowerCase()
            return fields
        })
        // convert each line into an object with keys from headers
        const json = fields.map((line, index) => {
            if (index === 0) return
            const obj = {}
            for (let i = 0; i < line.length; i++) {
                obj[fields[0][i]] = line[i]
            }
            return obj
        })
        // remove first element (headers)
        json.shift()
        return json
    }


    async runBatch(batch_id: number): Promise<boolean> {

        return false
    }
}
