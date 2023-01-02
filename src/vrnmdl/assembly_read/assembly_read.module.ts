import { Module } from '@nestjs/common';
import { AssemblyReadService } from './assembly_read.service';
import { AssemblyReadController } from './assembly_read.controller';

@Module({
  providers: [AssemblyReadService],
  controllers: [AssemblyReadController]
})
export class AssemblyReadModule {}
