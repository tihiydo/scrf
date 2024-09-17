import { FictionSwiper } from "@/components/swipers";
import styles from "../category-page.module.scss";
import classNames from "classnames";
import { VideoSwiper } from "@/modules/video-swiper";
import { SearchXIcon } from "lucide-react";
import { headers } from 'next/headers';
import CategoryFilters from "./_components/serial-filters.component";
import { SerialsLibrary } from "@/api/requests/serials/library";
import { TAKE_ITEMS } from "./constants";
import FiltersContextProvider from "./_query-params/filters-context-provider.component";
import { SerialsPagination } from "./_components/pagination";
import { Filters } from "./_query-params/schema";
import { SearchParametersSerializer } from "@/hooks/use-typesafe-search-params/utils";
import { SerialsGrid } from "./_components/serials-grid";
import { Metadata } from "next";
import { env } from "@/env";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { NavTabs } from "@/modules/nav-tabs";
import { PageTitle } from "@/components/page-title";
import { Hero } from "@/components/ui/hero";


export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: 'Screenify | Serials',
    description: 'Discover a diverse range of serials that will keep you hooked from episode to episode. From thrilling dramas and epic fantasies to light-hearted comedies and thought-provoking documentaries, our catalog of serials offers endless entertainment for every taste. Whether you\'re looking to binge-watch an entire series or savor each episode, you\'ll find the perfect show to immerse yourself in.',
    openGraph: {
      title: 'Screenify | Serials',
      description: 'Discover a diverse range of serials that will keep you hooked from episode to episode. From thrilling dramas and epic fantasies to light-hearted comedies and thought-provoking documentaries, our catalog of serials offers endless entertainment for every taste. Whether you\'re looking to binge-watch an entire series or savor each episode, you\'ll find the perfect show to immerse yourself in.',
      images: {
        url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
        alt: 'Screenify - Your Ultimate Streaming Destination',
      },
      url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/categories/serials',
      siteName: 'Screenify'
    },
  }
}

type Props = {
  searchParams: Partial<Record<keyof Filters, string>>;
  params: { locale: string }
};

const SerialsCategoryPage = async ({ searchParams }: Props) => {
  const response = await SerialsLibrary.serverFetch(headers, {
    params: {
      take: TAKE_ITEMS,
      releaseYear: SearchParametersSerializer.deserialize(searchParams.releaseYear),
      genre: SearchParametersSerializer.deserialize(searchParams.genre),
      sortBy: SearchParametersSerializer.deserialize(searchParams.sortBy),
      rating: SearchParametersSerializer.deserialize(searchParams.rating),
      page: SearchParametersSerializer.deserialize(searchParams.page),
      audio: SearchParametersSerializer.deserialize(searchParams?.audio),
      subtitles: SearchParametersSerializer.deserialize(searchParams?.subtitles),
      studio: SearchParametersSerializer.deserialize(searchParams?.studio),
    }
  })

  const pagesCount = Math.ceil(response.data.total / TAKE_ITEMS)

  const isFilterApplied = Object.values(searchParams ?? {}).some((v) => v);
  const serials = response.data.serials;

  // const moviesWithTrandRating = movies
  //   .map((el) => {
  //     const getWeightByTime = (releaseDateUnix: number, maxDays = 365) => {
  //       const currentTimeUnix = Date.now() / 1000;

  //       const elapsedDays =
  //         (currentTimeUnix - releaseDateUnix) / (60 * 60 * 24);

  //       let weight;
  //       if (elapsedDays >= maxDays) {
  //         weight = 0;
  //       } else {
  //         weight = 1 - elapsedDays / maxDays;
  //       }
  //       return weight + 0.5;
  //     };

  //     const weightByTime = getWeightByTime(
  //       new Date(el.releaseDate).getTime() / 1000
  //     );
  //     el.trandRating = weightByTime * el.rating;
  //     return el;
  //   })
  //   .sort(
  //     (a, b) =>
  //       (b.trandRating ? b.trandRating : 0) -
  //       (a.trandRating ? a.trandRating : 0)
  //   );

  // Используем метод slice для создания копий массивов перед сортировкой
  const serialsSortedByRating = [...serials].sort((a, b) => b.rating - a.rating);
  const serialsSortedByRelease = [...serials].sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  return (
    <FiltersContextProvider response={response.data}>
      <div className={styles.page}>
        <NavTabs />
        <div className="container">
          <VideoSwiper page="SerialsCat" />
        </div>



        <div className={classNames(styles.topContent)}>
          <div className={classNames(styles.menu)}>
            <PageTitle className={"container"} bottomSpacing itemsCount={response.data.total}>Serials</PageTitle>

            <CategoryFilters className={`${styles.filters} container`} />
          </div>
        </div >
        {
          isFilterApplied ? (
            serials.length ? (
              <div className={classNames(styles.grid, "container")}>
                <SerialsGrid serials={serials} />

                <SerialsPagination
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
                <FictionSwiper fictions={serialsSortedByRating} />
              </div>

              <div className={styles.contentTag}>
                <h4 className={styles.contentTagTitle}>New</h4>
                <FictionSwiper fictions={serialsSortedByRelease} />
              </div>

              {/* <div className={styles.contentTag}>
              <h4 className={styles.contentTagTitle}>Trand</h4>
              <FictionSwiper fictions={moviesWithTrandRating} />
            </div> */}
            </WrapperBlock>
          )}
      </div >
    </FiltersContextProvider >

  );
};

export default SerialsCategoryPage;
