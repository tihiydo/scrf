import { Link } from '@/i18n/navigation';
import { ChevronRightIcon } from 'lucide-react';
import styles from './collection.module.scss'
import { FictionSwiper } from '../swipers';
import { type Collection as CollectionType } from '@/entities/collection';

type Props = {
    collection: CollectionType;
}

const Collection = ({ collection }: Props) => {
    return (
        <div className={styles.collection}>
            <div className={styles.header}>
                <h3 className={styles.headerTitle}>{collection.name}</h3>
                <Link href={`/collections/${collection.slug}`} className={styles.link}>
                    <p className={styles.linkText}>
                        view more
                    </p>

                    <ChevronRightIcon className={styles.linkIcon} />
                </Link>

            </div>

            <div>
                <FictionSwiper
                    fictions={collection.collectionFictions
                        .map(collectionFiction => collectionFiction.fiction)
                        .filter(colFic => colFic != null)}
                />
            </div>
        </div>
    )
}

export default Collection