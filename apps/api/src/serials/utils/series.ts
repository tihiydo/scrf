import { FindOptionsRelations, FindOptionsSelect } from 'typeorm';
import { Serial } from '../entities/serials.entity';
import { mergeDeep } from 'src/utils';
import { getArrayStrings } from '.';

const relations = ['seasons', 'episodes', 'fiction'] as const;
type Relation = (typeof relations)[number];

type ParseQueryResult = {
  expand: boolean;
  includeRelations: Relation[];
};

export function parseGetSerieQuery(
  query: Record<string, string>,
): ParseQueryResult {
  const expand = typeof query['expand'] === 'string';
  const queryRelations = getArrayStrings(query['relations'], relations);

  return {
    expand,
    includeRelations: queryRelations,
  };
}

export function formSerieQuery(data: ParseQueryResult) {
  let relations: FindOptionsRelations<Serial> = {};
  let select: FindOptionsSelect<Serial> = {};

  if (data.expand) {
    relations = {
      fiction: {
        genres: true,
        casts: true,
        writers: true,
        directors: true,
        studios: true,
      },
      seasons: {
        episodes: true,
      },
    };

    select = {
      fiction: {
        id: true,
        casts: {
          personName: true,
          imdbid: true,
          photoUrl: true,
        },
        writers: {
          personName: true,
          imdbid: true,
          photoUrl: true,
        },
        directors: {
          personName: true,
          imdbid: true,
          photoUrl: true,
        },
      },
    };
  } else {
    if (data.includeRelations?.includes('seasons')) {
      relations = mergeDeep(relations, {
        seasons: true,
      });
    }

    if (data.includeRelations?.includes('episodes')) {
      relations = mergeDeep(relations, {
        seasons: {
          episodes: true,
        },
      });
    }

    if (data.includeRelations?.includes('fiction')) {
      relations = mergeDeep(relations, {
        fiction: {
          genres: true,
          casts: true,
          writers: true,
          directors: true,
          studios: true,
        },
      });

      select = {
        fiction: {
          id: true,
          casts: {
            personName: true,
            imdbid: true,
            photoUrl: true,
          },
          writers: {
            personName: true,
            imdbid: true,
            photoUrl: true,
          },
          directors: {
            personName: true,
            imdbid: true,
            photoUrl: true,
          },
        },
      };
    }
  }

  return { relations, select };
}
