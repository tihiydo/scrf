import GoBackLink from "@/components/go-back-link/go-back-link.component";
import styles from "./page.module.scss";
import classNames from "classnames";
import {
  HeroBackground,
  ImageBackground,
} from "@/components/ui/hero-background";
import { MainSection } from "./_components/main-section";
import { InfoSection } from "./_components/info-section";
import { CastSection } from "./_components/cast";
import { Similar } from "./_components/similar";
import { apiServer } from "@/app/api/server";
import { headers } from "next/headers";
import { Movie } from "@/entities/movie";
import { TrailerBtn } from "./_components/trailer-btn";
import { StudioSection } from "../../_components/studio-section";
import { WatchBtn } from "../../_components/watch-btn";
import { notFound } from "next/navigation";
import { env } from '@/env'
import { Metadata } from 'next'
import { GetMovie } from "@/api/requests/movies/get-one";
import { BreadCrumbs } from "@/components/ui/bread-crumbs";
import { truncateText } from "@/utils";

type Props = {
  params: {
    slug: string;
    locale: string;
  };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  try {
    const movieResponse = await GetMovie.serverFetch(headers, {
      slug: params.slug,
    })

    const movie = movieResponse.data;

    console.log(movieResponse.data, 'test')

    return {
      title: movie?.title ? `Screenify | Movie | ${movie.title}` : 'Screenify | Movie',
      description: movie?.fullDescription ?? movie?.description ?? 'Movie description not available',
      openGraph: {
        title: `Screenify | Movie | ${movie.title}`,
        description: movie.fullDescription ?? movie.description,
        images: [
          {
            url: movie.portraitImage ?? `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
            alt: 'Screenify - Your Ultimate Streaming Destination',
          },
        ],
        url: env.NEXT_PUBLIC_SITE_URL + `${params.locale}` + '/movie' + `/${movie.imdbid}`,
        siteName: 'Screenify',
        type: 'website',
      },
    }
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return {
      title: 'Movie Not Found',
      description: 'Unable to load movie information',
    };
  }
}



const MoviePage = async ({ params: { slug } }: Props) => {


  try {
    const response = await apiServer(headers).get<Movie>(`/movies/${slug}`)
    const movie = response.data;

    return (
      <div>
        <HeroBackground>
          <ImageBackground loading="eager" unoptimized src={movie?.portraitImage} alt="Background" />
        </HeroBackground>

        <div className={classNames('container', styles.topSection)}>
          <BreadCrumbs
            className={classNames(styles.breadCrumbs)}
            items={[
              {
                link: '/',
                content: 'Home'
              },
              {
                link: '/categories/films',
                content: 'Movies'
              }
            ]}
          />

          <h1 className={styles.title}>{movie?.title}</h1>
          {/* <h2 className={styles.secondaryTitle}>{movie?.title}</h2> */}
          {/* <p>{movie.description}</p> */}
          <p className={styles.infoText}>
            {movie?.fiction?.genres
              ?.map((genre: { genreName: any }) => genre.genreName)
              .join(", ")}{" "}
            - {Math.round(movie?.runtime / 60)} minutes {movie.fiction?.studios?.length ? ` - ${movie.fiction.studios.slice(0, 3).map(std => std.studioName).join(', ')}` : null}
          </p>
          <div className={styles.actions}>
            <WatchBtn

              link={`/movie/${movie?.imdbid}/watch`} />

            <TrailerBtn />
          </div>

        </div>
        <div className={styles.sections}>
          <MainSection movie={movie} />

          <InfoSection movie={movie} slug={slug} />

          {movie?.fiction?.casts?.length ? (
            <CastSection cast={movie?.fiction?.casts ?? []} />
          ) : null}

          {/* {movie?.fiction?.studios?.[0] ? (
            <StudioSection studio={movie?.fiction.studios[0]} />
          ) : null} */}

          {movie?.fiction?.casts?.length ? (
            <Similar movie={movie} />
          ) : null}
        </div>
      </div>
    );
  }
  catch {
    notFound()
  }
};

export default MoviePage;
