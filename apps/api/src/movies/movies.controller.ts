import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Res,
  Query,
  Post,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { MoviesService } from './movies.service';
import { UpdateMoviesDto } from './dto/update-movies.dto';
import { EditMovieDto } from './dto/edit-movie.dto';
import { QueryFilters } from './types';
import { Roles } from 'decorators/roles.decorator';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import {
  minimalMovieRelations,
  minimalMovieSelect,
  Movies,
} from './entities/movies.entity';
import { In, Repository } from 'typeorm';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('movies')
export class MoviesController {
  collectionFictionRepository: any;
  constructor(private readonly moviesService: MoviesService) { }

  @InjectRepository(Movies)
  private readonly moviesRepository: Repository<Movies>;

  @Get('/all')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async findAllAdmin(@Res() res: Response) {
    res.json(
      await this.moviesService.findMany({
        select: {
          imdbid: true,
          addedAt: true,
          title: true,
          fiction: { checked: true },
        },
        relations: { fiction: true },
      }),
    );
  }

  @Get('/checked')
  @Roles([UserRole.Admin])
  async getCheckedFilms() {
    return await this.moviesService.findMany({
      where: {
        fiction: {
          checked: true,
        },
      },
      select: {
        imdbid: true,
        addedAt: true,
        title: true,
        fiction: { checked: true },
      },
      relations: { fiction: true },
    });
  }

  @Get('/not-checked')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async getNotCheckedFilms() {
    return await this.moviesService.findMany({
      where: {
        fiction: {
          checked: false,
        },
      },
      select: {
        imdbid: true,
        addedAt: true,
        title: true,
        fiction: { checked: true },
      },
      relations: { fiction: true },
    });
  }

  @Get('similar/:id')
  async similarMovies(@Param('id') id: string) {
    const movie = await this.moviesRepository.findOne({
      where: { imdbid: id },
      relations: { fiction: { genres: true, studios: true, located: true } },
    });
    if (!movie) throw new NotFoundException('Movie not found');

    const movieGenresSlugs = movie.fiction.genres.map((g) => g.slug);
    console.log(movieGenresSlugs);

    const similarMovies = await this.moviesRepository.find({
      where: {
        fiction: { genres: { slug: In(movieGenresSlugs) }, checked: true },
      },
      take: 50,
      order: { rating: 'DESC' },
      select: minimalMovieSelect,
      relations: minimalMovieRelations,
    });

    const filteredMovies = similarMovies.filter((m) => m.imdbid !== id);

    const shuffledMovies = filteredMovies.sort(() => Math.random() - 0.5);

    const limitedMovies = shuffledMovies.slice(0, 10);

    return limitedMovies;
  }

  @Get(':id/one')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async findOneAdmin(@Res() res: Response, @Param('id') id: string) {
    res.json(
      await this.moviesRepository.findOne({
        where: { imdbid: id },
        relations: { fiction: { genres: true, studios: true, located: true } },
      }),
    );
  }

  @Get("/new")
  async findNew(@Res() res: Response) {
    res.json(
      await this.moviesService.findMany({
        where: { fiction: { checked: true } },
        relations: { fiction: {studios: true} },
        select: {
          imdbid: true,
          portraitImage: true,
          title: true,
          ageRestriction: true,
          rating: true,
          releaseYear: true,
          releaseDate: true,
          runtime: true,
          fiction: {
            studios: true,
          },
        },
        order: { releaseDate: 'DESC' },
        take: 20,
      }),
    );
  }

  @Get("/popular")
  async findPopular(@Res() res: Response) {
    res.json(
      await this.moviesService.findMany({
        where: { fiction: { checked: true } },
        relations: { fiction: {studios: true} },
        select: {
          imdbid: true,
          portraitImage: true,
          title: true,
          ageRestriction: true,
          rating: true,
          releaseYear: true,
          releaseDate: true,
          runtime: true,
          fiction: {
            studios: true,
          },
        },
        order: { rating: 'DESC' },
        take: 20,
      }),
    );
  }

  @Get("/random")
  async findRandom(@Res() res: Response) {
    const movies = await this.moviesRepository
    .createQueryBuilder('movie')
    .leftJoinAndSelect('movie.fiction', 'fiction')
    .leftJoinAndSelect('fiction.studios', 'studios')
    .where('fiction.checked = :checked', { checked: true })
    .orderBy('RANDOM()') // Используем RANDOM для случайной выборки
    .limit(20) // Ограничиваем количество записей
    .getMany();

  
    res.json(movies);
  }

  @Get('library')
  async findFiltered(@Query() query: Partial<QueryFilters>) {
    return await this.moviesService.findFiltered(query);
  }

  @Get(':id/remove')
  @Roles([UserRole.Admin])
  async remove(@Param('id') id: string, @Res() res: Response) {
    res.json(await this.moviesService.remove(id));
  }

  @Patch(':id/update')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async update(
    @Param('id') id: string,
    @Body() data: UpdateMoviesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const movie = await this.moviesRepository.findOne({
      where: {
        imdbid: id,
      },
      relations: {
        fiction: {
          casts: true,
          directors: true,
          writers: true,
          genres: true,
          studios: true,
          movie: true,
        },
      },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    if (movie.fiction.checked && req.user.role !== UserRole.Admin) {
      throw new ForbiddenException("You can't edit checked movies");
    }

    res.json(await this.moviesService.update(movie, data));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    res.json(
      await this.moviesService.findOne({
        imdbid: id,
      }),
    );
  }

  @Get(':id/my-vote')
  @Roles('logged-in-only')
  async getMyVote(@Param('id') id: string, @Req() req: Request) {
    return await this.moviesService.getMyVote(id, req.user.id);
  }

  @Get(':id/like')
  @Roles('logged-in-only')
  async like(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.moviesService.like(id, req.user.id);
    res.json(fiction);
  }

  @Get(':id/dislike')
  @Roles('logged-in-only')
  async dislike(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.moviesService.dislike(id, req.user.id);
    res.json(fiction);
  }

  @Get(':id/likes')
  async likes(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.moviesService.getLikes(id);
    res.json(fiction);
  }

  @Patch(':id')
  async updateOptional(@Param('id') id: string, @Body() data: EditMovieDto) {
    const movie = await this.moviesService.edit(id, data);
    return movie;
  }
}
