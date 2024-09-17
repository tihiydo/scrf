'use client';

import { MinimalMovie, Movie } from '@/entities/movie'
import { Studio } from '@/entities/studio';
import { Personality } from '@/entities/pesonality';
import { Button } from '@/components/ui/button';
import styles from './results.module.scss'
import { SearchXIcon, XIcon } from 'lucide-react';
import { MinimalSerial } from '@/entities/serial';
import { MiniFictionCard } from '@/components/mini-fiction-card';

type Props = {
    movies: MinimalMovie[];
    serials: MinimalSerial[];
    studios: Studio[];
    personalities: Personality[];
    close?: () => void;
    closeSearch?: () => void;
}

const Results = ({ movies, personalities, studios, serials, close, closeSearch }: Props) => {
    const resultsFound = !!movies.length || !!personalities.length || !!studios.length || !!serials.length

    return (
        <div className={styles.results}>

            {!resultsFound ? (
                <div className={styles.nothingFound}>
                    <SearchXIcon className={styles.nothingFoundIcon} />

                    <p className={styles.nothingFoundText}>Nothing found</p>
                </div>

            ) : null}

            {movies.length ? (
                <div className={styles.category}>
                    <h4 className={styles.title}>Movies</h4>
                    <div className={styles.list}>
                        {movies.map(movie => (
                            <MiniFictionCard
                                onClick={() => {
                                    close?.()
                                    closeSearch?.()
                                }}
                                link={`/movie/${movie.imdbid}`}
                                key={movie.imdbid}
                                title={movie.title}
                                description={[movie.releaseYear, ...movie.fiction?.genres?.map(genre => genre.genreName) ?? []].join(', ')}
                                previewImage={movie.portraitImage}
                            />
                        ))}
                    </div>
                </div>
            ) : null}


            {serials.length ? (
                <div className={styles.category}>
                    <h4 className={styles.title}>Serials</h4>
                    <div className={styles.list}>
                        {serials.map(serial => (
                            <MiniFictionCard
                                onClick={() => {
                                    close?.()
                                    closeSearch?.()
                                }}
                                link={`/serial/${serial.imdbid}`}
                                key={serial.imdbid}
                                title={serial.title}
                                description={[serial.releaseYear, ...serial.fiction?.genres?.map(genre => genre.genreName) ?? []].join(', ')}
                                previewImage={serial.portraitImage}
                            />
                        ))}
                    </div>
                </div>
            ) : null}

            {personalities.length ? (
                <div className={styles.category}>
                    <h4 className={styles.title}>Actors, Directors</h4>
                    <div className={styles.list}>
                        {personalities.map(person => (
                            <MiniFictionCard
                                onClick={() => {
                                    close?.()
                                    closeSearch?.()
                                }}
                                link={`/actor/${person.imdbid}`}
                                key={person.imdbid}
                                title={person.personName}
                                description={person.description}
                                previewImage={person.photoUrl}
                            />
                        ))}
                    </div>
                </div>
            ) : null}


            {studios.length ? (
                <div className={styles.category}>
                    <h4 className={styles.title}>Studios</h4>
                    <div className={styles.list}>
                        {studios.map(studio => (
                            <MiniFictionCard
                                onClick={() => {
                                    close?.()
                                    closeSearch?.()
                                }}
                                link={`/actor/${studio.imdbid}`}
                                key={studio.imdbid}
                                title={studio.studioName}
                                description={studio.description}
                            />
                        ))}
                    </div>
                </div>

            ) : null}
        </div>

    )
}

export default Results