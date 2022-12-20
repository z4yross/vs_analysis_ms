import { Module } from '@nestjs/common';

import { StrainModule } from 'src/strain/strain.module';
import { VirusModule } from 'src/virus/virus.module';

@Module({
    imports:[
        StrainModule,
        VirusModule
    ]
})
export class VsmdlModule {}
