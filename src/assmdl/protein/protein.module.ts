import { Module } from '@nestjs/common';
import { ProteinService } from './protein.service';
import { ProteinController } from './protein.controller';

@Module({
  providers: [ProteinService],
  controllers: [ProteinController]
})
export class ProteinModule {}
