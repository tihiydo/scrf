'use client'
import { Serial } from '@/entities/serial'
import styles from './episodes-section.module.scss'
import { SeasonSelect } from '../seasons-button';
import { Episode } from '../episode/episode.component';
import classNames from 'classnames';
import { useState } from 'react';
import { Season } from '@/entities/serial/season';
import { useQuery } from '@tanstack/react-query';
import { useSeasonQuery } from '@/api/requests/serials/season/use-season-query';
import { useSeasonEpisodes } from '@/api/requests/serials/season-episodes/use-season-episodes';
type Props = {
    serial: Serial;
}

const EpisodesSection = ({ serial }: Props) => {
    const [selectedSeason, setSelectedSeason] = useState<Season>(serial.seasons?.[0]!);
    const episodesQuery = useSeasonEpisodes({
        serial: serial.imdbid,
        season: selectedSeason?.position,
    })



    return (
        <section className={classNames(styles.episodes)}>
            <div className={classNames(styles.episodes__header, 'container')}>
                <h2>episodes</h2>
                <SeasonSelect
                    selectedSeason={selectedSeason}
                    seasons={serial.seasons ?? []}
                    onChange={(season) => {
                        setSelectedSeason(season)
                    }}
                />
            </div>
            <div className={styles.episodes__list}>
                {episodesQuery.data?.map((episode, i) => (
                    <Episode episode={episode} season={selectedSeason} serial={serial} key={i} />
                ))}
            </div>
        </section>
    )
}

export default EpisodesSection