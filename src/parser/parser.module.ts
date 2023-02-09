import { Module } from '@nestjs/common'
import { ParserService } from './parser.service'
import { ParserController } from './parser.controller'

import { SampleModule } from '../sample/sample.module'
import { CityModule } from '../lctmdl/city/city.module'
import { CityZoneModule } from '../lctmdl/city_zone/city_zone.module'
import { CountryModule } from '../lctmdl/country/country.module'
import { ProvinceModule } from '../lctmdl/province/province.module'

import { PatientModule } from '../ptnmdl/patient/patient.module'
@Module({
    providers: [ParserService],
    controllers: [ParserController],
    imports: [
        SampleModule,
        CityModule,
        CityZoneModule,
        CountryModule,
        ProvinceModule,
        PatientModule,
    ],
})
export class ParserModule {}
