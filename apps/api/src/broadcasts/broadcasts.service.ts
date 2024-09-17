import {
  BadRequestException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Broadcasts } from './entities/broadcasts.entity';

@Injectable()
export class BroadcastsService {
  constructor(
    @InjectRepository(Broadcasts)
    private readonly broadcastsRepository: Repository<Broadcasts>,
  ) {}
 
  async findAll() {
    const rows = await this.broadcastsRepository.find()
    return rows;
  }

  async findOne(id: number) {
    const rows = await this.broadcastsRepository.findOne({where: {id}});
    return rows;
  }
}
