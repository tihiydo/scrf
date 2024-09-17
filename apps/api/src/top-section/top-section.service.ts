import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopSection, TopSectionPage } from './entities/top-section.entity';
import { In, Repository } from 'typeorm';
import { Movies } from 'src/movies/entities/movies.entity';

@Injectable()
export class TopSectionService {
  constructor(
    @InjectRepository(TopSection)
    private readonly topSectionRepository: Repository<TopSection>,

    @InjectRepository(Movies)
    private readonly moviesRespository: Repository<Movies>,
  ) {}

  async getTopSection(page: TopSectionPage) {
    const topSection = await this.topSectionRepository.findOne({
      where: {
        page: page,
      },
      relations: {
        movies: {
          fiction: true,
        },
      },
    });

    if (!topSection) {
      throw new NotFoundException(
        `Top section for ${page} not found. Please create initial data`,
      );
    }
    return topSection;
  }

  async setMovies(page: TopSectionPage, moviesIds: string[]) {
    const topSection = await this.topSectionRepository.findOne({
      where: {
        page: page,
      },
    });

    if (!topSection) {
      throw new NotFoundException(
        `Top section for ${page} not found. Please create initial data`,
      );
    }

    const movies = await this.moviesRespository.find({
      where: {
        imdbid: In(moviesIds),
      },
    });

    const moviesWithNoTrailer = movies.filter(
      (movie) => !movie.previewVideoUrl,
    );

    if (moviesWithNoTrailer.length) {
      throw new BadRequestException(
        `Movies ${moviesWithNoTrailer.map((movie) => movie.title).join(', ')} don't have preview video`,
      );
    }

    topSection.movies = movies;
    return await this.topSectionRepository.save(topSection);
  }
}
