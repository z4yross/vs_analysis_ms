import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

import { IntergenicRegionService } from './intergenic_region.service'

@Controller('intergenic-region')
export class IntergenicRegionController {
    constructor(private readonly intergenicRegionService: IntergenicRegionService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.intergenicRegionService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.intergenicRegionService.get(id);
    }

    @Get('feature/:id')
    async intergenicRegionsOfFeature(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.intergenicRegionService.intergenicRegionsOfFeature(id);
    }

    @Get('assembly/:id')
    async intergenicRegionsOfAssembly(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.intergenicRegionService.intergenicRegionsOfAssembly(id);
    }

    @Get('sample/:provided_by')
    async intergenicRegionsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.intergenicRegionService.intergenicRegionsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.intergenicRegionService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.intergenicRegionService.delete(id);
    }

    @Put(':intergenic_region_id/:feature_id')
    async addFeatureToIntergenicRegion(@Param('intergenic_region_id') intergenic_region_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.intergenicRegionService.addFeature(intergenic_region_id, feature_id);
    }

    @Delete(':intergenic_region_id/:feature_id')
    async removeFeatureFromIntergenicRegion(@Param('intergenic_region_id') intergenic_region_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.intergenicRegionService.removeFeature(intergenic_region_id, feature_id);
    }
}
