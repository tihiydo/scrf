import { Module } from '@nestjs/common';
import { SerialsService } from './serials.service';
import { SerialsController } from './serials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Serial } from './entities/serials.entity';
import { Season } from './entities/seasons.entity';
import { Episode } from './entities/episodes.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { User } from 'src/user/entities/user.entity';
import { FragmentsServers } from 'src/fictions/entities/server.entity';
import { Genres } from 'src/genres/entities/genre.entity';
import { Studios } from 'src/studios/entities/studio.entity';
import { AudioTrack } from 'src/audio-tracks/entities/audio-track.entity';
import { SubtitleTrack } from 'src/subtitle-tracks/entities/subtitle-track.entity';
import { Personality } from 'src/personality/entities/personality.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Serial,
      Season,
      Episode,
      Fiction,
      User,
      FragmentsServers,
      Genres,
      Studios,
      AudioTrack,
      SubtitleTrack,
      Personality,
    ]),
  ],
  providers: [SerialsService],
  controllers: [SerialsController],
  exports: [SerialsService, TypeOrmModule],
})
export class SerialsModule { }
