import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class CreateDTO {
    disease_severity: string
    contagious_date: string
    disease_classification: string
    disease_name: string
    contagious_place: string
    comorbilities: string
}
