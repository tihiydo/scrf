'use client'
import { FictionCard, FictionSkeletonCard } from '@/components/swiper-cards/fiction-card'
import styles from './movies-grid.module.scss'
import { useCollectionQueryParamsContext } from '../../_query-params-context/use-collection-params-contenxt'
import { Fiction } from '@/entities/fiction'

type Props = {
    fictions: Fiction[]
}

const CollectionGrid = ({ fictions }: Props) => {
    const { isSynced } = useCollectionQueryParamsContext();

    return (
        <div className={styles.grid}>
            {isSynced ? (
                fictions.map((fiction) => (
                    <FictionCard
                        className={styles.card}
                        type='fiction'
                        fiction={fiction}
                        key={fiction.id}
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

export default CollectionGrid