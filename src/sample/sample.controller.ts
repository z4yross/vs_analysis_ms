import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { SampleService } from './sample.service'

@Controller('sample')
export class SampleController {
    constructor(private readonly sampleService: SampleService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.sampleService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.sampleService.get(id);
    }

    @Get('provided_by/:provided_by')
    async samplesOfProvider(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.sampleService.samplesOfProvider(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.sampleService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.sampleService.delete(id);
    }
}
