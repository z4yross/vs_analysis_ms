import { Module } from '@nestjs/common';
import { GeneService } from './gene.service';
import { GeneController } from './gene.controller';

@Module({
  providers: [GeneService],
  controllers: [GeneController]
})
export class GeneModule {}
