import { IsNotEmpty } from 'class-validator'
import dayjs from 'dayjs'

export class UpdateDTO {
    length: string
    perc_GC: string
    completness: string
    contigs_num: string
    gene_num: string
    startegy: string
    fasta: string
    vcf: string
    bam: string
    depht: string
    coverage: string
    prequalityfile: string
    postqualityfile: string

    date: string = dayjs().format()
}
