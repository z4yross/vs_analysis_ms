import { IsNotEmpty } from 'class-validator'
import * as dayjs from 'dayjs'

export class CreateDTO {
    processing_date: string
    seq_method: string
    origin: string
    provided_by: string
    date: string = dayjs().format()
    alias: string
    barcode: string
}
