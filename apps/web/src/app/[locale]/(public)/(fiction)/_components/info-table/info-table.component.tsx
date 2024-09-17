'use client'

import { Movie } from '@/entities/movie'
import { Serial } from '@/entities/serial'
import styles from './info-table.module.scss';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

type Props = {
    fiction: (Serial | Movie);
    collections: string
}



const InfoTable = ({ fiction, collections }: Props) => {

    const formatString = (str: string) => {
        return str
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
    };

    const router = useRouter()

    console.log(collections)

    return (
        <div className={styles.table}>

            {collections ? (
                <>
                    <div className={styles.tableItem}>
                        <div className={styles.tableItemPropertyName}>
                            Included in the lists:
                        </div>
                        <div className={styles.tableItemPropertyValue}>
                            <span
                                key={1}
                                className={styles.actorName}
                                onClick={() => router.push(`/collections/${formatString(collections)}`)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {collections}
                            </span>
                        </div>
                    </div>

                    <div className={styles.tableSeparator}></div>
                </>
            ) : (
                null
            )}

            <div className={styles.tableItem}>
                <div className={styles.tableItemPropertyName}>Year</div>
                <div className={styles.tableItemPropertyValue}>
                    {fiction?.releaseYear ?? 'No info'}
                </div>
            </div>


            <div className={styles.tableSeparator}></div>

            <div className={styles.tableItem}>
                <div className={styles.tableItemPropertyName}>IMDb Rating</div>
                <div className={styles.tableItemPropertyValue}>
                    {fiction?.rating ?? 'No info'}
                </div>
            </div>

            <div className={styles.tableSeparator}></div>

            <div className={styles.tableItem}>
                <div className={styles.tableItemPropertyName}>Country</div>
                <div className={styles.tableItemPropertyValue}>No info</div>
            </div>

            <div className={styles.tableSeparator}></div>

            <div className={styles.tableItem}>
                <div className={styles.tableItemPropertyName}>Genre</div>
                <div className={styles.tableItemPropertyValue}>
                    {fiction?.fiction?.genres?.map(genre => genre.genreName).join(', ') || 'No info'}
                </div>
            </div>

            <div className={styles.tableSeparator}></div>

            <div className={styles.tableItem}>
                <div className={styles.tableItemPropertyName}>Director</div>
                <div className={classNames(styles.tableItemPropertyValue, styles.tableItemCastProperty)}>
                    {fiction?.fiction?.directors?.map((director) => director.personName).join(", ") || 'No info'}
                </div>
            </div>

            <div className={styles.tableSeparator}></div>

            {fiction.fiction?.casts?.length !== 0 ? (
                <div className={styles.tableItem}>
                    <div className={styles.tableItemPropertyName}>Cast</div>
                    <div className={classNames(styles.tableItemPropertyValue, styles.tableItemCastProperty)}>
                        {/* {fiction?.fiction?.casts?.map((casts) => casts.personName).join(", ") ?? ''} */}
                        {fiction?.fiction?.casts?.map(cast => (
                            <span
                                key={cast.imdbid}
                                className={styles.actorName}
                                onClick={() => router.push(`/actor/${cast.imdbid}`)}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {cast.personName}
                                {', '}
                            </span>
                        )) ?? 'No cast available'}
                    </div>

                </div>
            ) : (null)
            }
            <div className={styles.tableSeparator}></div>


            <div className={styles.tableItem}>
                <div className={styles.tableItemPropertyName}>Age</div>
                <div className={styles.tableItemPropertyValue}>
                    {fiction?.ageRestriction ? `${fiction?.ageRestriction}+` : 'No info'}
                </div>
            </div>
            <div className={styles.tableSeparator}></div>
        </div>

    )
}

export default InfoTable