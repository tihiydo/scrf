import { Module } from '@nestjs/common';
import { AudioTracksService } from './audio-tracks.service';
import { AudioTracksController } from './audio-tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioTrack } from './entities/audio-track.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { Episode } from 'src/serials/entities/episodes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioTrack, Movies, Episode])],
  providers: [AudioTracksService],
  controllers: [AudioTracksController],
})
export class AudioTracksModule {}
