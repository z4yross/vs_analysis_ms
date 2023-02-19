import { Module } from '@nestjs/common'
import { PipelineService } from './pipeline.service'
import { PipelineController } from './pipeline.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'PROJECTS_DATA_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.AMQP_URL || "amqp://vs-mq:vs-mq@localhost"],
                    queue: 'projects-data',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
    ],
    providers: [PipelineService],
    controllers: [PipelineController],
    exports: [PipelineService],
})
export class PipelineModule {}
