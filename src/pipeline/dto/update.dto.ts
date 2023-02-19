import { IsNotEmpty } from 'class-validator'
import * as dayjs from 'dayjs'

export class UpdateDTO {
    modified_at: string
    processing_time: string
    processing_date: string
    processing_message: string

    @IsNotEmpty()
    processing_state: string
    
}