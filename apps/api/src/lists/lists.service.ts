import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Movies,
  minimalMovieRelations,
  minimalMovieSelect,
} from 'src/movies/entities/movies.entity';
import {
  Serial,
  minimalSerialRelations,
  minimalSerialSelect,
} from 'src/serials/entities/serials.entity';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import slugify from 'slugify';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(Serial)
    private readonly serialsRepository: Repository<Serial>,

    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async addMovies(listId: string, moviesIds: string[]) {
    const list = await this.listsRepository.findOne({
      where: {
        id: listId,
      },
      relations: {
        movies: true,
      },
    });

    if (!list) throw new NotFoundException('List not found');

    const movies = await this.moviesRepository.findBy({
      imdbid: In(moviesIds),
    });

    const newMovies = movies.filter(
      (movie) =>
        !list.movies.some(
          (existingMovie) => existingMovie.imdbid === movie.imdbid,
        ),
    );

    list.movies = [...list.movies, ...newMovies];

    return await this.listsRepository.save(list);
  }

  async addSerials(listId: string, serialIds: string[]) {
    const list = await this.listsRepository.findOne({
      where: {
        id: listId,
      },
      relations: {
        serials: true,
      },
    });

    if (!list) throw new NotFoundException('List not found');

    const serials = await this.serialsRepository.findBy({
      imdbid: In(serialIds),
    });

    const newMovies = serials.filter(
      (serial) =>
        !list.serials.some(
          (existingSerial) => existingSerial.imdbid === serial.imdbid,
        ),
    );

    list.serials = [...list.serials, ...newMovies];

    return await this.listsRepository.save(list);
  }

  async removeMovie(listId: string, movieId: string) {
    const list = await this.listsRepository.findOne({
      where: {
        id: listId,
      },
      relations: {
        movies: true,
      },
    });

    if (!list) throw new NotFoundException('List not found');

    const movieToRemove = await this.moviesRepository.findOne({
      where: {
        imdbid: movieId,
      },
    });

    if (!movieToRemove) {
      throw new Error('Movie not found');
    }

    list.movies = list.movies.filter((movie) => movie.imdbid !== movieId);

    return this.listsRepository.save(list);
  }

  async removeSerial(listId: string, serialId: string) {
    const list = await this.listsRepository.findOne({
      where: {
        id: listId,
      },
      relations: {
        serials: true,
      },
    });

    if (!list) throw new NotFoundException('List not found');

    const serialToRemove = await this.serialsRepository.findOne({
      where: {
        imdbid: serialId,
      },
    });

    if (!serialToRemove) {
      throw new Error('Serial not found');
    }

    list.serials = list.serials.filter((serial) => serial.imdbid !== serialId);

    return this.listsRepository.save(list);
  }

  async createList(listData: {
    name: string;
    userId: string;
    movies?: string[];
    serials?: string[];
  }) {
    const existingList = await this.listsRepository.findOne({
      where: {
        user: {
          id: listData.userId,
        },
        name: listData.name,
      },
      select: ['id'],
    });
    if (existingList) {
      throw new BadRequestException('List already exists');
    }

    const listSlug = this.slugifyList(listData.name);
    const user = await this.usersRepository.findOne({
      where: {
        id: listData.userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const list = this.listsRepository.create({
      name: listData.name,
      user: user,
      slug: listSlug,
    });

    const dbList = await this.listsRepository.save(list);

    if (listData.movies?.length) {
      await this.addMovies(dbList.id, listData.movies);
    }

    if (listData.serials?.length) {
      await this.addSerials(dbList.id, listData.serials);
    }

    return await this.listsRepository.findOne({
      where: {
        id: dbList.id,
      },
    });
  }

  async createInitialLists(userId: string) {
    const initialLists = ['Saved', 'Watching', 'Viewed'];
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const lists = await this.dataSource.transaction(async (manager) => {
      const lists: List[] = [];
      for (const listName of initialLists) {
        const slug = this.slugifyList(listName);
        const existingList = await manager.findOne(List, {
          where: {
            slug: slug,
            user: {
              id: userId,
            },
          },
        });

        if (existingList) {
          lists.push(existingList);
        } else {
          const listData = manager.create(List, {
            name: listName,
            slug: slug,
            user: user,
          });

          const list = await manager.save(List, listData);
          lists.push(list);
        }
      }

      return lists;
    });

    return lists;
  }

  async deleteList(listData: { slug: string; userId: string }) {
    const listToDelete = await this.listsRepository.findOne({
      where: {
        user: {
          id: listData.userId,
        },
        slug: listData.slug,
      },
      select: {
        id: true,
      },
    });

    if (!listToDelete) {
      throw new NotFoundException('List not found');
    }

    await this.listsRepository.delete({
      name: listData.slug,
      user: {
        id: listData.userId,
      },
    });
  }

  async getList(options: FindOptionsWhere<List>): Promise<List | null> {
    return await this.listsRepository.findOne({
      where: options,
      relations: {
        movies: {
          fiction: {
            genres: true,
            studios: true,
          },
        },
        serials: {
          fiction: {
            genres: true,
            studios: true,
          },
        },
      },
      select: {
        movies: {
          imdbid: true,
          title: true,
          ageRestriction: true,
          releaseDate: true,
          releaseYear: true,
          portraitImage: true,
          rating: true,
          runtime: true,
        },
        serials: {
          imdbid: true,
          title: true,
          ageRestriction: true,
          releaseDate: true,
          releaseYear: true,
          endYear: true,
          episodesCount: true,
          seasonsCount: true,
          portraitImage: true,
          rating: true,
        },
      },
    });
  }

  async getAllLists(userId: string) {
    return await this.listsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        movies: minimalMovieRelations,
        serials: minimalSerialRelations,
      },
      select: {
        movies: minimalMovieSelect,
        serials: minimalSerialSelect,
      },
    });
  }

  async getFictionLists(data: { userId: string; fictionImdbid: string }) {
    const serial = await this.serialsRepository.findOne({
      where: {
        imdbid: data.fictionImdbid,
      },
      select: ['imdbid'],
    });

    if (serial) {
      return await this.listsRepository.find({
        where: {
          user: {
            id: data.userId,
          },
          serials: {
            imdbid: serial.imdbid,
          },
        },
      });
    } else {
      const movie = await this.moviesRepository.findOne({
        where: {
          imdbid: data.fictionImdbid,
        },
        select: ['imdbid'],
      });
      if (!movie) {
        throw new BadRequestException('Fiction not found');
      }

      return await this.listsRepository.find({
        where: {
          user: {
            id: data.userId,
          },
          movies: {
            imdbid: movie.imdbid,
          },
        },
      });
    }
  }

  private slugifyList(name: string) {
    return slugify(name, {
      replacement: '-',
      remove: undefined,
      lower: true,
      locale: 'en',
    });
  }
}
