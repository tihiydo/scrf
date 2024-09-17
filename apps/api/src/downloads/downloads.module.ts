import { Module } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
import { DownloadsController } from './downloads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Downloads } from './entities/downloads.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { PersonalityService } from 'src/personality/personality.service';
import { Personality } from 'src/personality/entities/personality.entity';
import { GenresService } from 'src/genres/genres.service';
import { Genres } from 'src/genres/entities/genre.entity';
import { MoviesService } from 'src/movies/movies.service';
import { Studios } from 'src/studios/entities/studio.entity';
import { StudiosService } from 'src/studios/studios.service';
import { FragmentsServers } from 'src/fictions/entities/server.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { Serial } from 'src/serials/entities/serials.entity';
import { Season } from 'src/serials/entities/seasons.entity';
import { Episode } from 'src/serials/entities/episodes.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
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
      FragmentsServers,
      Fiction,
      Serial,
      Season,
      Episode,
      User,
      List
    ]),
  ],
  controllers: [DownloadsController],
  providers: [
    DownloadsService,
    PersonalityService,
    GenresService,
    MoviesService,
    StudiosService,
    ListsService,
    UserService
  ],
})
export class DownloadsModule {}
