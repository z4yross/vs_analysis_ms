import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Neo4jModule, Neo4jScheme } from 'nest-neo4j';

import { SampleModule } from './sample/sample.module';
import { AssmdlModule } from './assmdl/assmdl.module';

@Module({
  imports: [
    SampleModule,
    Neo4jModule.forRoot({
      scheme: <Neo4jScheme>process.env.NEO4J_SCHEME || 'bolt',
      host: process.env.NEO4J_HOST || 'localhost',
      port: process.env.NEO4J_PORT || '3023',
      username: process.env.NEO4J_USER || 'neo4j',
      password: process.env.NEO4J_PASS || 'vs-analysis-db',
    }),
    AssmdlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
