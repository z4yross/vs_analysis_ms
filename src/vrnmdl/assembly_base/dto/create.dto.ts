import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    name: string
    position: number
    MAPQ: string
    QNAME: string
    FLAG: number
    POS: string
    TLEN: string
}
