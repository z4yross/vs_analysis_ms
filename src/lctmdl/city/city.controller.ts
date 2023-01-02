import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'

import { CityService } from './city.service'

@Controller('city')
export class CityController {
    constructor(private readonly cityService: CityService) {}

    @Get(':code')
    async get(@Param('code') code: number): Promise<Entity | undefined> {
        return this.cityService.get(code);
    }

    @Get('zone/:zone')
    async cityOfZone(@Param('zone') zone: number): Promise<Entity[] | undefined> {
        return this.cityService.cityOfZone(zone);
    }

    @Get('sample/:provided_by')
    async cityOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.cityService.cityOfSample(provided_by);
    }
}
