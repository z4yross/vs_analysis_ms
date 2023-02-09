import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';

@Module({
  providers: [ProvinceService],
  controllers: [ProvinceController],
  exports: [ProvinceService]
})
export class ProvinceModule {}
