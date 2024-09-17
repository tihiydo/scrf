import { imdbApi } from '..';

export async function getPlots(data: { imdbid: string }) {
  const response = await imdbApi('title', 'get-plots', 'v2', {
    first: 1,
    tconst: data.imdbid,
  });

  return response;
}
