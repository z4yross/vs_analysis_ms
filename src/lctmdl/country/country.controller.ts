import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'

import { CountryService } from './country.service'

@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}

    @Get(':code')
    async get(@Param('code') code: number): Promise<Entity | undefined> {
        return this.countryService.get(code);
    }

    @Get('province/:province')
    async countryOfProvince(@Param('province') province: number): Promise<Entity[] | undefined> {
        return this.countryService.countryOfProvince(province);
    }

    @Get('city/:city')
    async countryOfCity(@Param('city') city: number): Promise<Entity[] | undefined> {
        return this.countryService.countryOfCity(city);
    }

    @Get('zone/:zone')
    async countryOfZone(@Param('zone') zone: number): Promise<Entity[] | undefined> {
        return this.countryService.countryOfZone(zone);
    }

    @Get('sample/:provided_by')
    async countryOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.countryService.countryOfSample(provided_by);
    }
}
