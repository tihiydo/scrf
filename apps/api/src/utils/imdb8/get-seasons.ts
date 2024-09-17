import { imdbApi } from '..';

export async function getSeasons(data: { serialImdb: string }) {
  const seasonsResponse = await imdbApi('title', 'get-seasons', 'v2', {
    tconst: data.serialImdb,
  });

  return seasonsResponse;
}
