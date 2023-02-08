import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    processing_date: string
    seq_method: string
    origin: string
    type: string
    provided_by: string
    date: string = dayjs().format()
}
