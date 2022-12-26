import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';

@Module({
  providers: [DiagnosisService]
})
export class DiagnosisModule {}
