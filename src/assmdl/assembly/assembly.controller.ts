import { Controller, Get, Param, Post, Put, Delete, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

import { AssemblyService } from './assembly.service'

@Controller('assembly')
export class AssemblyController {

    constructor(private readonly assemblyService: AssemblyService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.assemblyService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.assemblyService.get(id);
    }

    @Get('sample/:provided_by')
    async assemblysOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.assemblyService.assemblysOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.assemblyService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.assemblyService.delete(id);
    }

    @Put(':sample_id/:assembly_id')
    async addSampleToAssembly(@Param('sample_id') sample_id: string, @Param('assembly_id') assembly_id: string): Promise<Entity | undefined> {
        return this.assemblyService.addSampleToAssembly(sample_id, assembly_id);
    }

    @Delete(':sample_id/:assembly_id')
    async removeSampleFromAssembly(@Param('sample_id') sample_id: string, @Param('assembly_id') assembly_id: string): Promise<Entity | undefined> {
        return this.assemblyService.removeSampleFromAssembly(sample_id, assembly_id);
    }
}
