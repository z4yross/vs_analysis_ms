import { Module } from '@nestjs/common';
import { ReferenceContigService } from './reference_contig.service';

@Module({
  providers: [ReferenceContigService]
})
export class ReferenceContigModule {}
