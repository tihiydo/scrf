import { imdbApi } from '..';

export async function getExtendDetails(data: { imdbid: string }) {
  const response = await imdbApi('title', 'get-extend-details', 'v2', {
    tconst: data.imdbid,
  });

  return response;
}
