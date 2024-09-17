import { Module } from '@nestjs/common';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { Serial } from 'src/serials/entities/serials.entity';
import { User } from 'src/user/entities/user.entity';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [TypeOrmModule.forFeature([List, Movies, Serial, User])],
  controllers: [ListsController],
  providers: [ListsService],
  exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
