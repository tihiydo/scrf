import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AddFictionDto } from './dto/add-fictino.dto';
import { Roles } from 'decorators/roles.decorator';
import { RemoveFictionDto } from './dto/remove-fictino.dto';
import { ListsService } from './lists.service';
import { Request } from 'express';
import { CreateListDto } from './dto/create-list.dto';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) { }

  @Roles('logged-in-only')
  @Get('/')
  async getAllLists(@Req() request: Request) {
    const userId = request.user.id;

    return await this.listsService.getAllLists(userId);
  }

  @Roles('logged-in-only')
  @Post('/')
  async createList(@Body() body: CreateListDto, @Req() request: Request) {
    const userId = request.user.id;

    return await this.listsService.createList({
      name: body.name,
      userId: userId,
      movies: body.movies,
      serials: body.serials,
    });
  }

  @Roles('logged-in-only')
  @Delete('/:slug')
  async deleteList(@Param('slug') slug: string, @Req() request: Request) {
    const userId = request.user.id;

    return await this.listsService.deleteList({
      slug: slug,
      userId: userId,
    });
  }

  @Roles('logged-in-only')
  @Get('/:slug')
  async getList(@Param('slug') slug: string, @Req() request: Request) {
    const userId = request.user.id;
    const dbList = await this.listsService.getList({
      slug: slug,
      user: {
        id: userId,
      },
    });

    if (!dbList) {
      throw new NotFoundException('List not found');
    }

    return dbList;
  }

  @Get('/fiction/:imdbid')
  @Roles('logged-in-only')
  async getFictionLists(
    @Param('imdbid') imdbid: string,
    @Req() request: Request,
  ) {
    const userId = request.user.id;
    console.log(userId);

    const lists = await this.listsService.getFictionLists({
      userId: userId,
      fictionImdbid: imdbid,
    });

    return {
      lists,
    };
  }

  @Post('/fiction/:slug')
  @Roles('logged-in-only')
  async addFiction(
    @Param('slug') slug: string,
    @Body() body: AddFictionDto,
    @Req() request: Request,
  ) {
    const userId = request.user.id;

    const dbList = await this.listsService.getList({
      slug: slug,
      user: {
        id: userId,
      },
    });
    if (!dbList) {
      throw new NotFoundException('List not found');
    }

    if (body.movie) {
      await this.listsService.addMovies(dbList.id, [body.movie]);
    } else if (body.serial) {
      await this.listsService.addSerials(dbList.id, [body.serial]);
    }

    const list = await this.listsService.getList({
      slug: dbList.slug,
    });

    return {
      list,
    };
  }

  @Delete('/fiction/:slug')
  @Roles('logged-in-only')
  async removeFiction(
    @Param('slug') slug: string,
    @Body() body: RemoveFictionDto,
    @Req() request: Request,
  ) {
    const userId = request.user.id;

    const dbList = await this.listsService.getList({
      slug: slug,
      user: {
        id: userId,
      },
    });
    if (!dbList) {
      throw new NotFoundException('List not found');
    }

    if (body.movie) {
      await this.listsService.removeMovie(dbList.id, body.movie);
    } else if (body.serial) {
      await this.listsService.removeSerial(dbList.id, body.serial);
    }

    const list = await this.listsService.getList({
      slug: dbList.slug,
    });

    return {
      list,
    };
  }
}
