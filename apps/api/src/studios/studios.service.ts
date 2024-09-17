import { Injectable } from '@nestjs/common';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { Studios } from './entities/studio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class StudiosService {
  constructor(
    @InjectRepository(Studios)
    private readonly studiosRepository: Repository<Studios>,
  ) { }

  async findAll() {
    const rows = await this.studiosRepository.find();
    return rows;
  }

  async findMany(options?: FindManyOptions<Studios>) {
    const rows = await this.studiosRepository.find(options);
    return rows;
  }

  async findOne(findOptions: FindOneOptions<Studios>) {
    const rows = await this.studiosRepository.findOne(findOptions);
    return rows;
  }


  async create(data: UpdateStudioDto[] | UpdateStudioDto) {
    await this.studiosRepository.upsert(data, ['imdbid']);
    return data;
  }

  async remove(id: string) {
    const rows = await this.studiosRepository.delete({ imdbid: id });
    return { stasus: 'removed' };
  }

  async update(id: string, data: UpdateStudioDto) {
    const rows = await this.studiosRepository.update({ imdbid: id }, data);
    return { stasus: 'updated' };
  }
}
