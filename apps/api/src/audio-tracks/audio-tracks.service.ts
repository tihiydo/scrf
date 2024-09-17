import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { AudioTrack, AudioTrackKind } from './entities/audio-track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SetAudioTrackDto } from './dto/set-audio-track.dto';
import {
  generateAudioTrackFindOptions,
  validateEpisodeImdbid as parseEpisodeImdbid,
} from './utils';
import { Episode } from 'src/serials/entities/episodes.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import { RenameAudioTrackDto } from './dto/rename-audio-track.dto';
import { parseStringNumber } from 'src/utils';
import { ToggleTrackDto } from './dto/toggle-track.dto';

@Injectable()
export class AudioTracksService {
  constructor(
    @InjectRepository(AudioTrack)
    private readonly audioTracksRepository: Repository<AudioTrack>,

    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(Episode)
    private readonly episodessRepository: Repository<Episode>,
  ) {}

  async setAudioTrack(data: SetAudioTrackDto): Promise<AudioTrack> {
    let imdbid = data.imdbid;

    if (data.kind === 'episode') {
      const { episodePosition, seasonPosition, serialImdbid } =
        parseEpisodeImdbid(data.imdbid);

      const dbEpisode = await this.episodessRepository.findOne({
        where: {
          serialImdbid: serialImdbid,
          season: {
            position: seasonPosition,
          },
          position: episodePosition,
        },
      });

      if (!dbEpisode) throw new NotFoundException('Episode not found');

      imdbid = dbEpisode.imdbid;
    }

    const audioTrackFindOptions = generateAudioTrackFindOptions(
      {
        imdbid: imdbid,
        kind: data.kind,
      },
      {
        where: {
          m3u8Id: data.m3u8Id,
        },
      },
    );

    const existingAudioTrack = await this.getAudioTrack(audioTrackFindOptions);

    if (existingAudioTrack) {
      await this.audioTracksRepository.update(
        audioTrackFindOptions.where as FindOptionsWhere<AudioTrack>,
        {
          originalName: data.name,
        },
      );

      return await this.audioTracksRepository.findOne(audioTrackFindOptions);
    }

    const audioTrackData = this.audioTracksRepository.create({
      name: data.name,
      originalName: data.name,
      m3u8Id: data.m3u8Id,
      kind: data.kind,
    });

    if (data.kind === AudioTrackKind.Episode) {
      const episode = await this.episodessRepository.findOne({
        where: {
          imdbid,
        },
      });

      if (!episode) throw new NotFoundException('Episode not found');

      audioTrackData.episode = episode;
    } else if (data.kind === AudioTrackKind.Movie) {
      const movie = await this.moviesRepository.findOne({
        where: {
          imdbid,
        },
      });

      if (!movie) throw new NotFoundException('Movie not found');

      audioTrackData.movie = movie;
    }

    return await this.audioTracksRepository.save(audioTrackData);
  }

  async getMediaAudioTracks(data: { imdbid: string }): Promise<AudioTrack[]> {
    const audiotracks = this.getAudioTracksByImdbid(data.imdbid);
    return audiotracks;
  }

  async getAudioTrack(findOptions: FindOneOptions<AudioTrack>) {
    return await this.audioTracksRepository.findOne(findOptions);
  }

  async rename(id: string, data: RenameAudioTrackDto): Promise<AudioTrack> {
    const audioTrack = await this.audioTracksRepository.findOne({
      where: {
        id,
      },
    });

    if (!audioTrack) throw new NotFoundException('Audio track not found');

    await this.audioTracksRepository.update(
      {
        id,
      },
      {
        name: data.name,
      },
    );

    return await this.audioTracksRepository.findOne({
      where: {
        id,
      },
    });
  }

  async toggle(id: string, data: ToggleTrackDto): Promise<AudioTrack> {
    const audioTrack = await this.audioTracksRepository.findOne({
      where: {
        id,
      },
    });

    if (!audioTrack) throw new NotFoundException('Audio track not found');

    await this.audioTracksRepository.update(
      {
        id,
      },
      {
        visible:
          typeof data.visible === 'undefined'
            ? !audioTrack.visible
            : data.visible,
      },
    );

    return await this.audioTracksRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteTrack(id: string) {
    const audioTrack = await this.audioTracksRepository.findOne({
      where: {
        id,
      },
    });

    if (!audioTrack) throw new NotFoundException('Audio track not found');

    await this.audioTracksRepository.delete({
      id: audioTrack.id,
    });

    return audioTrack;
  }

  private async getAudioTracksByImdbid(imdbid: string) {
    const movieExists = await this.moviesRepository.exists({
      where: {
        imdbid: imdbid,
      },
    });

    if (movieExists) {
      return await this.audioTracksRepository.find({
        where: {
          movieId: imdbid,
        },
        order: {
          m3u8Id: 'ASC',
        },
      });
    }

    const episodeExists = await this.episodessRepository.exists({
      where: {
        imdbid: imdbid,
      },
    });

    if (episodeExists) {
      return await this.audioTracksRepository.find({
        where: {
          episodeId: imdbid,
        },
        order: {
          m3u8Id: 'ASC',
        },
      });
    }

    throw new NotFoundException('No movie or episode found');
  }
}
