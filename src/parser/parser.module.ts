import { Module } from '@nestjs/common'
import { ParserService } from './parser.service'
import { ParserController } from './parser.controller'

import { SampleModule } from '../sample/sample.module'
import { CityZoneModule } from '../lctmdl/city_zone/city_zone.module'

import { PatientModule } from '../ptnmdl/patient/patient.module'

import { PipelineModule } from '../pipeline/pipeline.module'
@Module({
    providers: [ParserService],
    controllers: [ParserController],
    imports: [
        SampleModule,
        CityZoneModule,
        PatientModule,
        PipelineModule,
    ],
})
export class ParserModule {}
