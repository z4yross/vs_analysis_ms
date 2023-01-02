import { Module } from '@nestjs/common';
import { ReferenceGenomeService } from './reference_genome.service';
import { ReferenceGenomeController } from './reference_genome.controller';

@Module({
  providers: [ReferenceGenomeService],
  controllers: [ReferenceGenomeController]
})
export class ReferenceGenomeModule {}
