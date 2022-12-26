import { Module } from '@nestjs/common';
import { CityZoneService } from './city_zone.service';

@Module({
  providers: [CityZoneService]
})
export class CityZoneModule {}
