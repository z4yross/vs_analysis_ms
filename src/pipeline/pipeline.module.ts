import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';
import { PipelineMonitor } from './pipeline/pipeline';

@Module({
  providers: [PipelineService, PipelineMonitor],
  controllers: [PipelineController]
})
export class PipelineModule {}
