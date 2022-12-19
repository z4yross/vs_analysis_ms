import { Module } from '@nestjs/common';
import { IntergenicRegionService } from './intergenic_region.service';

@Module({
  providers: [IntergenicRegionService]
})
export class IntergenicRegionModule {}
