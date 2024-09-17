import { imdbApi } from '..';

export async function getRatings(data: { imdbid: string }) {
  const response = await imdbApi('title', 'get-ratings', 'v2', {
    tconst: data.imdbid,
  });

  return response;
}
