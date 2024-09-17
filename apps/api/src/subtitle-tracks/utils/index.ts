import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import {
  SubtitleTrack,
  SubtitleTrackMediaKind,
} from '../entities/subtitle-track.entity';
import { BadRequestException } from '@nestjs/common';

export function generateSubtitleTrackFindOptions(
  data: {
    mediaKind: SubtitleTrackMediaKind;
    imdbid: string;
  },
  findOptions: FindOneOptions<SubtitleTrack> = {},
): FindOneOptions<SubtitleTrack> {
  let where: FindOptionsWhere<SubtitleTrack> = {
    mediaKind: data.mediaKind,
  };

  if (where.mediaKind === SubtitleTrackMediaKind.Episode) {
    where.episodeId = data.imdbid;
  } else if (where.mediaKind === SubtitleTrackMediaKind.Movie) {
    where.movieId = data.imdbid;
  }

  where = {
    ...(findOptions.where ?? {}),
    ...where,
  };

  return {
    ...findOptions,
    where,
  };
}

export function parseEpisodeImdbid(imdbid: string) {
  const splitedEpisodePath = imdbid.split('/');
  const season = Number(splitedEpisodePath[1]);
  const epsiode = Number(splitedEpisodePath[2]);

  if (
    splitedEpisodePath.length !== 3 ||
    Number.isNaN(season) ||
    Number.isNaN(epsiode)
  ) {
    throw new BadRequestException(
      'Invalid imdbid for episode. Should be imdbid/<season position>/<episode position>',
    );
  }

  return {
    serialImdbid: splitedEpisodePath[0],
    seasonPosition: season,
    episodePosition: epsiode,
  };
}
