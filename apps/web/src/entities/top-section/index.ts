import { Movie } from "../movie";


export const TopSectionPage = {
    Home: 'Home',
    FilmsCat: 'FilmsCat',
    SerialsCat: 'SerialsCat',
    Collections: 'Collections',
} as const;
export type TopSectionPage = ObjectValues<typeof TopSectionPage>;

export type TopSection = {
    id: string;
    page: TopSectionPage;
    movies: Movie[]
}