import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    date: string = dayjs().format()
    data: string
    provided_by: string
    seq_method: string = "nanopore"
    origin: string
    strain_id: string
    virus_id: string
}
