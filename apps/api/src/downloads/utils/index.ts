import slugify from 'slugify';
import { imdbApi, removeDuplicates } from 'src/utils';

export async function parseStudios(imdbid: string) {
  const getStudioResponse = await imdbApi(
    'title',
    'get-company-credits',
    null,
    {
      tconst: imdbid,
    },
  );
  const studios = [];

  getStudioResponse.categories.forEach((category) => {
    // Check if the category is related to production companies
    if (
      category.id === 'production' ||
      category.name.toLowerCase() === 'production companies'
    ) {
      // Iterate over items in the section
      category.section.items.forEach((item) => {
        if (item.id !== null) {
          // Append the required information to the result array
          studios.push({ imdbid: item.id, studioName: item.rowTitle });
        }
      });
    }
  });

  return removeDuplicates(studios, 'imdbid');
}

export async function parseGenres(imdbid: string) {
  const getGenresResponse = await imdbApi('title', 'get-genres', 'v2', {
    tconst: imdbid,
  });

  const genres = getGenresResponse.data.title.titleGenres.genres.map(
    ({ genre }) => ({
      slug: slugify(genre.genreId, {
        replacement: '-',
        remove: undefined,
        lower: true,
        locale: 'en',
      }),
      genreName: genre.text,
    }),
  );

  return removeDuplicates(genres, 'slug') as any[];
}

type Person = {
  type: 'actor' | 'writer' | 'director';
  name: string;
  description?: string;
  characterNames?: string[];
  id: string;
  portraitImage: string;
};

export async function parseCrew(imdbid: string, extendedDetails: any) {
  const casts = (
    (await imdbApi('title', 'get-top-cast-and-crew', 'v2', {
      tconst: imdbid,
    })) as Root
  ).data.title;

  const cast: Person[] = [];

  for (const edge of casts.credits.edges) {
    const node = edge.node;
    const bioResponse = await imdbApi('actors', 'get-bio', 'v2', {
      nconst: node.name.id,
    });
    const bio = bioResponse?.data?.name?.bio?.text?.plainText;

    const person: Person = {
      description: bio,
      characterNames: node?.characters?.map((character) => {
        return character.name;
      }),
      type: 'actor',
      name: node?.name?.nameText?.text,
      portraitImage: node?.name?.primaryImage?.url,
      id: node?.name?.id,
    };

    cast.push(person);
  }

  const getFromExtendDetailsCreditsByType = async (
    type: 'director' | 'writer',
  ): Promise<Person[]> => {
    const filteredCredits =
      extendedDetails?.data?.title?.credits?.edges?.filter((edge: any) => {
        const position = edge?.node?.category?.id;

        return position === type;
      });

    const crew: Person[] = [];

    for (const edge of filteredCredits) {
      const bioResponse = await imdbApi('actors', 'get-bio', 'v2', {
        nconst: edge?.node?.name?.id,
      });
      const bio = bioResponse?.data?.name?.bio?.text?.plainText;

      const person: Person = {
        name: edge?.node?.name?.nameText?.text,
        id: edge?.node?.name?.id,
        type: type,
        description: bio,
        portraitImage: edge?.node?.name?.primaryImage?.url,
      };

      crew.push(person);
    }

    return crew;
  };

  const crew = {
    cast: removeDuplicates(cast, 'id'),
    writers: removeDuplicates(
      await getFromExtendDetailsCreditsByType('writer'),
      'id',
    ),
    directors: removeDuplicates(
      await getFromExtendDetailsCreditsByType('director'),
      'id',
    ),
  };

  return crew;
}

export interface Root {
  data: Data;
}

export interface Data {
  title: Title;
}

export interface Title {
  credits: Credits;
}

export interface Credits {
  pageInfo: PageInfo;
  total: number;
  edges: Edge[];
}

export interface PageInfo {
  __typename: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface Edge {
  node: Node;
}

export interface Node {
  __typename: string;
  category: Category;
  name: Name;
  title: Title2;
  attributes: any;
  characters: Character[];
  episodeCredits: EpisodeCredits;
}

export interface Category {
  id: string;
  text: string;
}

export interface Name {
  __typename: string;
  id: string;
  nameText: NameText;
  primaryImage: PrimaryImage;
}

export interface NameText {
  text: string;
}

export interface PrimaryImage {
  __typename: string;
  id: string;
  url: string;
  height: number;
  width: number;
}

export interface Title2 {
  __typename: string;
  id: string;
  titleText: TitleText;
  originalTitleText: OriginalTitleText;
  releaseYear: ReleaseYear;
  releaseDate: ReleaseDate;
  titleType: TitleType;
  primaryImage: PrimaryImage2;
}

export interface TitleText {
  text: string;
  isOriginalTitle: boolean;
}

export interface OriginalTitleText {
  text: string;
  isOriginalTitle: boolean;
}

export interface ReleaseYear {
  __typename: string;
  year: number;
  endYear: number;
}

export interface ReleaseDate {
  __typename: string;
  month: number;
  day: number;
  year: number;
  country: Country;
  restriction: any;
  attributes: any[];
  displayableProperty: DisplayableProperty;
}

export interface Country {
  id: string;
}

export interface DisplayableProperty {
  qualifiersInMarkdownList: any;
}

export interface TitleType {
  __typename: string;
  id: string;
  text: string;
  categories: Category2[];
  canHaveEpisodes: boolean;
  isEpisode: boolean;
  isSeries: boolean;
  displayableProperty: DisplayableProperty2;
}

export interface Category2 {
  id: string;
  text: string;
  value: string;
}

export interface DisplayableProperty2 {
  value: Value;
}

export interface Value {
  plainText: string;
}

export interface PrimaryImage2 {
  __typename: string;
  id: string;
  url: string;
  height: number;
  width: number;
}

export interface Character {
  name: string;
}

export interface EpisodeCredits {
  yearRange: YearRange;
  total: number;
}

export interface YearRange {
  __typename: string;
  year: number;
  endYear?: number;
}
