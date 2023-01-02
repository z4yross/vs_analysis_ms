import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

import { FeatureService } from './feature.service'

@Controller('feature')
export class FeatureController {

    constructor(private readonly featureService: FeatureService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.featureService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.featureService.get(id);
    }

    @Get('assembly/:id')
    async featuresOfAssembly(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.featureService.featuresOfAssembly(id);
    }

    @Get('sample/:provided_by')
    async featuresOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.featureService.featuresOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.featureService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.featureService.delete(id);
    }

    @Put(':assembly_id/:feature_id')
    async addFeatureToAssembly(@Param('assembly_id') assembly_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.featureService.addFeatureToAssembly(assembly_id, feature_id);
    }

    @Delete(':assembly_id/:feature_id')
    async removeFeatureFromAssembly(@Param('assembly_id') assembly_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.featureService.removeFeatureFromAssembly(assembly_id, feature_id);
    }
}
