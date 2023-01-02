import { Module } from '@nestjs/common';
import { ReferenceBaseService } from './reference_base.service';
import { ReferenceBaseController } from './reference_base.controller';

@Module({
  providers: [ReferenceBaseService],
  controllers: [ReferenceBaseController]
})
export class ReferenceBaseModule {}
