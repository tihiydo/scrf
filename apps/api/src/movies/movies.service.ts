import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Movies,
  minimalMovieRelations,
  minimalMovieSelect,
} from './entities/movies.entity';
import {
  Equal,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UpdateMoviesDto } from './dto/update-movies.dto';
import { Genres } from 'src/genres/entities/genre.entity';
import { Personality } from 'src/personality/entities/personality.entity';
import { Studios } from 'src/studios/entities/studio.entity';
import { QueryFilters } from './types';
import { EditMovieDto } from './dto/edit-movie.dto';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { User } from 'src/user/entities/user.entity';
import { parseStringNumber } from 'src/utils';
import { FragmentsServers } from 'src/fictions/entities/server.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(Fiction)
    private readonly fictionRepository: Repository<Fiction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Personality)
    private readonly personalityRepository: Repository<Personality>,

    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,

    @InjectRepository(Studios)
    private readonly studiosRepository: Repository<Studios>,

    @InjectRepository(FragmentsServers)
    private readonly serversRepository: Repository<FragmentsServers>,
  ) { }

  async findMany(options?: FindManyOptions<Movies>) {
    const rows = await this.moviesRepository.find(options);
    return rows;
  }

  async findFiltered(filters: Partial<QueryFilters>) {
    let where: FindOptionsWhere<Movies> = {
      fiction: {
        checked: true,
      },
    };
    let order: FindOptionsOrder<Movies> = {
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
      where.fiction = {
        ...((where.fiction as {}) ?? {}),
        genres: {
          slug: filters.genre,
        },
      };
    }

    if (filters.audio) {
      where = {
        ...where,
        audioTracks: {
          name: Like(decodeURIComponent(filters.audio)),
        },
      };
    }

    if (filters.subtitles) {
      where = {
        ...where,
        subtitleTracks: {
          name: Like(decodeURIComponent(filters.subtitles)),
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

    if (!Number.isNaN(Number(filters.year))) {
      where = {
        ...where,
        releaseYear: Equal(Number(filters.year)),
      };
    }

    const paramsPage = parseStringNumber(filters.page, 1);
    const paramsTake = parseStringNumber(filters.take, 12);

    const skip = (paramsPage - 1) * paramsTake;
    const take = paramsTake;

    const movies = await this.moviesRepository.find({
      relations: minimalMovieRelations,
      select: minimalMovieSelect,
      where,
      order,
      skip,
      take,
    });

    const totalElements = await this.moviesRepository.count({
      where,
    });

    const studios = [];
    // const studios = await this.studiosRepository.find({
    //   where: {
    //     studiosMovies: {
    //       movie: {
    //         ...where,
    //         fiction: {
    //           ...((where.fiction as Maybe<Record<string, any>>) ?? {}),
    //           studios: null,
    //         },
    //       },
    //     },
    //   },
    // });

    // const genres = await this.genresRepository.find({
    //   where: {
    //     movies: {
    //       movieImdbid: In(movies.map((movie) => movie.imdbid)),
    //     },
    //   },
    // });

    return {
      movies,
      studios,
      total: totalElements,
    };
  }

  async findOne(where: FindOptionsWhere<Movies>) {
    // lazy loading relations for better performance
    const casts = await this.personalityRepository.find({
      where: {
        casts: {
          movie: where,
        },
      },
    });

    const writers = await this.personalityRepository.find({
      where: {
        writer: {
          movie: where,
        },
      },
    });

    const directors = await this.personalityRepository.find({
      where: {
        directed: {
          movie: where,
        },
      },
    });

    const movie = await this.moviesRepository.findOne({
      where: {
        ...where,
        fiction: {
          ...((where?.fiction as Maybe<FindOptionsWhere<Fiction>>) ?? {}),
          checked: true,
        },
      },
      order: {
        addedAt: 'DESC',
      },
      relations: {
        audioTracks: true,
        subtitleTracks: true,
        fiction: {
          genres: true,
          studios: true,
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not foudn');
    }

    movie.fiction.casts = casts;
    movie.fiction.writers = writers;
    movie.fiction.directors = directors;

    return movie;
  }

  async remove(id: string) {
    // Find the Fiction entity based on the Movie's imdbid
    const fiction = await this.fictionRepository.findOne({
      where: {
        movie: {
          imdbid: id,
        },
      },
      relations: ['movie'],
    });

    if (!fiction) {
      throw new NotFoundException('Fiction not found for the given movie id');
    }

    // Delete the Fiction entity
    await this.fictionRepository.remove(fiction);

    // Delete the Movie entity
    await this.moviesRepository.delete({ imdbid: id });

    return { status: 'removed' };
  }

  async update(movie: Movies, data: UpdateMoviesDto) {
    if (movie) {
      movie.title = data.title;
      movie.runtime = data.runtime;
      movie.imdbid = data.imdbid;
      movie.description = data.description;
      movie.fiction.slug = data.slug;
      movie.rating = data.rating;
      movie.portraitImage = data.portraitImage;
      movie.fullDescription = data.fullDescription;
      movie.voteCount = data.voteCount;
      movie.releaseDate = new Date(data.releaseDate);
      movie.releaseYear = new Date(data.releaseDate).getFullYear();
      movie.addedAt = new Date(data.addedAt);
      movie.fiction.checked = data.checked;
      await this.fictionRepository.save(movie.fiction); // Save the movie entity separately
      await this.moviesRepository.save(movie); // Save the movie entity separately
    } else {
      throw new Error('Movie entity not found in Fiction');
    }

    // Update genres
    const genres = await this.genresRepository.findByIds(data.genres);
    movie.fiction.genres = genres;

    // Update studios
    const studios = await this.studiosRepository.findByIds(data.studios);
    movie.fiction.studios = studios;

    await this.fictionRepository.save(movie.fiction);

    return { status: 'updated' };
  }

  async edit(imdbid: string, data: EditMovieDto) {
    const movie = await this.moviesRepository.findOne({
      where: {
        imdbid: imdbid,
      },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    const updatedMovie = await this.moviesRepository.save({
      ...movie,
      previewVideoUrl: data.previewVideoUrl,
    });

    return updatedMovie;
  }

  async getMyVote(
    movieId: string,
    userId: string,
  ): Promise<{ vote?: 'liked' | 'disliked' }> {
    const likedFiction = await this.fictionRepository.findOne({
      where: {
        movie: {
          imdbid: movieId,
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
        movie: {
          imdbid: movieId,
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

  async getLikes(movieId: string) {
    const fictionId = (
      await this.fictionRepository.findOne({ where: { movieImdbid: movieId } })
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

  async getCollections() { }

  async similarFilter(movieId: string) {
    const fictionId = (
      await this.fictionRepository.findOne({ where: { movieImdbid: movieId } })
    ).id;
  }

  async like(
    movieId: string,
    userId: string,
  ): Promise<{ likes: number; dislikes: number }> {
    const fictionId = (
      await this.fictionRepository.findOne({ where: { movieImdbid: movieId } })
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
      await this.fictionRepository.findOneBy({ movieImdbid: movieId })
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
}
