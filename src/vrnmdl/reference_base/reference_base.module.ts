import { Module } from '@nestjs/common';
import { ReferenceBaseService } from './reference_base.service';

@Module({
  providers: [ReferenceBaseService]
})
export class ReferenceBaseModule {}
