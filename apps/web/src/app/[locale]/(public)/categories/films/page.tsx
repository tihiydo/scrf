import { FictionSwiper } from "@/components/swipers";
import styles from "../category-page.module.scss";
import classNames from "classnames";
import { VideoSwiper } from "@/modules/video-swiper";
import { SearchXIcon } from "lucide-react";
import { headers } from 'next/headers';
import { FictionCard } from "@/components/swiper-cards/fiction-card";
import CategoryFilters from "./_components/films-filters.component";
import { MoviesLibrary } from "@/api/requests/movies/library";
import MoviesPagination from "./_components/pagination/pagination.component";
import FiltersContextProvider from "./query-context/filters-context-provider.component";
import { Filters } from "./query-context/schema";
import { SearchParametersSerializer } from "@/hooks/use-typesafe-search-params/utils";
import { MoviesGrid } from "./_components/movies-grid";

import { Metadata } from "next";
import { env } from "@/env";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { NavTabs } from "@/modules/nav-tabs";
import { PageTitle } from "@/components/page-title";
import { Hero } from "@/components/ui/hero";
import { MinimalMovieOptimize } from "@/entities/movie";
import { apiServer } from "@/app/api/server";


export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: 'Screenify | Movies',
    description: 'Explore our extensive catalog of movies, featuring the latest blockbusters, timeless classics, and hidden gems. Whether you\'re in the mood for heart-pounding action, spine-tingling horror, or a heartwarming drama, our collection has something for every film lover. Dive into a world of cinematic storytelling and enjoy movies from around the globe, all in one place.',
    openGraph: {
      title: 'Screenify | Movies',
      description: 'Explore our extensive catalog of movies, featuring the latest blockbusters, timeless classics, and hidden gems. Whether you\'re in the mood for heart-pounding action, spine-tingling horror, or a heartwarming drama, our collection has something for every film lover. Dive into a world of cinematic storytelling and enjoy movies from around the globe, all in one place.',
      images: {
        url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
        alt: 'Screenify - Your Ultimate Streaming Destination',
      },
      url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/categories/films',
      siteName: 'Screenify'
    },
  }
}

type Props = {
  searchParams?: Partial<Record<keyof Filters, string>>;
  params: { locale: string }
};
const TAKE_ITEMS = 20;
const FilmsCategoryPage = async ({ searchParams }: Props) => {
  const genreParam = SearchParametersSerializer.deserialize(searchParams?.genre);
  const pageParam = SearchParametersSerializer.deserialize(searchParams?.page);
  const ratingParam = SearchParametersSerializer.deserialize(searchParams?.rating);
  const yearParam = SearchParametersSerializer.deserialize(searchParams?.releaseYear);
  const sortBy = SearchParametersSerializer.deserialize(searchParams?.sortBy);
  const audioParam = SearchParametersSerializer.deserialize(searchParams?.audio);
  const subtitlesParam = SearchParametersSerializer.deserialize(searchParams?.subtitles);
  const studio = SearchParametersSerializer.deserialize(searchParams?.studio);

  const moviesNewResponse = (await apiServer(headers).get<
  (MinimalMovieOptimize & { trandRating?: number })[]
>('/movies/new')).data;

const moviesPopularResponse = (await apiServer(headers).get<
  (MinimalMovieOptimize & { trandRating?: number })[]
>('/movies/popular')).data

const moviesRandomResponse = (await apiServer(headers).get<
(MinimalMovieOptimize & { trandRating?: number })[]
>('/movies/random')).data

  const response = await MoviesLibrary.serverFetch(headers, {
    params: {
      take: TAKE_ITEMS,
      genre: genreParam === 'all' ? undefined : genreParam,
      page: pageParam === 'all' ? undefined : pageParam,
      rating: ratingParam === 'all' ? undefined : ratingParam,
      year: yearParam === 'all' ? undefined : yearParam,
      sortBy: sortBy === 'all' ? undefined : sortBy,
      audio: audioParam === 'all' ? undefined : audioParam,
      subtitles: subtitlesParam === 'all' ? undefined : subtitlesParam,
      studio: studio === 'all' ? undefined : studio,
    }
  })


  const pagesCount = Math.ceil(response.data.total / TAKE_ITEMS)

  const isFilterApplied = Object.values(searchParams ?? {}).some((v) => v);
  const movies = response.data.movies;

  const moviesWithTrandRating = moviesRandomResponse
    .map((el) => {
      const getWeightByTime = (releaseDateUnix: number, maxDays = 365) => {
        const currentTimeUnix = Date.now() / 1000;

        const elapsedDays =
          (currentTimeUnix - releaseDateUnix) / (60 * 60 * 24);

        let weight;
        if (elapsedDays >= maxDays) {
          weight = 0;
        } else {
          weight = 1 - elapsedDays / maxDays;
        }
        return weight + 0.5;
      };

      const weightByTime = getWeightByTime(
        new Date(el.releaseDate).getTime() / 1000
      );
      el.trandRating = weightByTime * el.rating;
      return el;
    })
    .sort(
      (a, b) =>
        (b.trandRating ? b.trandRating : 0) -
        (a.trandRating ? a.trandRating : 0)
    );

  // Используем метод slice для создания копий массивов перед сортировкой
  const movieSortedByRating = [...moviesPopularResponse].sort((a, b) => b.rating - a.rating);
  const movieSortedByRelease = [...moviesNewResponse].sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  return (
    <FiltersContextProvider response={response.data}>
      <div className={styles.page}>
        <NavTabs />

        <div className="container">
          <VideoSwiper page="FilmsCat" />
        </div>

        <div className={classNames(styles.topContent)}>
          <div className={classNames(styles.menu)}>
            <PageTitle className={classNames(styles.title, "container")} bottomSpacing itemsCount={response.data.total}>Movies</PageTitle>

            <CategoryFilters className={classNames(styles.filters, 'container')} />
          </div>
        </div>
        {isFilterApplied ? (
          movies.length ? (
            <div className={classNames(styles.grid, "container")}>
              <MoviesGrid movies={movies} />

              <MoviesPagination
                pages={pagesCount}
              />
            </div>
          ) : (
            <div className={styles.noData}>
              <SearchXIcon className={styles.noDataIcon} />

              <p className={styles.noDataText}>No Films Found</p>
            </div>
          )
        ) : (
          <WrapperBlock className={classNames("container", styles.content)}>
            <div className={styles.contentTag}>
              <h4 className={styles.contentTagTitle}>Popular</h4>
              <FictionSwiper fictions={movieSortedByRating} />
            </div>

            <div className={styles.contentTag}>
              <h4 className={styles.contentTagTitle}>New</h4>
              <FictionSwiper fictions={movieSortedByRelease} />
            </div>

            <div className={styles.contentTag}>
              <h4 className={styles.contentTagTitle}>Trand</h4>
              <FictionSwiper fictions={moviesWithTrandRating} />
            </div>
          </WrapperBlock>
        )}
      </div>
    </FiltersContextProvider >

  );
};

export default FilmsCategoryPage;
