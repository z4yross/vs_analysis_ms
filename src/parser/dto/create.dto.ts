import { IsNotEmpty, IsOptional } from 'class-validator'
import * as dayjs from 'dayjs'

export class CreateDTO {
    @IsOptional()
    date: string = dayjs().format()
    @IsNotEmpty()
    data: Array<
        {
            patient_id: string
            patient_first_names: string
            patient_last_names: string
            patient_birth_date: string
            patient_gender: string
            patient_height: string
            patient_weight: string
            patient_marital_status: string
            patient_alive: boolean
            sample_zone: number
            sample_city: number
            sample_province: number
            sample_barcode: string
            sample_id: string
            sample_alias: string
        }
    >
    @IsNotEmpty()
    provided_by: string
    @IsNotEmpty()
    seq_method: string = 'nanopore'
    @IsNotEmpty()
    origin: string
    @IsNotEmpty()
    virus: string
}
