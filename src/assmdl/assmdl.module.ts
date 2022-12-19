import { Module } from '@nestjs/common';

import { AssemblyModule } from './assembly/assembly.module';
import { FeatureModule } from './feature/feature.module';
import { GeneModule } from './gene/gene.module';
import { IntergenicRegionModule } from './intergenic_region/intergenic_region.module';
import { ProteinModule } from './protein/protein.module';
import { UtrModule } from './utr/utr.module';

@Module({
    imports:[
        AssemblyModule,
        FeatureModule,
        GeneModule,
        IntergenicRegionModule,
        ProteinModule,
        UtrModule
    ]
})
export class AssmdlModule {}
