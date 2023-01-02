import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'

import { ProvinceService } from './province.service'

@Controller('province')
export class ProvinceController {
    constructor(private readonly provinceService: ProvinceService) {}

    @Get(':code')
    async get(@Param('code') code: number): Promise<Entity | undefined> {
        return this.provinceService.get(code);
    }

    @Get('city/:city')
    async provinceOfCity(@Param('city') city: number): Promise<Entity[] | undefined> {
        return this.provinceService.provinceOfCity(city);
    }

    @Get('zone/:zone')
    async provinceOfZone(@Param('zone') zone: number): Promise<Entity[] | undefined> {
        return this.provinceService.provinceOfZone(zone);
    }

    @Get('sample/:provided_by')
    async provinceOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.provinceService.provinceOfSample(provided_by);
    }
}
