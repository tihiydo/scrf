'use client';

import { FictionSwiper } from "@/components/swipers";
import classNames from "classnames";
import sliderStyles from "@/app/[locale]/(public)/page.module.scss";
import { apiClient } from "@/app/api/client";
import { Movie } from "@/entities/movie";
import { useQuery } from "@tanstack/react-query";
import { SIMILAR_FILMS_QUERY_KEY } from "@/constants/query-keys";
import { MoreFiction } from "@/components/hide-more-fiction";
import { GetSimilarMovies } from "@/api/requests/movies/similar";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";

type Props = {
    movie: Movie;
}

const Similar = ({ movie }: Props) => {

    const similarMoviesQuery = GetSimilarMovies.useQuery({
        imdbid: movie.imdbid
    })


    const movies = similarMoviesQuery.data ?? [];

    const movieSortedByRating = [...movies].sort((a, b) => b.rating - a.rating);
    const movieSortedByRelease = [...movies].sort(
        (a, b) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );
    // console.log(movies)

    return (
        <WrapperBlock
            className={classNames(
                "container",
                sliderStyles.fictionFilms,
            )}
        >
            <h3 className={sliderStyles.fictionTitle}>SIMILAR</h3>

            <FictionSwiper fictions={movies} />

        </WrapperBlock>
    )
}

export default Similar