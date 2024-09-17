import dune from '@/assets/images/dune-img.png'
import { Movie } from '@/entities/movie'

export const swiperConst: Movie[] =
    [
        {
            imdbid: 'imdbid',
            runtime: 60 * 60 + 60 * 42,
            addedAt: new Date().toString(),
            releaseDate: new Date().toString(),
            releaseYear: 2024,
            description: 'description',
            fullDescription: 'fullDescription',
            title: 'title',
            voteCount: 123,
            portraitImage: dune.src,
            rating: 8.3,
            fiction: {
                id: '1',
                kind: 'movie',
                checked: true,

                genres: [
                    {
                        genreName: 'Comedy',
                        id: '1',
                        slug: 'comedy'
                    }
                ],

                slug: 'comedydy',

            }
        },
        {
            imdbid: 'imdbid',
            runtime: 60 * 60 + 60 * 42,
            addedAt: new Date().toString(),
            releaseDate: new Date().toString(),
            releaseYear: 2024,
            description: 'description',
            fullDescription: 'fullDescription',
            title: 'title',
            voteCount: 123,
            portraitImage: dune.src,
            rating: 8.3,
            fiction: {
                id: '1',
                kind: 'movie',
                checked: true,
                genres: [
                    {
                        genreName: 'Comedy',
                        id: '1',
                        slug: 'comedy'
                    }
                ],

                slug: 'comedydy',

            }
        },
    ]