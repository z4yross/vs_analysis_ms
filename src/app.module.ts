import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './sample/sample.module';
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
