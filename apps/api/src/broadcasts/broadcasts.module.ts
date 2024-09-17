import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Broadcasts } from './entities/broadcasts.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { Episode } from 'src/serials/entities/episodes.entity';
import { BroadcastsService } from './broadcasts.service';
import { BroadcastsController } from './broadcasts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcasts])],
  providers: [BroadcastsService],
  controllers: [BroadcastsController],
})
export class BroadcastsModule {}
