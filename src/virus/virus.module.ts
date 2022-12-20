import { Module } from '@nestjs/common';
import { VirusService } from './virus.service';

@Module({
  providers: [VirusService]
})
export class VirusModule {}
