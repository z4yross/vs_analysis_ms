import { Module } from '@nestjs/common';
import { HumanVariantService } from './human_variant.service';

@Module({
  providers: [HumanVariantService]
})
export class HumanVariantModule {}
