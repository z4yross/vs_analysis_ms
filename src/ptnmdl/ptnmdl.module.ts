import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { HumanVariantModule } from './human_variant/human_variant.module';

@Module({
  imports: [PatientModule, DiagnosisModule, HumanVariantModule],
})
export class PtnmdlModule {}
