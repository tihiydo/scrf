import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Personality } from './entities/personality.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { UpdatePersonalityDto } from './dto/update-personality.dto';

@Injectable()
export class PersonalityService {
  constructor(
    @InjectRepository(Personality)
    private readonly personalityRepository: Repository<Personality>,
  ) {}

  async findAll() {
    const rows = await this.personalityRepository.find({take: 100});
    return rows;
  }

  async findMany(options?: FindManyOptions<Personality>) {
    const rows = await this.personalityRepository.find(options);
    return rows;
  }

  async findOne(id: string) {
    const rows = await this.personalityRepository.findOne({
      where: { imdbid: id, casts:{
        checked:
        true,
    },writer: true, directed: true},
      relations: {
        casts:
        {
            movie: true,
            serial: true,
            studios: true
        },
        writer:
        {
            movie: true,
            serial: true,
            studios: true
        },
        directed:
        {
            movie: true,
            serial: true,
            studios: true
        }
      },
      select:
      {
        imdbid: true,
        personName: true,
        description: true,
        photoUrl: true,
        casts: {
            checked: true,
            id: true,
            studios: true,
            movie: {
                imdbid: true,
                title: true,
                portraitImage: true,
                rating: true,
                releaseDate: true,
                runtime: true,
                releaseYear: true
            },
            
            serial: {
                imdbid: true,
                title: true,
                portraitImage: true,
                rating: true,
                releaseDate: true,
                releaseYear: true
            },
        },
        writer:{
            checked: true,
            id: true,
            studios: true,

            movie: {
                imdbid: true,
                title: true,
                portraitImage: true,
                rating: true,
                releaseDate: true,
                runtime: true,
                releaseYear: true
            },
            
            serial: {
                imdbid: true,
                title: true,
                portraitImage: true,
                rating: true,
                releaseDate: true,
                releaseYear: true
            },
        },
        directed:
        {
            id: true,
            checked: true,
            studios: true,

            movie: {
                imdbid: true,
                title: true,
                portraitImage: true,
                rating: true,
                releaseDate: true,
                runtime: true,
                releaseYear: true
            },
            
            serial: {
                imdbid: true,
                title: true,
                portraitImage: true,
                rating: true,
                releaseDate: true,
                releaseYear: true
            },
        },
      }
    });
    return rows;
  }

  async create(data: UpdatePersonalityDto[] | UpdatePersonalityDto) {
    await this.personalityRepository.upsert(data, ['imdbid']);
    return data;
  }

  async remove(id: string) {
    const rows = await this.personalityRepository.delete({ imdbid: id });
    return { stasus: 'removed' };
  }

  async update(id: string, data: UpdatePersonalityDto) {
    const rows = await this.personalityRepository.update({ imdbid: id }, data);
    return { stasus: 'updated' };
  }
}
