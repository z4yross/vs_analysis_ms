import { Module } from '@nestjs/common';
import { AssemblyReadModule } from './assembly_read/assembly_read.module';
import { AssemblyBaseModule } from './assembly_base/assembly_base.module';
import { ReferenceBaseModule } from './reference_base/reference_base.module';
import { ReferenceContigModule } from './reference_contig/reference_contig.module';
import { ReferenceGenomeModule } from './reference_genome/reference_genome.module';

@Module({
  imports: [AssemblyReadModule, AssemblyBaseModule, ReferenceBaseModule, ReferenceContigModule, ReferenceGenomeModule]
})
export class VrnmdlModule {}
