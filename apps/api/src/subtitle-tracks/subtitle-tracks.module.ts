import { Module } from '@nestjs/common';
import { SubtitleTracksController } from './subtitle-tracks.controller';
import { SubtitleTracksService } from './subtitle-tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from 'src/serials/entities/episodes.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { SubtitleTrack } from './entities/subtitle-track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubtitleTrack, Episode, Movies])],
  controllers: [SubtitleTracksController],
  providers: [SubtitleTracksService],
})
export class SubtitleTracksModule {}
