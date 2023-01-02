import { Controller, Post, Get, Put, Delete, Param, Body  } from '@nestjs/common';

import { Entity } from './entity/entity'
import { UpdateDTO } from './dto/update.dto'
import { CreateDTO } from './dto/create.dto'

import { ProteinService } from './protein.service'

@Controller('protein')
export class ProteinController {
    constructor(private readonly proteinService: ProteinService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.proteinService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.proteinService.get(id);
    }

    @Get('gene/:id')
    async proteinsOfGene(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.proteinService.proteinsOfGene(id);
    }

    @Get('feature/:id')
    async proteinsOfFeature(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.proteinService.proteinsOfFeature(id);
    }

    @Get('assembly/:id')
    async proteinsOfAssembly(@Param('id') id: string): Promise<Entity[] | undefined> {
        return this.proteinService.proteinsOfAssembly(id);
    }

    @Get('sample/:provided_by')
    async proteinsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.proteinService.proteinsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.proteinService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.proteinService.delete(id);
    }

    @Put(':protien_id/:gene_id')
    async addGeneToProtein(@Param('protein_id') protein_id: string, @Param('gene_id') gene_id: string): Promise<Entity | undefined> {
        return this.proteinService.addGene(protein_id, gene_id);
    }

    @Delete(':protein_id/:gene_id')
    async removeGeneFromProtein(@Param('protein_id') protein_id: string, @Param('gene_id') gene_id: string): Promise<Entity | undefined> {
        return this.proteinService.removeGene(protein_id, gene_id);
    }
}
