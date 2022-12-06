import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';

@Module({
  imports: [],
  providers: [SampleService]
})
export class SampleModule {}
