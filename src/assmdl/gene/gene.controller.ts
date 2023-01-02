import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

import { GeneService } from './gene.service'

@Controller('gene')
export class GeneController {
    constructor(private readonly geneService: GeneService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.geneService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.geneService.get(id);
    }

    @Get('assembly/:id')
    async genesOfAssembly(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.geneService.genesOfAssembly(id);
    }

    @Get('feature/:id')
    async genesOfFeature(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.geneService.genesOfFeature(id);
    }

    @Get('sample/:provided_by')
    async genesOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.geneService.genesOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.geneService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.geneService.delete(id);
    }

    @Put(':gene_id/:feature_id')
    async addFeatureToGene(@Param('gene_id') gene_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.geneService.addFeature(gene_id, feature_id);
    }

    @Delete(':gene_id/:feature_id')
    async removeFeatureFromGene(@Param('gene_id') gene_id: string, @Param('feature_id') feature_id: string): Promise<Entity | undefined> {
        return this.geneService.removeFeature(gene_id, feature_id);
    }
}
