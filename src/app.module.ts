import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

import { Neo4jModule, Neo4jScheme } from 'nest-neo4j';

import {AmqpModule} from 'nestjs-amqp';

import { SampleModule } from './sample/sample.module';
import { AssmdlModule } from './assmdl/assmdl.module';
import { VsmdlModule } from './vsmdl/vsmdl.module';
import { PtnmdlModule } from './ptnmdl/ptnmdl.module';
import { LctmdlModule } from './lctmdl/lctmdl.module';
import { VrnmdlModule } from './vrnmdl/vrnmdl.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { ParserModule } from './parser/parser.module';

import { ConfigModule } from 'nestjs-dotenv';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    Neo4jModule.forRoot({
      scheme: <Neo4jScheme>process.env.NEO4J_SCHEME || 'bolt',
      host: process.env.NEO4J_HOST || 'localhost',
      port: Number(process.env.NEO4J_PORT) || '3023',
      username: process.env.NEO4J_USER || 'neo4j',
      password: process.env.NEO4J_PASS || 'vs-analysis-ms',
    }),
    // AmqpModule.forRoot({
    //   // name: process.env.AMQP_NAME || 'rabbitmq',
    //   hostname: process.env.AMQP_HOST ||'localhost',
    //   port: Number(process.env.AMQP_PORT) || 5672,
    //   username: process.env.AMQP_USER || 'vs-mq',
    //   password: process.env.AMQP_PASS || 'vs-mq',
    // }),
    SampleModule,
    AssmdlModule,
    VsmdlModule,
    PtnmdlModule,
    LctmdlModule,
    VrnmdlModule,
    PipelineModule,
    ParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
