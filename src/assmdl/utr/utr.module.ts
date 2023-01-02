import { Module } from '@nestjs/common';
import { UtrService } from './utr.service';
import { UtrController } from './utr.controller';

@Module({
  providers: [UtrService],
  controllers: [UtrController]
})
export class UtrModule {}
