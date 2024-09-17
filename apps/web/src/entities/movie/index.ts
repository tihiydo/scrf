import { AudioTrack } from "../audio-track";
import { Fiction } from "../fiction";

export type Movie = {
    imdbid: string;
    title: string;
    portraitImage: string;
    description: string;
    fullDescription: string;
    voteCount: number;
    rating: number;
    releaseDate: string;
    releaseYear: number;
    addedAt: string;
    ageRestriction?: number;
    runtime: number;
    previewVideoUrl?: string;
    audioTracks?: AudioTrack[]
    subtitleTracks?: AudioTrack[]
    fiction?: Fiction;
}

export type MinimalMovie = Pick<Movie, 'imdbid' | 'portraitImage' | 'title' | 'rating' | 'releaseDate' | 'releaseYear' | 'ageRestriction' | 'voteCount' | 'runtime' | 'fiction'> 

export type MinimalMovieOptimize = 
{
    imdbid: string,
    portraitImage: string,
    title: string,
    ageRestriction: number,
    rating: number,
    releaseYear: number,
    releaseDate: string,
    runtime: number
    fiction?: Fiction
}