import { Fiction } from "@/entities/fiction";
import { MinimalMovie, Movie } from "@/entities/movie";
import { MinimalSerial, Serial } from "@/entities/serial";


type GeneralFiction = {
    imdbid: string;
    rating: number;
    title: string;
    portraitImage: string;
    description: string;
    fullDescription?: string;
    voteCount: number;
    releaseDate: string;
    releaseYear: number;
}

export function generalizeFiction(fiction: Fiction): Maybe<GeneralFiction> {
    let generalFiction: Maybe<GeneralFiction> = null

    if (fiction.kind === 'serial' && fiction.serial) {
        generalFiction = {
            imdbid: fiction.serial.imdbid,
            description: fiction.serial.description,
            title: fiction.serial.title,
            rating: fiction.serial.rating,
            voteCount: fiction.serial.voteCount,
            portraitImage: fiction.serial.portraitImage,
            releaseDate: fiction.serial.releaseDate,
            releaseYear: fiction.serial.releaseYear,
            fullDescription: fiction.serial.fullDescription,
        }
    } else if (fiction.kind === 'movie' && fiction.movie) {
        generalFiction = {
            imdbid: fiction.movie.imdbid,
            description: fiction.movie.description,
            title: fiction.movie.title,
            rating: fiction.movie.rating,
            voteCount: fiction.movie.voteCount,
            portraitImage: fiction.movie.portraitImage,
            releaseDate: fiction.movie.releaseDate,
            releaseYear: fiction.movie.releaseYear,
            fullDescription: fiction.movie.fullDescription,
        }
    }

    return generalFiction;
}

export function isSerial(fiction: any): fiction is Serial {
    return (fiction as Serial)?.episodesCount !== undefined;
}

export function isMovie(fiction: any): fiction is Movie {
    return (fiction as Movie)?.runtime !== undefined;
}

export function isFiction(fiction: any): fiction is Fiction {
    const typedFiction = fiction as Fiction;

    return typedFiction?.kind === 'movie' || typedFiction?.kind === 'serial' || !!typedFiction?.slug;
}

type MovieFiction = ReplaceKeys<Fiction, 'movie', { movie: Movie }>
type SerialFiction = ReplaceKeys<Fiction, 'serial', { serial: Serial }>
export function fictionGetter<T extends any>(fiction: Fiction, callbacks: {
    serial?: (serialFiction: SerialFiction) => T,
    movie?: (serialFiction: MovieFiction) => T,
}) {
    if (isMovie(fiction.movie) && fiction.kind === 'movie') {
        return callbacks.movie?.(fiction as MovieFiction)
    }

    if (isSerial(fiction.serial) && fiction.kind === 'serial') {
        return callbacks.serial?.(fiction as SerialFiction)
    }
}