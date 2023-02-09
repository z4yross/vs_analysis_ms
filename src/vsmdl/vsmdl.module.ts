import { Module } from '@nestjs/common';

import { StrainModule } from './strain/strain.module';
import { VirusModule } from './virus/virus.module';

@Module({
    imports:[
        StrainModule,
        VirusModule
    ]
})
export class VsmdlModule {}
