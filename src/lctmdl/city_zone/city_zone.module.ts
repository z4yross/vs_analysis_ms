import { Module } from '@nestjs/common';
import { CityZoneService } from './city_zone.service';
import { CityZoneController } from './city_zone.controller';

@Module({
  providers: [CityZoneService],
  controllers: [CityZoneController]
})
export class CityZoneModule {}
