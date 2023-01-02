import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { AssemblyBaseService } from './assembly_base.service'

@Controller('assembly-base')
export class AssemblyBaseController {
    constructor(private readonly assemblyBaseService: AssemblyBaseService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.assemblyBaseService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.assemblyBaseService.get(id);
    }

    @Get('assembly_read/:assembly_read')
    async assemblyBasesOfAssemblyRead(@Param('assembly_read') assembly_read: string): Promise<Entity[] | undefined> {
        return this.assemblyBaseService.assemblyBasesOfAssemblyRead(assembly_read);
    }

    @Get('sample/:provided_by')
    async assemblyBasesOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.assemblyBaseService.assemblyBasesOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.assemblyBaseService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.assemblyBaseService.delete(id);
    }

    @Put(':assembly_read/:assembly_base')
    async addAssemblyReadToAssemblyBase(@Param('assembly_read') assembly_read: string, @Param('assembly_base') assembly_base: string): Promise<Entity | undefined> {
        return this.assemblyBaseService.addAssemblyReadToAssemblyBase(assembly_read, assembly_base);
    }

    @Delete(':assembly_read/:assembly_base')
    async removeAssemblyReadFromAssemblyBase(@Param('assembly_read') assembly_read: string, @Param('assembly_base') assembly_base: string): Promise<Entity | undefined> {
        return this.assemblyBaseService.removeAssemblyReadFromAssemblyBase(assembly_read, assembly_base);
    }
}
