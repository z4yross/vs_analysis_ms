import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    code: string
    gender: string
    birth_date: string
    last_names: string
    first_names: string
    height: string
    weight: string
    marital_status: string
    alive: string
}
