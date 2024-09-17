import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
} from '@nestjs/common';
import { StudiosService } from './studios.service';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { Response } from 'express';

@Controller('studios')
export class StudiosController {
  constructor(private readonly studiosService: StudiosService) { }

  @Get()
  async findAll(@Res() res: Response) {
    res.json(await this.studiosService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    res.json(
      await this.studiosService.findOne({
        where: {
          imdbid: id,
          studiosFictions:
          {
            checked: true
          }
        },
        relations:
        {
          studiosFictions:
          {
            movie: true,
            serial: true
          }
        },
        select:
        {
          imdbid: true,
          studioName: true,
          description: true,
          studiosFictions:
          {
            id: true,
            movie:
            {
              imdbid: true,
              title: true,
              portraitImage: true,
              rating: true,
              runtime: true,
              releaseDate: true,
              releaseYear: true
            },
            serial:
            {
              imdbid: true,
              title: true,
              portraitImage: true,
              rating: true,
              releaseDate: true,
              releaseYear: true,
              episodesCount: true
            }
          }
        }
      }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    res.json(await this.studiosService.remove(id));
  }

  @Put(':id')
  async put(@Param('id') data: UpdateStudioDto, @Res() res: Response) {
    res.json(await this.studiosService.create(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateStudioDto,
    @Res() res: Response,
  ) {
    res.json(await this.studiosService.update(id, data));
  }
}
