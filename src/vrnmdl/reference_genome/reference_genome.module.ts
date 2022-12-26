import { Module } from '@nestjs/common';
import { ReferenceGenomeService } from './reference_genome.service';

@Module({
  providers: [ReferenceGenomeService]
})
export class ReferenceGenomeModule {}
