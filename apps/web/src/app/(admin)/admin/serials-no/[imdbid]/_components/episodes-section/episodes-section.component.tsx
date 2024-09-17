'use client'
import { Serial } from '@/entities/serial'
import styles from './episodes-section.module.scss'
import classNames from 'classnames';
import { useState } from 'react';
import { Season } from '@/entities/serial/season';
import { useQuery } from '@tanstack/react-query';
import { useSeasonQuery } from '@/api/requests/serials/season/use-season-query';
import { useSeasonEpisodes } from '@/api/requests/serials/season-episodes/use-season-episodes';
import { SeasonSelect } from '@/app/[locale]/(public)/(fiction)/serial/[slug]/_components';
import { Episode } from '../episode';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';

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
        <WrapperBlock>
            <div className={classNames(styles.episodes__header)}>
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
                {episodesQuery.data?.map((episode) => (
                    <Episode episode={episode} season={selectedSeason} serial={serial} />
                ))}
            </div>
        </WrapperBlock>
    )
}

export default EpisodesSection