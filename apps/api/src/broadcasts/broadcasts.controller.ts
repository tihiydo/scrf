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
import { BroadcastsService } from './broadcasts.service';

@Controller('broadcasts')
export class BroadcastsController 
{
 constructor(private readonly matchService: BroadcastsService) {}

  @Get('/')
  async getAllMatches() 
  {
    return ((await this.matchService.findAll()))
  }

  @Get(':id')
  async getOneMatch(@Param('id') id: string, @Res() res: Response)
  {
    return ((await this.matchService.findOne(+id)))
  }
}
