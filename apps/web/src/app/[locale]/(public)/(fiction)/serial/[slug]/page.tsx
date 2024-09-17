import classNames from "classnames";

import {
  HeroBackground,
  ImageBackground,
} from "@/components/ui/hero-background";
import styles from "./page.module.scss";
import { MainSection } from "./_components/main-section";
import { InfoSection } from "./_components/info-section";
import { CastSection } from "./_components/cast-section";
import { Similar } from "./_components/similar-section";
import { apiServer } from "@/app/api/server";
import { headers } from "next/headers";
import { GetOneSerial } from "@/api/requests/serials/get-one-serial";
import { EpisodesSection } from "./_components/episodes-section";
import { TrailerBtn } from "./_components/trailer-btn";
import { WatchBtn } from "../../_components/watch-btn";
import { notFound } from "next/navigation";
import { env } from '@/env'
import { Metadata } from 'next'
import { BreadCrumbs } from "@/components/ui/bread-crumbs";

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const response = await apiServer(headers).get<GetOneSerial.ResponseData>(GetOneSerial.url(params.slug))
  const serial = response.data;

  return {
    title: `Screenify | Serial | ${serial.title}`,
    description: serial.fullDescription ?? serial.description,
    openGraph: {
      title: `Screenify | Serial | ${serial.title}`,
      description: serial.fullDescription ?? serial.description,
      images: [
        {
          url: serial.portraitImage ?? `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
          alt: 'Screenify - Your Ultimate Streaming Destination',
        }
      ],
      url: env.NEXT_PUBLIC_SITE_URL + `${params.locale}` + '/serial' + `/${serial.imdbid}`,
      siteName: 'Screenify',
      type: 'website',
    },
  }
}

type Props = {
  params: {
    slug: string;
    locale: string;
  };
};


const SerialPage = async ({ params: { slug } }: Props) => {
  try {
    const response = await apiServer(headers).get<GetOneSerial.ResponseData>(GetOneSerial.url(slug))
    const serial = response.data;

    return (
      <div className={styles.paddings}>
        <div className={styles.shortFilmInfo}>
          <HeroBackground>
            <ImageBackground src={serial.portraitImage} alt="Background" />
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
                  link: '/categories/serials',
                  content: 'Serials'
                }
              ]}
            />
            <h1 className={styles.title}>{serial?.title}</h1>
            {/* <h2 className={styles.secondaryTitle}>{serial?.title}</h2> */}
            <p className={styles.infoText}>
              {serial?.fiction?.genres
                ?.map((genre: { genreName: any }) => genre.genreName)
                .join(", ")}{" "}
              - {serial.seasonsCount} seasons {serial.fiction?.studios?.length ? ` - ${serial.fiction.studios.slice(0, 3).map(std => std.studioName).join(', ')}` : null}
            </p>
            <div className={styles.actions}>
              <WatchBtn link={`/serial/${serial?.imdbid}/1/1/watch`} />

              <TrailerBtn />
            </div>

          </div>
        </div>

        <div className={styles.movieBlocks}>
          <MainSection serial={serial} />
          <EpisodesSection serial={serial} />

          <InfoSection serial={serial} slug={slug} />

          {Array.isArray(serial.fiction?.casts) && serial.fiction.casts.length > 0 ? (
            <CastSection cast={serial.fiction.casts} />
          ) : null}

          {/* {serial.fiction?.studios?.[0] ? (
            <StudioSection studio={serial.fiction.studios[0]} />
          ) : null} */}


          <Similar serial={serial} />
        </div>
      </div>
    );
  }
  catch {
    notFound();
  }
}
export default SerialPage;
