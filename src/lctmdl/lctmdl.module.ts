import { Module } from '@nestjs/common';
import { CityZoneModule } from './city_zone/city_zone.module';
import { CityModule } from './city/city.module';
import { ProvinceModule } from './province/province.module';
import { CountryModule } from './country/country.module';

@Module({
  imports: [CityZoneModule, CityModule, ProvinceModule, CountryModule]
})
export class LctmdlModule {}
