import { Module } from '@nestjs/common';
import { UtrService } from './utr.service';

@Module({
  providers: [UtrService]
})
export class UtrModule {}
