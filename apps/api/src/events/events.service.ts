import {
  BadRequestException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { LiveEvents, Sports } from './entities/events.entity';


@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(LiveEvents)
    private readonly liveRepository: Repository<LiveEvents>,

    @InjectRepository(Sports)
    private readonly sportsRepository: Repository<Sports>,
  ) {}
 
  async findAll() {
    const now = Math.floor(Date.now() / 1000); // текущее время в секундах
    const rows = await this.liveRepository
    .createQueryBuilder('match')
    .where('match.startAt >= :now OR match.liveStream IS NOT NULL', { now })
    .orderBy('match.startAt', 'ASC') // Sort by `startAt` in ascending order
    .limit(100) // Limit the result to 100 records
    .getMany();
    console.log('match.startAt >= :now OR match.liveStream IS NOT NULL', { now })
  
  return rows;
}

   async getVisibleSports()
   {
    const rows = await this.sportsRepository.find()
    return rows;
   }

  async findOne() {
    const rows = await this.liveRepository.findOne({});
    return rows;
  }
}
