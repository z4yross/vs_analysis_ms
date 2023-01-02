import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'

import { CityZoneService } from './city_zone.service'

@Controller('city-zone')
export class CityZoneController {
    constructor(private readonly cityZoneService: CityZoneService) {}

    @Get(':code')
    async get(@Param('code') code: number): Promise<Entity | undefined> {
        return this.cityZoneService.get(code);
    }

    @Get('sample/:provided_by')
    async zoneOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.cityZoneService.zoneOfSample(provided_by);
    }

    @Put(':sample_id/:code')
    async addZoneToSample(@Param('sample_id') sample_id: string, @Param('code') code: number): Promise<Entity | undefined> {
        return this.cityZoneService.addZoneToSample(sample_id, code);
    }

    @Delete(':sample_id/:code')
    async removeZoneFromSample(@Param('sample_id') sample_id: string, @Param('code') code: number): Promise<Entity | undefined> {
        return this.cityZoneService.removeZoneFromSample(sample_id, code);
    }
}
