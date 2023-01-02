import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { ReferenceBaseService } from './reference_base.service'

@Controller('reference-base')
export class ReferenceBaseController {
    constructor(private readonly referenceBaseService: ReferenceBaseService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.referenceBaseService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.referenceBaseService.get(id);
    }

    @Get('assembly_base/:assembly_base')
    async referenceBasesOfAssemblyBase(@Param('assembly_base') assembly_base: string): Promise<Entity[] | undefined> {
        return this.referenceBaseService.referenceBasesOfAssemblyBase(assembly_base);
    }

    @Get('sample/:provided_by')
    async referenceBasesOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.referenceBaseService.referenceBasesOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.referenceBaseService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.referenceBaseService.delete(id);
    }

    @Put(':assembly_base/:reference_base')
    async addAssemblyBaseToReferenceBase(@Param('assembly_base') assembly_base: string, @Param('reference_base') reference_base: string): Promise<Entity | undefined> {
        return this.referenceBaseService.addAssemblyBaseToReferenceBase(assembly_base, reference_base);
    }

    @Delete(':assembly_base/:reference_base')
    async removeAssemblyBaseFromReferenceBase(@Param('assembly_base') assembly_base: string, @Param('reference_base') reference_base: string): Promise<Entity | undefined> {
        return this.referenceBaseService.removeAssemblyBaseFromReferenceBase(assembly_base, reference_base);
    }
}
