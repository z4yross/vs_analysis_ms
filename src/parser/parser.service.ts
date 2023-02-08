import { Injectable } from '@nestjs/common'

import { CreateDTO } from './dto/create.dto'
import { Entity } from './entity/entity'

import fs from 'fs'

import { SampleService } from '../sample/sample.service'
import { CreateDTO as CreateSampleDTO } from '../sample/dto/create.dto'

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

    constructor(private sampleService: SampleService) {}

    async create(data: CreateDTO): Promise<Entity | undefined> {
        // read csv file
        const csv_loc = data.data
        const csv = await this.read_csv(csv_loc)

        // validate csv file
        const valid = this.validateCSV(csv)
        if (!valid)
            return undefined
        // parse csv file
        const parsed = this.csvToJson(csv)

        // create data object for every module needed

        const createSampleDTO: CreateSampleDTO = {
            seq_method: data.seq_method,
            date: data.date,
            provided_by: data.provided_by,
            origin: data.origin,
            type: 'nanopore',
            processing_date: undefined,
        }

        await this.sampleService.create(createSampleDTO)

        // TODO: create patient if not exists in ptnmdl
        // TODO: create relation to zone
        // TODO: create relation to patient
        // TODO: modify sample to set barcode alias and id

        return
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
}
