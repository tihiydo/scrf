import { FindOneOptions } from 'typeorm';
import { getArrayStrings } from '.';
import { Season } from '../entities/seasons.entity';
import { mergeDeep } from 'src/utils';

const relations = ['serial', 'episodes'] as const;
type Relation = (typeof relations)[number];

type ParseQueryResult = {
  expand: boolean;
  includeRelations: Relation[];
};
export function parseGetSeasonQuery(
  query: Record<string, string>,
): ParseQueryResult {
  const expand = typeof query['expand'] === 'string';
  const queryRelations = getArrayStrings(query['relations'], relations);

  return {
    expand,
    includeRelations: queryRelations,
  };
}

export function formSeasonRelations(data: ParseQueryResult) {
  let relations: FindOneOptions<Season>['relations'] = {};

  if (data.expand) {
    relations = {
      episodes: true,
      serial: {
        fiction: {
          genres: true,
          casts: true,
          studios: true,
          directors: true,
          writers: true,
        },
      },
    };
  } else {
    if (data.includeRelations?.includes('serial')) {
      relations = mergeDeep(relations, {
        serial: {
          fiction: {
            genres: true,
            casts: true,
            studios: true,
            directors: true,
            writers: true,
          },
        },
      });
    }

    if (data.includeRelations?.includes('episodes')) {
      relations = mergeDeep(relations, {
        episodes: true,
      });
    }
  }

  return relations;
}
