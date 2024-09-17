import { Fiction } from "../fiction";
import { Episode } from "./episode";
import { Season } from "./season";

// Experimental
type Args = DeepPartial<{
    relations: {
        seasons: boolean;
        episodes: boolean;
        fiction: boolean
    }
}>
export type Serial<TArgs extends Args = {}> = {
    imdbid: string;
    title: string;
    description: string;
    fullDescription?: string;
    portraitImage: string;
    voteCount: number;
    rating: number;
    ageRestriction: number;
    releaseDate: string;
    releaseYear: number;
    endYear?: number;
    seasonsCount: number;
    episodesCount: number;
    addedAt: string;
    updatedAt: string;
    seasons?: Season[]
    episodes?: Episode[]
} & ConditionalRequired<{ fiction: Fiction }, TArgs['relations'] extends { fiction: true } ? true : false>
    & ConditionalRequired<{ seasons: Season[] }, TArgs['relations'] extends { seasons: true } ? true : false>
    & ConditionalRequired<{ episodes: Episode[] }, TArgs['relations'] extends { episodes: true } ? true : false>;



export type MinimalSerial = Pick<Serial, 'imdbid' | 'portraitImage' | 'title' | 'rating' | 'endYear' | 'releaseDate' | 'releaseYear' | 'ageRestriction' | 'episodesCount' | 'seasonsCount' | 'voteCount' | 'fiction'>