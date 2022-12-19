import { Module } from '@nestjs/common';
import { GeneService } from './gene.service';

@Module({
  providers: [GeneService]
})
export class GeneModule {}
