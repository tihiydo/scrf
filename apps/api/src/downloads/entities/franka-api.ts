export type BadResponseMovieFromApi = {
    status: string,
    message: string
}

export type ResponseMovieFromApi = {
    data: Daum[]
    shows_count: number
    page: number
    pages: number
}

export type MovieApiResponse = BadResponseMovieFromApi | ResponseMovieFromApi

  export interface Daum {
    indexid: string
    imdb: string
    name: string
    original_name: string
    release_year: string
    release_date: string
    endYear: any
    runtime: string
    runtime_min: string
    description: string
    director: string
    rating: string
    voteCount: string
    cast: string
    storyline: string
    origin_image: string
    image: string
    full_image: string
    horizontalImage: any
    writers: string
    countries_of_origin: string
    language: string
    also_known_as: string
    filming_locations: string
    production_companies: string
    sound_mix: string
    aspect_ratio: string
    color: string
    camera: string
    laboratory: string
    cinematographic_process: string
    printed_film_format: string
    mpa: string
    taglines: string
    negative_format: string
    all_photos: any
    is_serial: string
    genres: Genre[]
    movie_cast: MovieCast[]
    movie_directors: MovieDirector[]
    movie_writers: MovieWriter[]
    movie_production_company: MovieProductionCompany[]
  }
  
  export interface Genre {
    indexid: string
    genre_name: string
  }
  
  export interface MovieCast {
    indexid: string
    cast_name: string
    cast_photo: string
    character_name: string
    cast_imdbid?: string
  }
  
  export interface MovieDirector {
    indexid: string
    director_name: string
    director_photo: string
    director_imdbid: string
  }
  
  export interface MovieWriter {
    indexid: string
    writer_name: string
    writer_photo: string
    writer_imdbid: string
  }
  
  export interface MovieProductionCompany {
    indexid: string
    company_name: string
    company_imdbid: string
  }
  