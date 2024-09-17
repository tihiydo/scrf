export type QueryFilters = {
  sortBy: 'imdb_rating' | 'by_popularity' | 'by_novelty';
  releaseYear: string;
  endYear: string;
  rating: string;
  genre: string;
  page: string;
  take: string;
  studio: string;
  audio: string;
  subtitles: string;
};
