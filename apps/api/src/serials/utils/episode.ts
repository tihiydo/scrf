import { FindOneOptions, FindOptionsRelations } from 'typeorm';
import { getArrayStrings } from '.';
import { Season } from '../entities/seasons.entity';
import { mergeDeep } from 'src/utils';
import { Episode } from '../entities/episodes.entity';

const relations = ['serial', 'season'] as const;
type Relation = (typeof relations)[number];

type ParseQueryResult = {
  expand: boolean;
  includeRelations: Relation[];
};
export function parseGetEpisodeQuery(
  query: Record<string, string>,
): ParseQueryResult {
  const expand = typeof query['expand'] === 'string';
  const queryRelations = getArrayStrings(query['relations'], relations);

  return {
    expand,
    includeRelations: queryRelations,
  };
}

export function formEpisodeRelations(data: ParseQueryResult) {
  let relations: FindOptionsRelations<Episode> = {};

  if (data.expand) {
    relations = {
      season: true,
      serial: {
        fiction: {
          genres: true,
        },
      },
    };
  } else {
    if (data.includeRelations?.includes('serial')) {
      relations = mergeDeep(relations, {
        serial: {
          fiction: {
            genres: true,
          },
        },
      });
    }

    if (data.includeRelations?.includes('season')) {
      relations = mergeDeep(relations, {
        season: true,
      });
    }
  }

  return relations;
}
