import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class UpdateDTO {
    seq_method: string
    processing_date: string
    origin: string
    type: string
    date: string = dayjs().format()
}
