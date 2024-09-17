import { Serial } from ".";
import { Season } from "./season";

export type Episode = {
    imdbid: string;
    title: string;
    slug: string;
    portraitImage: string;
    description?: string;
    voteCount: number;
    rating?: number;
    releaseDate?: string;
    releaseYear?: number;
    runtime?: number;
    position: number;
    season?: Season;
    serial?: Serial;
}