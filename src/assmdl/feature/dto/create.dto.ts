import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    type: string
    start: number
    end: number
    name: string
    sequence: string
    length: string
    md5checksum: string
    annotation_level: string
    access_time: string
    last_modified: string = dayjs().format()
    frame: string
}
