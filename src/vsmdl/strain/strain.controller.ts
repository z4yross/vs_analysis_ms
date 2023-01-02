import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { StrainService } from './strain.service'

@Controller('strain')
export class StrainController {
    constructor(private readonly strainService: StrainService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.strainService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.strainService.get(id);
    }

    @Get('sample/:provided_by')
    async strainsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.strainService.strainsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.strainService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.strainService.delete(id);
    }

    @Put(':strain/:provided_by')
    async addSampleToStrain(@Param('strain') strain: string, @Param('provided_by') provided_by: string): Promise<Entity | undefined> {
        return this.strainService.addSample(strain, provided_by);
    }

    @Delete(':strain/:provided_by')
    async removeSampleFromStrain(@Param('strain') strain: string, @Param('provided_by') provided_by: string): Promise<Entity | undefined> {
        return this.strainService.removeSample(strain, provided_by);
    }
}
