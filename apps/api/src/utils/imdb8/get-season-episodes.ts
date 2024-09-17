import { imdbApi } from '..';

export async function getSeasonEpisodes(data: {
  serialImdbid: string;
  season: number;
}) {
  const episodesResponse = await imdbApi(
    'title',
    'get-episodes-by-season',
    'v2',
    {
      tconst: data.serialImdbid,
      season: data.season,
    },
  );

  return episodesResponse;
}
