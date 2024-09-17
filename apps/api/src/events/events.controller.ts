import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController 
{
 constructor(private readonly eventService: EventsService) {}
  @Get("/sports")
  async sports()
  {
    return ((await this.eventService.getVisibleSports()))
  }
  @Get('/')
  async getAllEvents() 
  {
    return ((await this.eventService.findAll()))
  }

  @Get(':id')
  async getOneEvent(@Param('id') id: string, @Res() res: Response)
  {
    return ((await this.eventService.findOne()))
  }
}
