import { Module } from '@nestjs/common';
import { AssemblyReadService } from './assembly_read.service';

@Module({
  providers: [AssemblyReadService]
})
export class AssemblyReadModule {}
