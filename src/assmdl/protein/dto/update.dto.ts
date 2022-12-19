import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class UpdateDTO {
    name: string
    ncbiref: string
    uniprotref: string
    pdref: string
}
