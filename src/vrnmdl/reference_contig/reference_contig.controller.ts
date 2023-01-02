import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { ReferenceContigService } from './reference_contig.service'

@Controller('reference-contig')
export class ReferenceContigController {
    constructor(private readonly referenceContigService: ReferenceContigService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.referenceContigService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.referenceContigService.get(id);
    }

    @Get('reference_base/:reference_base')
    async referenceContigsOfReferenceBase(@Param('reference_base') reference_base: string): Promise<Entity[] | undefined> {
        return this.referenceContigService.referenceContigsOfReferenceBase(reference_base);
    }

    @Get('assembly_base/:assembly_base')
    async referenceContigsOfAssemblyBase(@Param('assembly_base') assembly_base: string): Promise<Entity[] | undefined> {
        return this.referenceContigService.referenceContigsOfAssemblyBase(assembly_base);
    }

    @Get('assembly_read/:assembly_read')
    async referenceContigsOfAssemblyRead(@Param('assembly_read') assembly_read: string): Promise<Entity[] | undefined> {
        return this.referenceContigService.referenceContigsOfAssemblyRead(assembly_read);
    }

    @Get('sample/:provided_by')
    async referenceContigsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.referenceContigService.referenceContigsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.referenceContigService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.referenceContigService.delete(id);
    }

    @Put(':reference_contig/:reference_base')
    async addReferenceBaseToReferenceContig(@Param('reference_contig') reference_contig: string, @Param('reference_base') reference_base: string): Promise<Entity | undefined> {
        return this.referenceContigService.addReferenceBaseToReferenceContig(reference_contig, reference_base);
    }

    @Delete(':reference_contig/:reference_base')
    async removeReferenceBaseFromReferenceContig(@Param('reference_contig') reference_contig: string, @Param('reference_base') reference_base: string): Promise<Entity | undefined> {
        return this.referenceContigService.removeReferenceBaseFromReferenceContig(reference_contig, reference_base);
    }
}
