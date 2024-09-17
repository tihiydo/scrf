'use client'
import { FictionCard, FictionSkeletonCard } from '@/components/swiper-cards/fiction-card'
import styles from './movies-grid.module.scss'
import { MinimalMovie } from '@/entities/movie'
import { useFiltersContext } from '../../query-context/use-filters-contenxt'

type Props = {
    movies: MinimalMovie[]
}

const MoviesGrid = ({ movies }: Props) => {
    const { isSynced } = useFiltersContext();
    return (
        <div className={styles.grid}>
            {isSynced ? (
                movies.map((movie) => (
                    <FictionCard
                        className={styles.card}
                        type='movie'
                        fiction={movie}
                        key={movie.imdbid}
                    />
                ))
            ) : (
                Array(12).fill(null).map((_,index) => (
                    <FictionSkeletonCard key={index} />
                ))
            )}
        </div>
    )
}

export default MoviesGrid