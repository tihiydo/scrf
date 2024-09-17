import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SetSubtitleTrackDto } from './dto/set-subtitle-track.dto';
import { Episode } from 'src/serials/entities/episodes.entity';
import { Movies } from 'src/movies/entities/movies.entity';
import {
  SubtitleTrack,
  SubtitleTrackMediaKind,
} from './entities/subtitle-track.entity';
import { generateSubtitleTrackFindOptions, parseEpisodeImdbid } from './utils';
import { RenameSubtitleTrackDto } from './dto/rename-subtitle-track.dto';
import { ToggleTrackDto } from './dto/toggle-track.dto';

@Injectable()
export class SubtitleTracksService {
  constructor(
    @InjectRepository(SubtitleTrack)
    private readonly subtitleTracksRepository: Repository<SubtitleTrack>,

    @InjectRepository(Movies)
    private readonly moviesRepository: Repository<Movies>,

    @InjectRepository(Episode)
    private readonly episodessRepository: Repository<Episode>,
  ) { }

  async setSubtitleTrack(data: SetSubtitleTrackDto): Promise<SubtitleTrack> {
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

    const subtitleTrackFindOptions = generateSubtitleTrackFindOptions(
      {
        imdbid: imdbid,
        mediaKind: data.kind,
      },
      {
        where: {
          m3u8Id: data.m3u8Id,
        },
      },
    );

    const existingSubtitleTrack = await this.getSubtitleTrack(
      subtitleTrackFindOptions,
    );

    if (existingSubtitleTrack) {
      await this.subtitleTracksRepository.update(
        subtitleTrackFindOptions.where as FindOptionsWhere<SubtitleTrack>,
        {
          originalName: data.name,
        },
      );

      return await this.subtitleTracksRepository.findOne(
        subtitleTrackFindOptions,
      );
    }

    const subtitleTrackData = this.subtitleTracksRepository.create({
      name: data.name,
      m3u8Id: data.m3u8Id,
      mediaKind: data.kind,
      originalName: data.name,
    });

    if (data.kind === SubtitleTrackMediaKind.Episode) {
      const episode = await this.episodessRepository.findOne({
        where: {
          imdbid: imdbid,
        },
      });

      if (!episode) throw new NotFoundException('Episode not found');

      subtitleTrackData.episode = episode;
    } else if (data.kind === SubtitleTrackMediaKind.Movie) {
      const movie = await this.moviesRepository.findOne({
        where: {
          imdbid: imdbid,
        },
      });

      if (!movie) throw new NotFoundException('Movie not found');

      subtitleTrackData.movie = movie;
    }

    return await this.subtitleTracksRepository.save(subtitleTrackData);
  }

  async getSubtitleTrack(findOptions: FindOneOptions<SubtitleTrack>) {
    return await this.subtitleTracksRepository.findOne(findOptions);
  }

  async getSubtitleTracksByImdbid(imdbid: string) {
    const movieExists = await this.moviesRepository.exists({
      where: {
        imdbid: imdbid,
      },
    });

    if (movieExists) {
      return await this.subtitleTracksRepository.find({
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
      return await this.subtitleTracksRepository.find({
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

  async toggle(id: string, data: ToggleTrackDto): Promise<SubtitleTrack> {
    const subtitleTrack = await this.subtitleTracksRepository.findOne({
      where: {
        id,
      },
    });

    if (!subtitleTrack) throw new NotFoundException('Subtitle track not found');

    await this.subtitleTracksRepository.update(
      {
        id,
      },
      {
        visible:
          typeof data.visible === 'undefined'
            ? !subtitleTrack.visible
            : data.visible,
      },
    );

    return await this.subtitleTracksRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteTrack(id: string) {
    const subtitleTrack = await this.subtitleTracksRepository.findOne({
      where: {
        id,
      },
    });

    if (!subtitleTrack) throw new NotFoundException('Subtitle track not found');

    await this.subtitleTracksRepository.delete({
      id: subtitleTrack.id,
    });

    return subtitleTrack;
  }

  async rename(
    id: string,
    data: RenameSubtitleTrackDto,
  ): Promise<SubtitleTrack> {
    const subtitleTrack = await this.subtitleTracksRepository.findOne({
      where: {
        id,
      },
    });

    if (!subtitleTrack) throw new NotFoundException('Subtitle track not found');

    await this.subtitleTracksRepository.update(
      {
        id,
      },
      {
        name: data.name,
      },
    );

    return await this.subtitleTracksRepository.findOne({
      where: {
        id,
      },
    });
  }
}
