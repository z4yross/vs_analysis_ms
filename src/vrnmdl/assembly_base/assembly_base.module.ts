import { Module } from '@nestjs/common';
import { AssemblyBaseService } from './assembly_base.service';

@Module({
  providers: [AssemblyBaseService]
})
export class AssemblyBaseModule {}
