import { Body, Controller, Get, Param, Post, Query, Req, Request, Res } from '@nestjs/common';
import { FictionsService } from './fictions.service';
import { getArrayStrings } from 'src/serials/utils';
import { CastKind, formatDate } from './types/casts';
import { parseFictionKind } from './utils';
import { Roles } from 'decorators/roles.decorator';
import { MagicFind } from './dto/magic-find.dto';
import { Response } from 'express';
import { UserRole } from 'src/user/entities/user.entity';
import { readFile } from 'fs/promises';
import { Fiction, FictionKind } from './entities/fiction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { FragmentsServers } from './entities/server.entity';
import { format } from 'fast-csv';
import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';

@Controller('fictions')
export class FictionsController {
  constructor(private readonly fictionsService: FictionsService,
    
    @InjectRepository(Fiction)
    private readonly fictionsRepository: Repository<Fiction>,
    
    @InjectRepository(FragmentsServers)
    private readonly fragmentsRepository: Repository<FragmentsServers>
    ) {}

  @Get('/:kind/:imdbid/crew')
  async getCrew(
    @Param('kind') kind: string,
    @Param('imdbid') imdbid: string,
    @Query() queryParams: Record<string, string>,
  ) {
    // Query params:
    // cast: directors,writers,cast

    const castTypes = getArrayStrings(
      queryParams.cast,
      Object.values(CastKind),
    );
    const fictionKind = parseFictionKind(kind);

    const crew = await this.fictionsService.getCrew(
      fictionKind,
      imdbid,
      castTypes,
    );

    return crew;
  }

  @Get('/:kind/:imdbid/studios')
  async getStudios(
    @Param('kind') kind: string,
    @Param('imdbid') imdbid: string,
  ) {
    const fictionKind = parseFictionKind(kind);

    const studios = await this.fictionsService.getStudios(fictionKind, imdbid);
    return studios;
  }

  @Get('/:kind/:imdbid/genres')
  async getGenres(
    @Param('kind') kind: string,
    @Param('imdbid') imdbid: string,
  ) {
    const fictionKind = parseFictionKind(kind);

    const genres = await this.fictionsService.getGenres(fictionKind, imdbid);
    return genres;
  }

  @Roles([UserRole.Admin, UserRole.ContentManager])
  @Get('/fragments-servers')
  async geFragmentstServers() {
    const servers = await this.fictionsService.getFragmentsServers();
    return servers;
  }


  @Roles([UserRole.Admin, UserRole.ContentManager])
  @Post('/magic-find')
  async magicFind(@Body() data: MagicFind, @Res() res: Response) {
    const server = await this.fictionsService.magicFind(data);
    return res.json({ serverId: server });
  }

  @Get('/frank')
  async frank( @Res() res: Response)
  {
      res.json({status: "in progress"})
      const fictionsEntity = await this.fictionsRepository.find({
          select: {
              movieImdbid: true,
              movie: 
              {
                  title: true,
                  addedAt: true,
                  releaseYear: true,
                  audioTracks: true,
                  subtitleTracks: true
              },
          },
          where: { kind: FictionKind.Movie, checked: false },
          relations: { movie: { audioTracks: true, subtitleTracks: true }, }
      });
      
      // Оптимизированное создание данных
      const rowsWithEditor = fictionsEntity
          .filter(fiction => fiction.movie.audioTracks?.length > 0 || fiction.movie.subtitleTracks?.length > 0)
          .map(fiction => ({
              imdbid: fiction.movieImdbid,
              title: fiction.movie.title,
              releaseYear: fiction.movie.releaseYear,  // Исправлено: releaseYear вместо realeseYear
              addedAt: formatDate(fiction.movie.addedAt),  // Исправлено: addedAt вместо addetAt
              url: `https://screenify.one/admin/movies-no/${fiction.movieImdbid}`
          }));
      
      // Запись данных в CSV файл с использованием fast-csv
      const writeCSVToFile = async (filename, data) => {
          try {
              const ws = fs.createWriteStream(filename);
              const csvStream = format({
                  headers: true,
                  delimiter: '\t'  // Используем табуляцию в качестве разделителя
              });
      
              csvStream.pipe(ws);
              data.forEach(row => csvStream.write(row));
              csvStream.end();
      
              console.log(`File written successfully to ${filename}`);
          } catch (error) {
              console.error(`Error writing file: ${error.message}`);
          }
      };
      
      // Параллельная запись файлов
      await Promise.all([
          writeCSVToFile('rowsWithEditor.csv', rowsWithEditor),
      ]);
      
      console.log('All files written successfully');
  }

    @Get('/frank-serial')
    async frankSerial( @Res() res: Response)
    {
        res.json({status: "in progress"})
        const fictionsEntity = await this.fictionsRepository.find({
            select: {
                serialImdbid: true,
                serial: 
                {
                    title: true,
                    addedAt: true,
                    releaseYear: true,
                    seasons: {
                        position: true,
                        episodes: {
                            title: true,
                            imdbid: true,
                            audioTracks: true,
                            subtitleTracks: true
                        }
                    }
                },
            },
            where: { kind: FictionKind.Serial, checked: false},
            relations: { serial: { seasons: {episodes: {audioTracks: true, subtitleTracks: true} }}}
        });
        console.log(fictionsEntity)
        // Оптимизированное создание данных
        const rowsWithEditor = fictionsEntity
        .flatMap(fiction => fiction.serial.seasons.flatMap((season) => {
            return season.episodes
                .filter(episode => 
                    episode.audioTracks?.length > 0 || episode.subtitleTracks?.length > 0
                )
                .map((episode) => {
                    return {
                        imdbid: fiction.serialImdbid,
                        serialTitle: fiction.serial.title,
                        releaseYear: fiction.serial.releaseYear,
                        addedAt: formatDate(fiction.serial.addedAt),
                        seasonPosition: season.position,
                        episodeImdbid: episode.imdbid,
                        episodeTitle: episode.title,
                        url: `https://screenify.one/admin/serials-no/${fiction.serialImdbid}/${episode.imdbid}`
                    }
                });
        }));
    

            const pathToFile = './serials.csv';

            // Настройка записи в CSV файл
            const csvWriter = createObjectCsvWriter({
                path: pathToFile,
                header: [
                    { id: 'imdbid', title: 'Serial IMDB ID' },
                    { id: 'serialTitle', title: 'Serial Title' },
                    { id: 'releaseYear', title: 'Release Year' },
                    { id: 'addedAt', title: 'Added At' },
                    { id: 'seasonPosition', title: 'Season Position' },
                    { id: 'episodeImdbid', title: 'Episode IMDB ID' },
                    { id: 'episodeTitle', title: 'Episode Title' },
                    { id: 'url', title: 'URL' }
                ]
            });
        
            // Записываем данные в CSV файл
            await csvWriter.writeRecords(rowsWithEditor.flat()); // flat() для выравнивания вложенных массивов
        
            console.log('CSV файл успешно создан');
    }
}
