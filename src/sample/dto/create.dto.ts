import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    @IsNotEmpty()
    seq_method: string

    @IsNotEmpty()
    processing_date: string

    @IsNotEmpty()
    origin: string

    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    provided_by: string

    state: string = 'created'

    date: string = dayjs().format()
}
