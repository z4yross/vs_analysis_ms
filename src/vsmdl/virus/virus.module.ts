import { Module } from '@nestjs/common';
import { VirusService } from './virus.service';
import { VirusController } from './virus.controller';

@Module({
  providers: [VirusService],
  controllers: [VirusController]
})
export class VirusModule {}
