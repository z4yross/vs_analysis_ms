import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { AssemblyReadService } from './assembly_read.service'

@Controller('assembly-read')
export class AssemblyReadController {
    constructor(private readonly assemblyReadService: AssemblyReadService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.assemblyReadService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.assemblyReadService.get(id);
    }

    @Get('sample/:provided_by')
    async assemblyReadsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.assemblyReadService.assemblyReadsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.assemblyReadService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.assemblyReadService.delete(id);
    }

    @Put(':assembly_read/:sample_id')
    async addSampleToAssemblyRead(@Param('assembly_read') assembly_read: string, @Param('sample_id') sample_id: string): Promise<Entity | undefined> {
        return this.assemblyReadService.addSample(assembly_read, sample_id);
    }

    @Delete(':assembly_read/:sample_id')
    async removeSampleFromAssemblyRead(@Param('assembly_read') assembly_read: string, @Param('sample_id') sample_id: string): Promise<Entity | undefined> {
        return this.assemblyReadService.removeSample(assembly_read, sample_id);
    }

}
