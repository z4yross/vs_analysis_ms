import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { ReferenceGenomeService } from './reference_genome.service'

@Controller('reference-genome')
export class ReferenceGenomeController {
    constructor(private readonly referenceGenomeService: ReferenceGenomeService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.referenceGenomeService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.referenceGenomeService.get(id);
    }

    @Get('reference_contig/:reference_contig')
    async referenceGenomesOfReferenceContig(@Param('reference_contig') reference_contig: string): Promise<Entity[] | undefined> {
        return this.referenceGenomeService.referenceGenomesOfReferenceContig(reference_contig);
    }

    @Get('reference_base/:reference_base')
    async referenceGenomesOfReferenceBase(@Param('reference_base') reference_base: string): Promise<Entity[] | undefined> {
        return this.referenceGenomeService.referenceGenomesOfReferenceBase(reference_base);
    }

    @Get('assembly_base/:assembly_base')
    async referenceGenomesOfAssemblyBase(@Param('assembly_base') assembly_base: string): Promise<Entity[] | undefined> {
        return this.referenceGenomeService.referenceGenomesOfAssemblyBase(assembly_base);
    }

    @Get('assembly_read/:assembly_read')
    async referenceGenomesOfAssemblyRead(@Param('assembly_read') assembly_read: string): Promise<Entity[] | undefined> {
        return this.referenceGenomeService.referenceGenomesOfAssemblyRead(assembly_read);
    }

    @Get('sample/:provided_by')
    async referenceGenomesOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.referenceGenomeService.referenceGenomesOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.referenceGenomeService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.referenceGenomeService.delete(id);
    }

    @Put(':reference_genome/:reference_contig')
    async addReferenceContigToReferenceGenome(@Param('reference_genome') reference_genome: string, @Param('reference_contig') reference_contig: string): Promise<Entity | undefined> {
        return this.referenceGenomeService.addReferenceContig(reference_genome, reference_contig);
    }

    @Delete(':reference_genome/:reference_contig')
    async removeReferenceContigFromReferenceGenome(@Param('reference_genome') reference_genome: string, @Param('reference_contig') reference_contig: string): Promise<Entity | undefined> {
        return this.referenceGenomeService.removeReferenceContig(reference_genome, reference_contig);
    }
}
