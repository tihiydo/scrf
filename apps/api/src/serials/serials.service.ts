import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  minimalSerialRelations,
  minimalSerialSelect,
  Serial,
} from './entities/serials.entity';
import {
  Equal,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Season } from './entities/seasons.entity';
import { Episode } from './entities/episodes.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { QueryFilters } from './types/library';
import { User } from 'src/user/entities/user.entity';
import { parseStringNumber, removeDuplicates } from 'src/utils';
import { Genres } from 'src/genres/entities/genre.entity';
import { Studios } from 'src/studios/entities/studio.entity';
import { UpdateEpisodeDto, UpdateSerialDto } from './dto/update.dto';
import { SubtitleTrack } from 'src/subtitle-tracks/entities/subtitle-track.entity';
import { AudioTrack } from 'src/audio-tracks/entities/audio-track.entity';
import { Personality } from 'src/personality/entities/personality.entity';
import { FragmentsServers } from 'src/fictions/entities/server.entity';

@Injectable()
export class SerialsService {
  constructor(
    @InjectRepository(Serial)
    private readonly serialsRepository: Repository<Serial>,

    @InjectRepository(Season)
    private readonly seasonsRepository: Repository<Season>,

    @InjectRepository(Episode)
    private readonly episodesRepository: Repository<Episode>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Fiction)
    private readonly fictionRepository: Repository<Fiction>,

    @InjectRepository(Studios)
    private readonly studiosRepository: Repository<Studios>,

    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,

    @InjectRepository(AudioTrack)
    private readonly audioTracksRepository: Repository<AudioTrack>,

    @InjectRepository(SubtitleTrack)
    private readonly subtitlesRepository: Repository<SubtitleTrack>,

    @InjectRepository(Personality)
    private readonly personalityRepository: Repository<Personality>,

