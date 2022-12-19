import { Module } from '@nestjs/common';
import { AssemblyService } from './assembly.service';

@Module({
    imports: [],
    providers: [AssemblyService]
})
export class AssemblyModule {}
