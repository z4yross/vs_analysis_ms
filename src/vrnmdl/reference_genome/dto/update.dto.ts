import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class UpdateDTO {
    name: string
    sequence: string
}