    @InjectRepository(FragmentsServers)
    private readonly fragmentsServersRepository: Repository<FragmentsServers>,
  ) { }

  async getMyVote(
    serialId: string,
    userId: string,
  ): Promise<{ vote?: 'liked' | 'disliked' }> {
    const likedFiction = await this.fictionRepository.findOne({
      where: {
        serial: {
          imdbid: serialId,
        },
        likedby: {
          id: userId,
        },
      },
    });

    if (likedFiction) {
      return {
        vote: 'liked',
      };
    }

    const dislikedFiction = await this.fictionRepository.findOne({
      where: {
        serial: {
          imdbid: serialId,
        },
        dislikedby: {
          id: userId,
        },
      },
    });

    if (dislikedFiction) {
      return {
        vote: 'disliked',
      };
    }

    return {};
  }

  async getNextEpisode(imdbid: string) {
    const currentEpisode = await this.episodesRepository.findOne({
      where: {
        imdbid: imdbid,
      },
      relations: {
        season: true,
        serial: true,
      },
    });

    if (!currentEpisode) throw new NotFoundException('Episode not found');

    const nextEpisodeInCurrentSeason = await this.episodesRepository.findOne({
      where: {
        serialImdbid: currentEpisode.serialImdbid,
        season: {
          position: currentEpisode.season.position,
        },
        position: currentEpisode.position + 1,
      },
      relations: {
        season: true,
        serial: true,
      },
    });

    if (nextEpisodeInCurrentSeason) {
      return nextEpisodeInCurrentSeason;
    }

    const nextEpisodeInNextSeason = await this.episodesRepository.findOne({
      where: {
        serialImdbid: currentEpisode.serialImdbid,
        position: 1,
        season: {
          position: currentEpisode.season.position + 1,
        },
      },
      relations: {
        season: true,
        serial: true,
      },
    });

    return nextEpisodeInNextSeason;
  }

  async getPrevEpisode(imdbid: string) {
    const currentEpisode = await this.episodesRepository.findOne({
      where: {
        imdbid: imdbid,
      },
      relations: {
        season: true,
        serial: true,
      },
    });

    if (!currentEpisode) throw new NotFoundException('Episode not found');

    const prevEpisodeInCurrentSeason = await this.episodesRepository.findOne({
      where: {
        serialImdbid: currentEpisode.serialImdbid,
        season: {
          position: currentEpisode.season.position,
        },
        position: currentEpisode.position - 1,
      },
      relations: {
        season: true,
        serial: true,
      },
    });

    if (prevEpisodeInCurrentSeason) {
      return prevEpisodeInCurrentSeason;
    }

    const prevEpisodeInPrevSeason = await this.episodesRepository.find({
      where: {
        serialImdbid: currentEpisode.serialImdbid,
        season: {
          position: currentEpisode.season.position - 1,
        },
      },
      order: {
        position: 'DESC',
      },
      take: 1,
      relations: {
        season: true,
        serial: true,
      },
    });

    return (prevEpisodeInPrevSeason ?? [])[0];
  }

  async getLikes(movieId: string) {
    const fictionId = (
      await this.fictionRepository.findOne({ where: { serialImdbid: movieId } })
    ).id;
    const updatedFiction = await this.fictionRepository.findOne({
      where: { id: fictionId },
      relations: ['likedby', 'dislikedby'],
    });
    return {
      likes: updatedFiction.likedby.length,
      dislikes: updatedFiction.dislikedby.length,
    };
  }

  async like(
    movieId: string,
    userId: string,
  ): Promise<{ likes: number; dislikes: number }> {
    const fictionId = (
      await this.fictionRepository.findOne({ where: { serialImdbid: movieId } })
    ).id;
    const fiction = await this.fictionRepository.findOne({
      where: { id: fictionId },
      relations: { likedby: true, dislikedby: true },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { likes: true, dislikes: true },
    });

    if (!fiction || !user) {
      throw new Error('Fiction or user not found');
    }

    // Remove dislike if it exists
    user.dislikes = user.dislikes.filter(
      (dislikedFiction) => dislikedFiction.id !== fiction.id,
    );

    // Toggle like
    if (user.likes.some((likedFiction) => likedFiction.id === fiction.id)) {
      user.likes = user.likes.filter(
        (likedFiction) => likedFiction.id !== fiction.id,
      );
    } else {
      user.likes.push(fiction);
    }

    await this.userRepository.save(user);

    // Fetch updated counts
    const updatedFiction = await this.fictionRepository.findOne({
      where: { id: fictionId },
      relations: ['likedby', 'dislikedby'],
    });

    return {
      likes: updatedFiction.likedby.length,
      dislikes: updatedFiction.dislikedby.length,
    };
  }

  async dislike(movieId: string, userId: string) {
    const fictionId = (
      await this.fictionRepository.findOneBy({ serialImdbid: movieId })
    ).id;

    const fiction = await this.fictionRepository.findOne({
      where: { id: fictionId },
      relations: { likedby: true, dislikedby: true },
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { likes: true, dislikes: true },
    });

    if (!fiction || !user) {
      throw new Error('Fiction or user not found');
    }

    // Remove like if it exists
    user.likes = user.likes.filter(
      (likedFiction) => likedFiction.id !== fiction.id,
    );

    // Toggle dislike
    if (
      user.dislikes.some((dislikedFiction) => dislikedFiction.id === fiction.id)
    ) {
      user.dislikes = user.dislikes.filter(
        (dislikedFiction) => dislikedFiction.id !== fiction.id,
      );
    } else {
      user.dislikes.push(fiction);
    }

    await this.userRepository.save(user);

    // Fetch updated counts
    const updatedFiction = await this.fictionRepository.findOne({
      where: { id: fictionId },
      relations: ['likedby', 'dislikedby'],
    });

    return {
      likes: updatedFiction.likedby.length,
      dislikes: updatedFiction.dislikedby.length,
    };
  }

  async getSerie(imdbid: string) {
    const availableAudioTracks = await this.audioTracksRepository.find({
      where: {
        episode: {
          serialImdbid: imdbid,
        },
      },
    });

    const availableSubtitles = await this.subtitlesRepository.find({
      where: {
        episode: {
          serialImdbid: imdbid,
        },
      },
    });

    const casts = await this.personalityRepository.find({
      where: {
        casts: {
          serial: {
            imdbid,
          },
        },
      },
    });

    const writers = await this.personalityRepository.find({
      where: {
        writer: {
          serial: {
            imdbid,
          },
        },
      },
    });

    const directors = await this.personalityRepository.find({
      where: {
        directed: {
          serial: {
            imdbid,
          },
        },
      },
    });

    const relations: FindOptionsRelations<Serial> = {
      fiction: {
        genres: true,
        studios: true,
      },
      seasons: true,
    };

    const serie = await this.serialsRepository.findOne({
      where: {
        imdbid: imdbid,
      },
      relations,
      select: {
        fiction: {
          id: true,
          casts: {
            personName: true,
            imdbid: true,
            photoUrl: true,
          },
          writers: {
            personName: true,
            imdbid: true,
            photoUrl: true,
          },
          directors: {
            personName: true,
            imdbid: true,
            photoUrl: true,
          },
        },
      },
      order: {
        seasons: {
          position: {
            direction: 'ASC',
          },
        },
      },
    });

    if (!serie) {
      throw new NotFoundException('Serie not found');
    }

    serie.fiction.casts = casts;
    serie.fiction.writers = writers;
    serie.fiction.directors = directors;

    return {
      ...serie,
      audioTracks: removeDuplicates(availableAudioTracks, 'name'),
      subtitleTracks: removeDuplicates(availableSubtitles, 'name'),
    };
  }

  async getSeason(
    serialImdbid: string,
    seasonId: number | string,
    relations?: FindOneOptions<Season>['relations'],
  ) {
    const where: FindOptionsWhere<Season> = {
      serial: {
        imdbid: serialImdbid,
      },
    };

    if (typeof seasonId === 'number') {
      where.position = seasonId;
    } else if (typeof seasonId === 'string') {
      where.id = seasonId;
    }

    const season = await this.seasonsRepository.findOne({
      where,
      relations: relations ?? {
        episodes: true,
        serial: true,
      },
    });

    if (!season) {
      throw new NotFoundException('Season not found');
    }

    return season;
  }

  async getSeasonEpisodes(serialImdbid: string, seasonId: number | string) {
    const where: FindOptionsWhere<Episode> = {
      serial: {
        imdbid: serialImdbid,
      },
    };

    if (typeof seasonId === 'number') {
      where.season = {
        position: seasonId,
      };
    } else if (typeof seasonId === 'string') {
      where.season = {
        id: seasonId,
      };
    }

    const episodes = await this.episodesRepository.find({
      where,
      order: {
        position: 'ASC',
      },
    });
    return episodes;
  }

  async getEpisode(
    serialImdbid: string,
    seasonId: number | string,
    episodeId: number | string,
    relations?: FindOptionsRelations<Episode>,
  ) {
    const where: FindOptionsWhere<Episode> = {
      serial: {
        imdbid: serialImdbid,
      },
    };

    if (typeof seasonId === 'number') {
      where.season = {
        position: seasonId,
      };
    } else if (typeof seasonId === 'string') {
      where.season = {
        id: seasonId,
      };
    }

    if (typeof episodeId === 'number') {
      where.position = episodeId;
    } else if (typeof episodeId === 'string') {
      where.imdbid = episodeId;
    }

    const episode = await this.episodesRepository.findOne({
      where,
      relations: relations ?? {
        season: true,
        serial: true,
      },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }

    return episode;
  }

  async defaultGetEpisode(imdbid: string) {
    const episode = await this.episodesRepository.findOne({
      where: { imdbid },
      relations: { season: true },
    });

    return episode;
  }

  async findFiltered(filters: Partial<QueryFilters>) {
    let where: FindOptionsWhere<Serial> = {
      fiction: {
        checked: true,
      },
    };
    let order: FindOptionsOrder<Serial> = {
      rating: 'DESC',
    };

    if (filters.sortBy) {
      if (filters.sortBy === 'by_novelty') {
        order = {
          releaseDate: 'DESC',
        };
      } else if (filters.sortBy === 'imdb_rating') {
        order = {
          rating: 'DESC',
        };
      }
    }

    if (filters.genre) {
      where = {
        fiction: {
          genres: {
            slug: ILike(filters.genre),
          },
        },
      };
    }

    if (filters.audio) {
      where = {
        ...where,
        episodes: {
          ...(where.episodes as Record<string, any>),
          audioTracks: {
            ...((where.episodes as Record<string, any>)?.audioTracks as Record<
              string,
              any
            >),
            name: Like(decodeURIComponent(filters.audio)),
          },
        },
      };
    }

    if (filters.subtitles) {
      where = {
        ...where,
        episodes: {
          ...(where.episodes as Record<string, any>),
          subtitleTracks: {
            ...((where.episodes as Record<string, any>)
              ?.subtitleTracks as Record<string, any>),
            name: Like(decodeURIComponent(filters.subtitles)),
          },
        },
      };
    }

    if (filters.studio) {
      where.fiction = {
        ...((where.fiction as Record<string, any>) ?? {}),
        studios: {
          studioName: ILike(decodeURIComponent(filters.studio)),
        },
      };
    }

    if (!Number.isNaN(Number(filters.rating))) {
      where = {
        ...where,
        rating: MoreThanOrEqual(Number(filters.rating)),
      };
    }

    if (!Number.isNaN(Number(filters.releaseYear))) {
      where = {
        ...where,
        releaseYear: Equal(Number(filters.releaseYear)),
      };
    }

    // if (!Number.isNaN(Number(filters.endYear))) {
    //   where = {
    //     ...where,
    //     endYear: LessThanOrEqual(Number(filters.endYear)),
    //   };
    // }
    const paramsPage = parseStringNumber(filters.page, 1);
    const paramsTake = parseStringNumber(filters.take, 12);

    const skip = (paramsPage - 1) * paramsTake;
    const take = paramsTake;

    const serials = await this.serialsRepository.find({
      relations: minimalSerialRelations,
      select: minimalSerialSelect,
      where,
      order,
      take,
      skip,
    });

    const totalElements = await this.serialsRepository.count({
      where,
    });

    const studios = [];
    // const studios = await this.studiosRepository.find({
    //   where: {
    //     studiosMovies: {
    //       serial: {
    //         ...where,
    //         fiction: {
    //           ...((where.fiction as Maybe<Record<string, any>>) ?? {}),
    //           studios: null,
    //         },
    //       },
    //     },
    //   },
    // });

    return { serials, total: totalElements, studios };
  }

  async updateSerial(serial: Serial, data: UpdateSerialDto) {
    // Update movie-specific fields
    if (serial) {
      serial.title = data.title;
      serial.description = data.description;
      serial.fiction.slug = data.slug;
      serial.rating = data.rating;
      serial.portraitImage = data.portraitImage;
      serial.fullDescription = data.fullDescription;
      serial.voteCount = data.voteCount;
      serial.releaseDate = new Date(data.releaseDate);
      serial.releaseYear = new Date(data.releaseDate).getFullYear();
      serial.addedAt = data.addedAt;
      serial.fiction.checked = data.checked;
      await this.fictionRepository.save(serial.fiction); // Save the movie entity separately
      await this.serialsRepository.save(serial); // Save the movie entity separately
    } else {
      throw new Error('Movie entity not found in Fiction');
    }

    // // Update directors
    // const directors = await this.personalityRepository.findByIds(
    //   data.directors,
    // );
    // movie.fiction.directors = directors;

    // // Update writers
    // const writers = await this.personalityRepository.findByIds(data.writers);
    // movie.fiction.writers = writers;

    // // Update casts
    // const casts = await this.personalityRepository.findByIds(data.casts);
    // movie.fiction.casts = casts;

    // Update genres
    const genres = await this.genresRepository.findByIds(data.genres);
    serial.fiction.genres = genres;

    // Update studios
    const studios = await this.studiosRepository.findByIds(data.studios);
    serial.fiction.studios = studios;

    // Update server

    await this.fictionRepository.save(serial.fiction);

    return { status: 'updated' };
  }

  async updateEpisode(episode: Episode, data: UpdateEpisodeDto) {
    // Update movie-specific fields
    if (episode) {
      episode.title = data.title;
      episode.description = data.description;
      episode.slug = data.slug;
      episode.rating = data.rating;
      episode.portraitImage = data.portraitImage;
      episode.voteCount = data.voteCount;
      episode.releaseDate = new Date(data.releaseDate);
      episode.releaseYear = new Date(data.releaseDate).getFullYear();
      await this.episodesRepository.save(episode); // Save the movie entity separately
    } else {
      throw new Error('Episode entity not found in Fiction');
    }

    return { status: 'updated' };
  }
}
