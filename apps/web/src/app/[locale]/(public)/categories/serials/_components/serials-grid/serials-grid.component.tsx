'use client'
import { FictionCard, FictionSkeletonCard } from '@/components/swiper-cards/fiction-card'
import styles from './serials-grid.module.scss'
import { useFiltersContext } from '../../_query-params/use-filters-contenxt'
import { MinimalSerial } from '@/entities/serial'

type Props = {
    serials: MinimalSerial[]
}

const MoviesGrid = ({ serials }: Props) => {
    const { isSynced } = useFiltersContext();

    return (
        <div className={styles.grid}>
            {isSynced ? (
                serials.map((movie) => (
                    <FictionCard
                        className={styles.card}
                        type='serial'
                        fiction={movie}
                        key={movie.imdbid}
                    />
                ))
            ) : (
                Array(12).fill(null).map((_, index) => (
                    <FictionSkeletonCard key={index} />
                ))
            )}
        </div>
    )
}

export default MoviesGrid