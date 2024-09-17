import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { Response } from 'express';
import { errorResponse, goodResponse } from 'src/utils';
import { AddNewFictionDto } from './dto/add-new-fiction-dto';

@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Post('/movies/:imdbid')
  async addMovie(
    @Param('imdbid') imdbid: string,
    @Body() addNewFictionDto: AddNewFictionDto,
    @Res() res: Response,
  ) {
        const data = await this.downloadsService.addNewMovieFromNewApi(imdbid, addNewFictionDto);
        if(data.status)
        {
            goodResponse(res, data.message)
        }
        else
        {
            errorResponse(res, data.message)
        }
  }

  @Post('/serials/:imdbid')
  async addSerial(
    @Param('imdbid') imdbid: string,
    @Body() addNewFictionDto: AddNewFictionDto,
    @Res() res: Response,
  ) {
    const data = await this.downloadsService.addNewSerialFromNewApi(imdbid, addNewFictionDto);
    if(data.status)
    {
        goodResponse(res, data.message)
    }
    else
    {
        errorResponse(res, data.message)
    }
  }

  @Get('/servers/:imdbid')
  async fragmentsServersList(
    @Param('imdbid') imdbid: string,
    @Res() res: Response,
  ) 
  {
    const response = await this.downloadsService.getFragmentsServer(imdbid)
    res.json(response)
  }

  @Get('/servers/:imdbid/add/:server')
  async fragmentsAddServer(
    @Param('imdbid') imdbid: string,
    @Param('server') server: string,
    @Res() res: Response,
  ) 
  {
    const response = await this.downloadsService.addFragmentsServer(imdbid, server)
    res.json(response)
  }

  @Get('/servers/:imdbid/replace/:server')
  async replaceServer(
    @Param('imdbid') imdbid: string,
    @Param('server') server: string,
    @Res() res: Response,
  ) 
  {
    const response = await this.downloadsService.replaceServer(imdbid, server)
    res.json(response)
  }


  @Get('/servers/:imdbid/remove/:server')
  async fragmentsRemoveServer(
    @Param('imdbid') imdbid: string,
    @Param('server') server: string,
    @Res() res: Response,
  ) 
  {
    const response = await this.downloadsService.removeFragmentsServer(imdbid, server)
    res.json(response)
  }
}
