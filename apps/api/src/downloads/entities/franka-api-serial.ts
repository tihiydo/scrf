export interface ResponseMovieFromSerial {
    data: Daum[]
    shows_count: number
    page: number
    pages: number
  }
  
  export interface Daum {
    indexid: string
    imdb: string
    name: string
    original_name: string
    release_year: string
    release_date: string
    endYear: string
    runtime: string
    runtime_min: string
    description: string
    director: any
    rating: string
    voteCount: string
    cast: string
    storyline: string
    origin_image: string
    image: string
    full_image: string
    horizontalImage: any
    writers: any
    countries_of_origin: string
    language: string
    also_known_as: string
    filming_locations: string
    production_companies: string
    sound_mix: string
    aspect_ratio: any
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
    movie_cast: MovieCast[]
    movie_production_company: MovieProductionCompany[]
    seasons: Season[]
  }
  
  export interface MovieCast {
    indexid: string
    cast_name: string
    cast_photo: string
    character_name: string
    cast_imdbid?: string
  }
  
  export interface MovieProductionCompany {
    indexid: string
    company_name?: string
    company_imdbid?: string
    creator_name?: string
    creator_imdbid?: string
  }
  
  export interface Season {
    season_position: string
    episodes: Episode[]
  }
  
  export interface Episode {
    indexid: string
    imdb: string
    name: string
    original_name: string
    release_year: string
    release_date: string
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
    writers: string
    countries_of_origin: string
    language: string
    also_known_as?: string
    filming_locations: string
    production_companies: string
    sound_mix: string
    aspect_ratio?: string
    color: string
    camera?: string
    laboratory: string
    cinematographic_process: any
    printed_film_format: string
    mpa: any
    taglines: any
    negative_format: string
    all_photos: any
    movie_id: string
    season: string
    episodeNumber: string
  }
  