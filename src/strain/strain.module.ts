import { Module } from '@nestjs/common';
import { StrainService } from './strain.service';

@Module({
  providers: [StrainService]
})
export class StrainModule {}
