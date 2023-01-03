import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    processing_state: string = 'created'
    modified_at: string = dayjs().toISOString()
    processing_time: string
    processing_date: string
    processing_message: string
}
