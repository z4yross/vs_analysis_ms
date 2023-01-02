import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

import { UtrService } from './utr.service'

@Controller('utr')
export class UtrController {
    constructor(private readonly utrService: UtrService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.utrService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.utrService.get(id);
    }

    @Get('feature/:feature_id')
    async utrsOfFeature(@Param('feature_id') feature_id: string): Promise<Entity[] | undefined> {
        return this.utrService.utrsOfFeature(feature_id);
    }

    @Get('assembly/:id')
    async utrsOfAssembly(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.utrService.utrsOfAssembly(id);
    }

    @Get('sample/:provided_by')
    async utrsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.utrService.utrsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.utrService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.utrService.delete(id);
    }

    @Put(':utr_id/:feature_id')
    async addUtrToFeature(@Param('utr_id') utr_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.utrService.addFeature(utr_id, feature_id);
    }

    @Delete(':utr_id/:feature_id')
    async removeUtrFromFeature(@Param('utr_id') utr_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.utrService.removeFeature(utr_id, feature_id);
    }


}
