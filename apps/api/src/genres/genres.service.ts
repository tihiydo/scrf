import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genres } from './entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genres)
    private readonly genresRepository: Repository<Genres>,
  ) {}

  create(createGenreDto: CreateGenreDto[] | CreateGenreDto) {
    return this.genresRepository.upsert(createGenreDto, ['slug']);
  }

  update(createGenreDto: CreateGenreDto[] | CreateGenreDto) {
    return this.genresRepository.upsert(createGenreDto, ['slug']);
  }

  findAll() {
    return this.genresRepository.find();
  }

  findOne(slug: string) {
    return this.genresRepository.find({ where: { slug } });
  }
}
