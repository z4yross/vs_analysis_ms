import { Module } from '@nestjs/common';
import { StrainService } from './strain.service';
import { StrainController } from './strain.controller';

@Module({
  providers: [StrainService],
  controllers: [StrainController]
})
export class StrainModule {}
