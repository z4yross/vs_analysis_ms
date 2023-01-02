import { Module } from '@nestjs/common';
import { AssemblyBaseService } from './assembly_base.service';
import { AssemblyBaseController } from './assembly_base.controller';

@Module({
  providers: [AssemblyBaseService],
  controllers: [AssemblyBaseController]
})
export class AssemblyBaseModule {}
