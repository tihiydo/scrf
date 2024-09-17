import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { TopSectionPage } from './entities/top-section.entity';
import { TopSectionService } from './top-section.service';
import { SetMoviesDto } from './dto/set-movies.dto';
import { Roles } from 'decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('top-section')
export class TopSectionController {
  constructor(private readonly topSectionService: TopSectionService) {}

  @Get(':page')
  async getPageMovies(@Param('page') page: string) {
    const realPage: TopSectionPage | undefined = TopSectionPage[page];
    if (!realPage) throw new BadRequestException(`${page}: page not exists`);

    return await this.topSectionService.getTopSection(realPage);
  }

  @Post(':page')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async setMovies(@Param('page') page: string, @Body() body: SetMoviesDto) {
    const realPage: TopSectionPage | undefined = TopSectionPage[page];
    if (!realPage) throw new BadRequestException(`${page}: page not exists`);

    return await this.topSectionService.setMovies(realPage, body.movies);
  }
}
