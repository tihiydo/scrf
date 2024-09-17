import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PersonalityModule } from 'src/personality/personality.module';
import { StudiosModule } from 'src/studios/studios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { SerialsModule } from 'src/serials/serials.module';
import { Serial } from 'src/serials/entities/serials.entity';

@Module({
  controllers: [SearchController],
  imports: [
    PersonalityModule,
    StudiosModule,
    SerialsModule,
    TypeOrmModule.forFeature([Fiction, Movies, Serial]),
  ],
  providers: [SearchService],
})
export class SearchModule { }
