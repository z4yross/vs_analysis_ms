import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';

import { SampleModule } from '../sample/sample.module';

@Module({
  providers: [ParserService],
  controllers: [ParserController],
  imports: [SampleModule],
})
export class ParserModule {}
