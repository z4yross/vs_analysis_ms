import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { DiagnosisService } from './diagnosis.service'

@Controller('diagnosis')
export class DiagnosisController {
    constructor(private readonly diagnosisService: DiagnosisService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.diagnosisService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.diagnosisService.get(id);
    }

    @Get('patient/:patient')
    async diagnosesOfPatient(@Param('patient') patient: string): Promise<Entity[] | undefined> {
        return this.diagnosisService.diagnosesOfPatient(patient);
    }

    @Get('sample/:provided_by')
    async diagnosesOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.diagnosisService.diagnosesOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.diagnosisService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.diagnosisService.delete(id);
    }

    @Put('patient_id/diagnosis_id')
    async addPatientToDiagnosis(@Param('patient_id') patient_id: string, @Param('diagnosis_id') diagnosis_id: string): Promise<Entity | undefined> {
        return this.diagnosisService.addPatientToDiagnosis(patient_id, diagnosis_id);
    }

    @Delete('patient_id/diagnosis_id')
    async removePatientFromDiagnosis(@Param('patient_id') patient_id: string, @Param('diagnosis_id') diagnosis_id: string): Promise<Entity | undefined> {
        return this.diagnosisService.removePatientFromDiagnosis(patient_id, diagnosis_id);
    }
}
