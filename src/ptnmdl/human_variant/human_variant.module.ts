import { Module } from '@nestjs/common';
import { HumanVariantService } from './human_variant.service';
import { HumanVariantController } from './human_variant.controller';

@Module({
  providers: [HumanVariantService],
  controllers: [HumanVariantController]
})
export class HumanVariantModule {}
