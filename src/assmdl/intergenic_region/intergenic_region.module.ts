import { Module } from '@nestjs/common';
import { IntergenicRegionService } from './intergenic_region.service';
import { IntergenicRegionController } from './intergenic_region.controller';

@Module({
  providers: [IntergenicRegionService],
  controllers: [IntergenicRegionController]
})
export class IntergenicRegionModule {}
