import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SerialsService } from './serials.service';
import { formSerieQuery, parseGetSerieQuery } from './utils/series';
import { formSeasonRelations, parseGetSeasonQuery } from './utils/seasons';
import { parsePositionOrId } from './utils';
import { formEpisodeRelations, parseGetEpisodeQuery } from './utils/episode';
import { QueryFilters } from './types/library';
import { In, Repository } from 'typeorm';
import {
  minimalSerialRelations,
  minimalSerialSelect,
  Serial,
} from './entities/serials.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'decorators/roles.decorator';
import { Request, Response } from 'express';
import { FragmentsServers } from 'src/fictions/entities/server.entity';
import { UpdateEpisodeDto, UpdateSerialDto } from './dto/update.dto';
import { NotFoundError } from 'rxjs';
import { UserRole } from 'src/user/entities/user.entity';
import { Episode } from './entities/episodes.entity';

@Controller('serials')
export class SerialsController {
  constructor(
    private readonly serialsService: SerialsService,

    @InjectRepository(Serial)
    private readonly serialsRepository: Repository<Serial>,

    @InjectRepository(Episode)
    private readonly episodesRepository: Repository<Episode>,

    @InjectRepository(FragmentsServers)
    private readonly fragmentsServersRepository: Repository<FragmentsServers>,
  ) { }

  @Roles([UserRole.Admin, UserRole.ContentManager])
  @Get('/episode/:imdbidepisode')
  async getEpisode(@Param('imdbidepisode') imdbidepisode: string) {
    const t = await this.serialsService.defaultGetEpisode(imdbidepisode);
    return t;
  }

  @Roles([UserRole.Admin, UserRole.ContentManager])
  @Patch('/episode/:imdbid/update')
  async updateEpisode(
    @Param('imdbid') imdbid: string,
    @Body() data: UpdateEpisodeDto,
    @Req() req: Request,
  ) {
    const episode = await this.episodesRepository.findOne({
      where: {
        imdbid,
      },
      relations: {
        serial: {
          fiction: true,
        },
      },
    });

    if (!episode) {
      throw new Error('Episode not found');
    }

    if (episode.serial.fiction.checked && req.user.role !== UserRole.Admin) {
      throw new ForbiddenException("You can't edit checked movies");
    }

    this.serialsService.updateEpisode(episode, data);
  }

  @Get('/all')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async getAllAdmin(@Req() req: Request, @Res() res: Response) {
    const fiction = await this.serialsRepository.find({
      select: {
        imdbid: true,
        addedAt: true,
        title: true,
        fiction: { checked: true },
      },
      relations: { fiction: true },
    });
    res.json(fiction);
  }

