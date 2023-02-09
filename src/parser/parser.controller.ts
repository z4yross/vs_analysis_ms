import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDTO } from './dto/create.dto';
import { Entity } from './entity/entity';
import { ParserService } from './parser.service';


@Controller('parser')
export class ParserController {
    constructor(private readonly parserService: ParserService) {}

    @Post()
    async create(@Body() data: CreateDTO): Promise<Entity | undefined> {
        return this.parserService.create(data);
    }

    @Get(':provided_by')
    async get(@Param('provided_by') provided_by: string): Promise<Entity[] | undefined> {
        return this.parserService.getAllBatchsOfProvider(provided_by);
    }

    // update batch state with provided_by, batch_id and state
    @Post(':provided_by/:batch_id/:state')
    async updateBatchState(
        @Param('provided_by') provided_by: string,
        @Param('batch_id') batch_id: string,
        @Param('state') state: number
    ): Promise<Boolean | undefined> {
        if(state === 1) 
            return this.parserService.queueBatchProcessing(provided_by, batch_id);
        else if(state === 0) 
            return this.parserService.abortBatchProcessing(provided_by, batch_id);
        else
            throw new Error('Invalid state');
    }
}
