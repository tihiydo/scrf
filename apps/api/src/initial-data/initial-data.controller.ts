import { Body, Controller, Get, Res } from '@nestjs/common';
import { InitialDataService } from './initial-data.service';
import { Response } from 'express';
import { goodResponse } from 'src/utils';

@Controller('initial-data')
export class InitialDataController {
  constructor(private readonly InitialDataService: InitialDataService) {}

  @Get()
  async generate(@Res() res: Response) {
    goodResponse(res);
    await this.InitialDataService.generate();
  }
}
