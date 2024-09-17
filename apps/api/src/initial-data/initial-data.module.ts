import { Module } from '@nestjs/common';
import { InitialDataService } from './initial-data.service';
import { InitialDataController } from './initial-data.controller';
import { PersonalityService } from 'src/personality/personality.service';
import { GenresService } from 'src/genres/genres.service';
import { MoviesService } from 'src/movies/movies.service';
import { StudiosService } from 'src/studios/studios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Downloads } from 'src/downloads/entities/downloads.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { Personality } from 'src/personality/entities/personality.entity';
import { Genres } from 'src/genres/entities/genre.entity';
import { Studios } from 'src/studios/entities/studio.entity';
import { DownloadsService } from 'src/downloads/downloads.service';
import { User } from 'src/user/entities/user.entity';
import { TopSection } from 'src/top-section/entities/top-section.entity';
import { TopSectionService } from 'src/top-section/top-section.service';
import { FragmentsServers } from 'src/fictions/entities/server.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { Serial } from 'src/serials/entities/serials.entity';
import { Season } from 'src/serials/entities/seasons.entity';
import { Episode } from 'src/serials/entities/episodes.entity';
import { ListsModule } from 'src/lists/lists.module';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Downloads,
      Movies,
      Personality,
      Genres,
      Studios,
      User,
      TopSection,
      FragmentsServers,
      Fiction,
      Serial,
      Season,
      Episode,
      List,
    ]),
    ListsModule,
  ],
  controllers: [InitialDataController],
  providers: [
    InitialDataService,
    PersonalityService,
    GenresService,
    MoviesService,
    StudiosService,
    DownloadsService,
    TopSectionService,
    ListsService,
  ],
})
export class InitialDataModule {}
