import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { VirusService } from './virus.service'

@Controller('virus')
export class VirusController {
    constructor(private readonly virusService: VirusService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.virusService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.virusService.get(id);
    }

    @Get('strain/:strainID')
    async virusOfStrain(@Param('strainID') strainID: string): Promise<Entity[] | undefined> {
        return this.virusService.virusOfStrain(strainID);
    }

    @Get('sample/:provided_by')
    async virusOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.virusService.virusOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.virusService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.virusService.delete(id);
    }

    @Put(':virus/:strainID')
    async addStrainToVirus(@Param('virus') virus: string, @Param('strainID') strainID: string): Promise<Entity | undefined> {
        return this.virusService.addVirusToStrain(virus, strainID);
    }

    @Delete(':virus/:strainID')
    async removeStrainFromVirus(@Param('virus') virus: string, @Param('strainID') strainID: string): Promise<Entity | undefined> {
        return this.virusService.removeVirusFromStrain(virus, strainID);
    }
}
