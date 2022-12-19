import { Module } from '@nestjs/common';
import { ProteinService } from './protein.service';

@Module({
  providers: [ProteinService]
})
export class ProteinModule {}
