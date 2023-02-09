import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDTO } from './dto/create.dto';
import { Entity } from './entity/entity';
import { PipelineService } from './pipeline.service';

@Controller('pipeline')
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.pipelineService.create(data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Entity | undefined> {
        return this.pipelineService.get(id);
    }
}
