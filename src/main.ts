import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'

const PORT = process.env.PORT
const AMQP_URL = process.env.AMQP_URL || "amqp://vs-mq:vs-mq@localhost"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [AMQP_URL],
            queue: 'projects',
            queueOptions: { durable: true },
            socketOptions: {
              heartbeatIntervalInSeconds: 90,
            },
            noAck: false,
        },
    })
    
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await app.startAllMicroservices()
    await app.listen(PORT || 5000)
}
bootstrap()
