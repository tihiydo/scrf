import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fiction, FictionKind } from 'src/fictions/entities/fiction.entity';
import {
  minimalMovieRelations,
  minimalMovieSelect,
  Movies,
} from 'src/movies/entities/movies.entity';
import { PersonalityService } from 'src/personality/personality.service';
import {
  minimalSerialRelations,
  minimalSerialSelect,
  Serial,
} from 'src/serials/entities/serials.entity';
// import { Studios } from 'src/studios/entities/studio.entity';
// import { Personality } from 'src/personality/entities/personality.entity';
import { StudiosService } from 'src/studios/studios.service';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    private readonly personalityService: PersonalityService,
    private readonly studiosService: StudiosService,

    @InjectRepository(Fiction)
    private readonly fictionRepository: Repository<Fiction>,

    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(Serial)
    private readonly serialsRepository: Repository<Serial>,
  ) { }

  async searchAll(searchStr: string, entities?: string[]) {
    // let studios: Studios[] = [];

    // if ((entities && entities.includes('studio')) || !entities) {
    //   studios = await this.studiosService.findMany({
    //     where: {
    //       studioName: ILike(`%${searchStr}%`),
    //     },
    //   });
    // }

    // let personalities: Personality[] = [];

    // if ((entities && entities.includes('personality')) || !entities) {
    //   personalities = await this.personalityService.findMany({
    //     where: {
    //       personName: ILike(`%${searchStr}%`),
    //     },
    //   });
    // }

    let movies: Movies[] = [];

    if ((entities && entities.includes('movie')) || !entities) {
      movies = await this.moviesRepository.find({
        where: {
          title: ILike(`%${searchStr}%`),
          fiction: {
            kind: FictionKind.Movie,
            checked: true,
          },
        },
        take: 50,
        order: {
          rating: 'DESC',
        },
        relations: minimalMovieRelations,
        select: minimalMovieSelect,
      });
    }

    let serials: Serial[] = [];

    if ((entities && entities.includes('serial')) || !entities) {
      serials = await this.serialsRepository.find({
        where: {
          title: ILike(`%${searchStr}%`),
          fiction: {
            kind: FictionKind.Serial,
            checked: true,
          },
        },
        take: 50,
        order: {
          rating: 'DESC',
        },
        relations: minimalSerialRelations,
        select: minimalSerialSelect,
      });
    }

    let fictions: Fiction[] = [];

    if ((entities && entities.includes('fiction')) || !entities) {
      fictions = await this._searchFictions(searchStr);
    }

    return {
      movies,
      serials,
      fictions,
      // studios,
      // personalities,
    };
  }

  private async _searchFictions(searchStr: string) {
    const fictions = await this.fictionRepository.find({
      relations: {
        serial: true,
        movie: true,
        genres: true,
      },
      take: 50,
      where: [
        {
          checked: true,
          serial: {
            title: ILike(`%${searchStr}%`),
          },
        },
        {
          checked: true,
          movie: {
            title: ILike(`%${searchStr}%`),
          },
        },
      ],
    });

    return fictions;
  }
}
