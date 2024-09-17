import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { AudioTrack, AudioTrackKind } from '../entities/audio-track.entity';
import { BadRequestException } from '@nestjs/common';

export function generateAudioTrackFindOptions(
  data: {
    kind: AudioTrackKind;
    imdbid: string;
  },
  findOptions: FindOneOptions<AudioTrack> = {},
): FindOneOptions<AudioTrack> {
  let where: FindOptionsWhere<AudioTrack> = {
    kind: data.kind,
  };

  if (where.kind === AudioTrackKind.Episode) {
    where.episodeId = data.imdbid;
  } else if (where.kind === AudioTrackKind.Movie) {
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

export function validateEpisodeImdbid(imdbid: string) {
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
