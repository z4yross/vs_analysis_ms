import { Module } from '@nestjs/common';
import { AssemblyService } from './assembly.service';
import { AssemblyController } from './assembly.controller';

@Module({
    imports: [],
    providers: [AssemblyService],
    controllers: [AssemblyController]
})
export class AssemblyModule {}
