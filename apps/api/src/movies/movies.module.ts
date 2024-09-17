import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movies } from './entities/movies.entity';
import { Personality } from 'src/personality/entities/personality.entity';
import { Genres } from 'src/genres/entities/genre.entity';
import { PersonalityService } from 'src/personality/personality.service';
import { GenresService } from 'src/genres/genres.service';
import { Studios } from 'src/studios/entities/studio.entity';
import { StudiosService } from 'src/studios/studios.service';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { SerialsService } from 'src/serials/serials.service';
import { Serial } from 'src/serials/entities/serials.entity';
import { Season } from 'src/serials/entities/seasons.entity';
import { SearchService } from 'src/search/search.service';
import { Episode } from 'src/serials/entities/episodes.entity';
import { FragmentsServers } from 'src/fictions/entities/server.entity';
import { AudioTrack } from 'src/audio-tracks/entities/audio-track.entity';
import { SubtitleTrack } from 'src/subtitle-tracks/entities/subtitle-track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Movies,
      Personality,
      Genres,
      Studios,
      Fiction,
      User,
      List,
      Serial,
      Season,
      Episode,
      FragmentsServers,
      AudioTrack,
      SubtitleTrack,
    ]),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    PersonalityService,
    GenresService,
    StudiosService,
    UserService,
    ListsService,
    SerialsService,
    SearchService,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