  @Get('/checked')
  @Roles([UserRole.Admin])
  async getCheckedSerials(@Req() req: Request, @Res() res: Response) {
    const fiction = await this.serialsRepository.find({
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
    res.json(fiction);
  }

  @Get('/not-checked')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async getNotCheckedSerials(@Req() req: Request, @Res() res: Response) {
    const fiction = await this.serialsRepository.find({
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
    res.json(fiction);
  }

  @Get('similar/:id')
  async similarSerial(@Param('id') id: string) {
    const movie = await this.serialsRepository.findOne({
      where: { imdbid: id },
      relations: { fiction: { genres: true, studios: true, located: true } },
    });
    if (!movie) throw new NotFoundException('Movie not found');

    const serialGenresSlugs = movie.fiction.genres.map((g) => g.slug);

    const similarMovies = await this.serialsRepository.find({
      where: {
        fiction: { genres: { slug: In(serialGenresSlugs) }, checked: true },
      },
      take: 50,
      order: { rating: 'DESC' },
      select: minimalSerialSelect,
      relations: minimalSerialRelations,
    });

    const filteredMovies = similarMovies.filter((m) => m.imdbid !== id);

    const shuffledSerials = filteredMovies.sort(() => Math.random() - 0.5);

    const limitedSerials = shuffledSerials.slice(0, 10);

    return limitedSerials;
  }

  @Get('/episode/next/:imdbid')
  async getNextEpisode(@Param('imdbid') imdbid: string) {
    const nextEpisode = await this.serialsService.getNextEpisode(imdbid);
    if (!nextEpisode) throw new NotFoundException('Next episode not found');

    return nextEpisode;
  }

  @Get('/episode/prev/:imdbid')
  async getPrevEpisode(@Param('imdbid') imdbid: string) {
    const prevEpisode = await this.serialsService.getPrevEpisode(imdbid);
    if (!prevEpisode) throw new NotFoundException('Prev episode not found');

    return prevEpisode;
  }

  @Get(':id/one')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async getOneAdmin(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.serialsRepository.findOne({
      where: { imdbid: id },
      relations: {
        fiction: { genres: true, studios: true, located: true },
        seasons: true,
      },
    });
    res.json(fiction);
  }

  @Get(':id/my-vote')
  @Roles('logged-in-only')
  async getMyVote(@Param('id') id: string, @Req() req: Request) {
    return await this.serialsService.getMyVote(id, req.user.id);
  }

  @Get(':id/like')
  @Roles('logged-in-only')
  async like(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.serialsService.like(id, req.user.id);
    res.json(fiction);
  }

  @Get(':id/dislike')
  @Roles('logged-in-only')
  async dislike(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.serialsService.dislike(id, req.user.id);
    res.json(fiction);
  }

  @Get(':id/likes')
  async likes(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const fiction = await this.serialsService.getLikes(id);
    res.json(fiction);
  }

  @Get('library')
  async library(@Query() query: Partial<QueryFilters>) {
    return await this.serialsService.findFiltered(query);
  }

  @Get('/:imdbid')
  async getOneSerie(@Param('imdbid') imdbid: string) {
    console.log(`Fetching serie with imdbid: ${imdbid}`);
    const serie = await this.serialsService.getSerie(imdbid);
    console.log(`Found serie: ${JSON.stringify(serie)}`);
    return serie;
  }

  @Get('/:imdbid/:season/episodes')
  async getSeasonEpisodes(
    @Param('imdbid') imdbid: string,
    @Param('season') seasonParam: string,
  ) {
    const seasonId = parsePositionOrId(seasonParam);
    const episodes = await this.serialsService.getSeasonEpisodes(
      imdbid,
      seasonId,
    );
    return episodes;
  }

  // @Get('/data/:id')
  // async getFictionData(@Param('id') id: string): Promise<any> {
  //   return await this.serialsService.getSerialData(id);
  // }

  @Get('/:imdbid/:season')
  async getOneSeason(
    @Param('imdbid') imdbid: string,
    @Param('season') seasonParam: string,
    @Query() query: Record<string, string>,
  ) {
    const parsedQuery = parseGetSeasonQuery(query);
    const relations = formSeasonRelations(parsedQuery);
    const seasonId = parsePositionOrId(seasonParam);
    const season = await this.serialsService.getSeason(
      imdbid,
      seasonId,
      relations,
    );
    return season;
  }

  @Get('/:imdbid/:season/:episode')
  async getOneEpisode(
    @Param('imdbid') imdbid: string,
    @Param('season') seasonParam: string,
    @Param('episode') episodeParam: string,
    @Query() query: Record<string, string>,
  ) {
    const parsedQuery = parseGetEpisodeQuery(query);
    const relations = formEpisodeRelations(parsedQuery);
    const seasonId = parsePositionOrId(seasonParam);
    const episodeId = parsePositionOrId(episodeParam);
    const episode = await this.serialsService.getEpisode(
      imdbid,
      seasonId,
      episodeId,
      relations,
    );
    return episode;
  }

  @Patch('/:imdbid/update')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async updateData(
    @Param('imdbid') imdbid: string,
    @Body() data: UpdateSerialDto,
    @Req() req: Request,
  ) {
    const serial = await this.serialsRepository.findOne({
      where: {
        imdbid,
      },
      relations: {
        fiction: {
          genres: true,
          studios: true,
        },
      },
    });

    if (!serial) {
      throw new Error('Serial not found');
    }

    if (serial.fiction.checked && req.user.role !== UserRole.Admin) {
      throw new ForbiddenException("You can't edit checked movies");
    }

    this.serialsService.updateSerial(serial, data);
  }


}
