import { Module } from '@nestjs/common';
import { CityZoneModule } from './city_zone/city_zone.module';

@Module({
  imports: [CityZoneModule],
  exports: [CityZoneModule]
})
export class LctmdlModule {}
