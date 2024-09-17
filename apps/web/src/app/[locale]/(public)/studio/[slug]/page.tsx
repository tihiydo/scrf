import React from "react";
import classes from "./page.module.scss";
import GoBackLink from "@/components/go-back-link/go-back-link.component";
import Image from "next/image";
import {
    HeroBackground,
    ImageBackground,
} from "@/components/ui/hero-background";
import open from "@/assets/images/oppengay.png";
import { apiServer } from "@/app/api/server";
import { headers } from 'next/headers';
import screenifyFallback from '@/assets/images/fallback.png'
import classNames from "classnames";
import { PictureFallback, PictureImage, PictureRoot } from "@/components/ui/picture";

import { env } from '@/env'
import { Metadata } from 'next'
import { Personality } from "@/entities/pesonality";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { GetSimilarSerials } from "@/api/requests/serials/similar";
import { FictionSwiper } from "@/components/swipers";
import { styleText } from "util";
import { MinimalMovie } from "@/entities/movie";
import { MinimalSerial } from "@/entities/serial";
import { MoreFiction } from "@/components/hide-more-fiction";

type FictionItem = any;


// export async function generateMetadata(
//     { params }: Props
// ): Promise<Metadata> {
//     const api = apiServer(headers)
//     const actorResponse = await api<Personality>(`/studios/${params.slug}`);
//     const studios = actorResponse.data;

//     return {
//         title: `Screenify | Studio | ${studios.personName}`,
//         description: studios.description,
//         openGraph: {
//             title: `Screenify | Studio | ${studios.personName}`,
//             description: studios.description,
//             images: {
//                 url: studios.photoUrl ?? `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
//                 alt: 'Screenify - Your Ultimate Streaming Destination',
//             },
//             url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/stuio' + `/${studios.imdbid}`,
//             siteName: 'Screenify'
//         },
//     }
// }

type Props = {
    params: {
        slug: string;
        locale: string;
    };
};

const StudioPage = async ({ params: { slug } }: Props) => {


    const api = apiServer(headers)
    const { data: info } = await api(`/studios/${slug}`);
    console.log('12')
    console.log(info.studiosFictions)


    const fictions: FictionItem[] = info.studiosFictions.map(({ movie }: { movie: MinimalMovie }) => {
        if (!movie) return null;

        return {
            imdbid: movie.imdbid,
            title: movie.title,
            portraitImage: movie.portraitImage,
            rating: movie.rating,
            releaseDate: movie.releaseDate,
            releaseYear: movie.releaseYear,
            runtime: movie.runtime,
            type: 'movie'
        };
    }).filter(Boolean);


    const fictionsSerial: FictionItem[] = info.studiosFictions.map(({ serial }: { serial: MinimalSerial }) => {
        if (!serial) return null;

        return {
            imdbid: serial.imdbid,
            title: serial.title,
            portraitImage: serial.portraitImage,
            rating: serial.rating,
            releaseDate: serial.releaseDate,
            releaseYear: serial.releaseYear,
            episodesCount: serial.episodesCount,
            runtime: null,
            type: 'serial'
        };
    }).filter(Boolean);

    return (
        <div className={classNames(classes.paddings)}>
            <HeroBackground>
                <ImageBackground src={open} fill alt="hero image" />
            </HeroBackground>
            <div className={classNames(classes.about, 'container')}>
                <GoBackLink />
                <h1>{info?.studioName}</h1>
            </div>

            <WrapperBlock className={classNames(classes.actorCard, 'container')}>
                <div className={classes.firstBlockActorInfo}>
                    <PictureRoot>
                        <PictureImage
                            src={info?.photoUrl}
                            width={600}
                            height={540}
                            alt=""
                        />

                        <PictureFallback>
                            <Image
                                src={screenifyFallback}
                                width={600}
                                height={540}
                                alt=""
                            />
                        </PictureFallback>
                    </PictureRoot>
                </div>
                <div className={classes.secondBlockActorInfo}>
                    <h2>ABOUT</h2>
                    <div>
                        <div className={classes.pseudoTable}>
                            <div>
                                <h3>COUNTRY:</h3>
                                <p>No data</p>
                            </div>
                            <div>
                                <h3>AGE:</h3>
                                <p>No data</p>
                            </div>
                        </div>
                        <div className={classes.textBlock}>{info?.description}</div>
                    </div>
                </div>
            </WrapperBlock>

            {
                fictions.length !== 0 ? (
                    <WrapperBlock className={classNames('container', classes.swiper)}>
                        <div className={classes.item} key={classes.title}>
                            <h5 className={classes.itemTitle}>MOVIE</h5>
                            <FictionSwiper fictions={fictions} />
                        </div>
                    </WrapperBlock>
                ) : (
                    null
                )
            }

            {
                fictionsSerial.length !== 0 ? (
                    <WrapperBlock className={classNames('container', classes.swiper)}>
                        <div className={classes.item} key={classes.title}>
                            <h5 className={classes.itemTitle}>SERIAL</h5>
                            <FictionSwiper fictions={fictionsSerial} />
                        </div>
                    </WrapperBlock>
                ) : (
                    null
                )
            }
        </div>
    );
};

export default StudioPage;