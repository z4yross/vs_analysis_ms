import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';

import { Entity } from './entity/entity'
import { CreateDTO } from './dto/create.dto'
import { UpdateDTO } from './dto/update.dto'

import { PatientService } from './patient.service'

@Controller('patient')
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.patientService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.patientService.get(id);
    }

    @Get('sample/:provided_by')
    async patientsOfSample(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.patientService.patientsOfSample(provided_by);
    }

    @Put(':id')
    async update(@Param(':id') id: string, @Body() update: UpdateDTO): Promise<Entity | undefined> {
        return this.patientService.update(id, update);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string | undefined> {
        return this.patientService.delete(id);
    }

    @Put('sample_id/patient_id')
    async addPatientToSample(@Param('sample_id') sample_id: string, @Param('patient_id') patient_id: string): Promise<Entity | undefined> {
        return this.patientService.addSample(sample_id, patient_id);
    }

    @Delete('sample_id/patient_id')
    async removePatientFromSample(@Param('sample_id') sample_id: string, @Param('patient_id') patient_id: string): Promise<Entity | undefined> {
        return this.patientService.removeSample(sample_id, patient_id);
    }

    @Put('strain_id/patient_id')
    async addPatientToStrain(@Param('strain_id') strain_id: string, @Param('patient_id') patient_id: string): Promise<Entity | undefined> {
        return this.patientService.addStrainToPatient(strain_id, patient_id);
    }

    @Delete('strain_id/patient_id')
    async removePatientFromStrain(@Param('strain_id') strain_id: string, @Param('patient_id') patient_id: string): Promise<Entity | undefined> {
        return this.patientService.removeStrainFromPatient(strain_id, patient_id);
    }
}
