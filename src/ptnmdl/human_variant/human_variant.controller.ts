import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { HumanVariantService } from './human_variant.service'

@Controller('human-variant')
export class HumanVariantController {
    constructor(private readonly humanVariantService: HumanVariantService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.humanVariantService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.humanVariantService.get(id);
    }

    @Get('patient/:patient')
    async humanVariantsOfPatient(@Param('patient') patient: string): Promise<Entity[] | undefined> {
        return this.humanVariantService.humanVariantsOfPatient(patient);
    }

    @Get('sample/:provided_by')
    async humanVariantsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.humanVariantService.humanVariantsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.humanVariantService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.humanVariantService.delete(id);
    }

    @Put('human_variant_id/patient_id')
    async addPatientToHumanVariant(@Param('human_variant_id') human_variant_id: string, @Param('patient_id') patient_id: string): Promise<Entity | undefined> {
        return this.humanVariantService.addPatient(human_variant_id, patient_id);
    }

    @Delete('human_variant_id/patient_id')
    async removePatientFromHumanVariant(@Param('human_variant_id') human_variant_id: string, @Param('patient_id') patient_id: string): Promise<Entity | undefined> {
        return this.humanVariantService.removePatient(human_variant_id, patient_id);
    }
}
