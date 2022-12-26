import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    code: string
    gender: string
    age: number
    last_name: string
    first_name: string
    middle_name: string
    height: string
    weight: string
    marital_status: string
    alive: string
}
