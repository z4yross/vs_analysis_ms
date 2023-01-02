import { Module } from '@nestjs/common';
import { ReferenceContigService } from './reference_contig.service';
import { ReferenceContigController } from './reference_contig.controller';

@Module({
  providers: [ReferenceContigService],
  controllers: [ReferenceContigController]
})
export class ReferenceContigModule {}
