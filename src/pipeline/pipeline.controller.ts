import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CreateDTO } from './dto/create.dto'
import { Entity } from './entity/entity'
import { PipelineService } from './pipeline.service'

import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller('pipeline')
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) {}

    @MessagePattern('get')
    async get(@Payload() { status }, @Ctx() context: RmqContext) {
        const batches_entity = await this.pipelineService.getPipelinesWithStatus(status)

        let data = []

        if(batches_entity) 
            data =  batches_entity.map((batch) => batch.get())

        await this.pipelineService.sendMsgToQueue(data)
        context.getChannelRef().ack(context.getMessage())
    }

    @MessagePattern('update')
    async update(@Payload() { project_id, provided_by, status }, @Ctx() context: RmqContext) {
        console.log(project_id, provided_by, status)
        // context.getChannelRef().ack(context.getMessage())
    }
}
