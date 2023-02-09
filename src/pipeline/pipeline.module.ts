import { Module } from '@nestjs/common'
import { PipelineService } from './pipeline.service'
import { PipelineController } from './pipeline.controller'
import { PipelineMonitor } from './pipeline/pipeline'

import { AmqpModule } from 'nestjs-amqp'
@Module({
    imports: [
        AmqpModule.forRoot({
            // name: process.env.AMQP_NAME || 'rabbitmq',
            hostname: process.env.AMQP_HOST || 'localhost',
            port: Number(process.env.AMQP_PORT) || 5672,
            username: process.env.AMQP_USER || 'vs-mq',
            password: process.env.AMQP_PASS || 'vs-mq',
        }),
    ],
    providers: [PipelineService, PipelineMonitor],
    controllers: [PipelineController],
    exports: [PipelineService],
})
export class PipelineModule {}
