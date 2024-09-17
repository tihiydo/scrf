import { z } from "zod";

const SortBySchema = z.enum(['imdb_rating', 'by_novelty', 'by_popularity']).default('imdb_rating');
const GenreSchema = z.string().optional();
const RatingSchema = z.number().optional();
const ReleaseYearSchema = z.number().optional();
const PageSchema = z.number().default(1);
const AudioTrackSchema = z.string().optional();
const SubtitlesSchema = z.string().optional();
const StudioSchema = z.string().optional();

export const FiltersSchema = {
    sortBy: SortBySchema,
    genre: GenreSchema,
    rating: RatingSchema,
    releaseYear: ReleaseYearSchema,
    page: PageSchema,
    audio: AudioTrackSchema,
    subtitles: SubtitlesSchema,
    studio: StudioSchema
}
export type Filters = {
    [K in keyof typeof FiltersSchema]?: z.infer<typeof FiltersSchema[K]>
};

