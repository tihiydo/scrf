'use client'

import { GetEpisode } from '@/api/requests/serials/episode';
import { encryptAes } from '@/utils';
import { HlsConfig } from 'hls.js';
import styles from './page.module.scss'
import React, { useEffect, useRef, useState } from 'react'
import { AddListFiction } from '@/api/requests/lists/add-fiction';
import { LiveStreamPlayer, SeriePlayer } from '@/modules/video-player';

type Props = {
    params: {
        season: string;
        episode: string;
        slug: string;
    }
}

const cryptedTime = encryptAes(Math.round(Date.now() / 1000), "aeskey");
const backServerUrl = "https://www.scrrenify.icu"
// const backServerUrl = "http://localhost:3004"


const SerialWatchPage = ({ params }: Props) => {
    const playerContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        playerContainerRef.current?.focus()
    })
    const hlsConfigRef = useRef({
        backBufferLength: 90,
        enableWorker: false,
    } satisfies Partial<HlsConfig>)

    const episodeQuery = GetEpisode.useQuery({
        serial: params.slug,
        season: params.season,
        episode: params.episode,
        params: {
            relations: ['season', 'serial']
        }
    })
    const episode = episodeQuery.data;
    const episodeLink = `${backServerUrl}/${encodeURIComponent(cryptedTime)}/serial/${episode?.serial?.imdbid}/${episode?.season?.position}/${episode?.position}/playlist.m3u8`

    const [includedLists, setIncludedLists] = useState<Record<string, boolean>>({})

    const addFictonMutation = AddListFiction.useMutation({
    });

    return (
        <div className={styles.page}>
            {(episodeQuery.isLoading || !episode || !episode.serial) ? (
                <div>
                    loading
                </div>
            ) : (
                <SeriePlayer
                    analytics
                    autorotate
                    containerRef={playerContainerRef}
                    episodeImdbid={episode.imdbid}
                    serialImdbid={episode.serial.imdbid}
                    coverImg={episode.portraitImage}
                    hlsConfig={hlsConfigRef.current}
                    title={`${episode.serial?.title} | ${episode.title}`}
                    src={episodeLink}
                    onTimeChange={(time, { duration }) => {
                        if (!episode.serial || !episode.season || !episode) return;

                        let watchedPercentage = time / duration * 100;
                        if (Number.isNaN(watchedPercentage)) {
                            watchedPercentage = 0;
                        }

                        const isLastEpisodeOfSeason = episode.season.episodesCount === episode.position;
                        const isLastSeasonOfSerie = episode.serial.seasonsCount === episode.season.position;


                        if (
                            watchedPercentage > 90
                            && !includedLists['viewed']
                            && isLastEpisodeOfSeason
                            && isLastSeasonOfSerie
                        ) {
                            setIncludedLists(prev => ({
                                ...prev,
                                viewed: true
                            }))

                            addFictonMutation.mutate({
                                fictionImdbid: episode.serial.imdbid,
                                slug: 'viewed',
                                type: 'serial'
                            })
                        }

                        if (watchedPercentage > 1 && !includedLists['watching']) {
                            setIncludedLists(prev => ({
                                ...prev,
                                watching: true
                            }))

                            addFictonMutation.mutate({
                                fictionImdbid: episode.serial.imdbid,
                                slug: 'watching',
                                type: 'serial'
                            })
                        }
                    }}
                />
            )}

        </div>
    )
}

export default SerialWatchPage