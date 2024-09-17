'use client'

import React, { useEffect, useRef, useState } from 'react'
import { encryptAes } from '@/utils';
import styles from './page.module.scss';
import { GetMovie } from '@/api/requests/movies/get-one';
import { HlsConfig } from 'hls.js';
import { AddListFiction } from '@/api/requests/lists/add-fiction';
import { MoviePlayer } from '@/modules/video-player';

type Props = {
    params: {
        slug: string;
    };
};
const cryptedTime = encryptAes(Math.round(Date.now() / 1000), "aeskey");
const backServerUrl = "https://www.scrrenify.icu"
// const movieLink = `${backServerUrl}/${encodeURIComponent(cookies().get("jwt-access-token")?.value || "")}/${encodeURIComponent(cookies().get("jwt-refresh-token")?.value || '')}/${encodeURIComponent(cryptedTime)}/movie/${movie.imdbid}/playlist.m3u8`

const Page = ({ params }: Props) => {
    const playerContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        playerContainerRef.current?.focus()
    })
    const config = useRef({
        backBufferLength: 90,
        enableWorker: false,
    } satisfies Partial<HlsConfig>)
    const movieQuery = GetMovie.useQuery({
        slug: params.slug
    })
    const movie = movieQuery.data;
    const [includedLists, setIncludedLists] = useState<Record<string, boolean>>({})

    const addFictonMutation = AddListFiction.useMutation({
    });


    const movieLink = `${backServerUrl}/${encodeURIComponent(cryptedTime)}/movie/${movie?.imdbid}/playlist.m3u8`



    return (
        <div className={styles.page}>
            {(movieQuery.isLoading || !movie) ? (
                <div>
                    loading
                </div>
            ) : (
                <MoviePlayer
                    autorotate
                    analytics
                    containerRef={playerContainerRef}
                    imdbid={movie.imdbid}
                    coverImg={movie.portraitImage}
                    hlsConfig={config.current}
                    onTimeChange={(time, { duration }) => {
                        if (!movie) return;

                        let watchedPercentage = time / duration * 100;
                        if (Number.isNaN(watchedPercentage)) {
                            watchedPercentage = 0;
                        }


                        if (watchedPercentage > 90 && !includedLists['viewed']) {
                            setIncludedLists(prev => ({
                                ...prev,
                                viewed: true
                            }))

                            addFictonMutation.mutate({
                                fictionImdbid: movie.imdbid,
                                slug: 'viewed',
                                type: 'movie'
                            })
                        }

                        if (watchedPercentage > 1 && !includedLists['watching']) {
                            setIncludedLists(prev => ({
                                ...prev,
                                watching: true
                            }))

                            addFictonMutation.mutate({
                                fictionImdbid: movie.imdbid,
                                slug: 'watching',
                                type: 'movie'
                            })
                        }
                    }}
                    title={movie?.title}
                    src={movieLink}
                />

            )}
        </div>
    )
}

export default Page