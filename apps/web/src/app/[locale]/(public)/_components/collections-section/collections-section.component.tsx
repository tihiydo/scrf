import classNames from 'classnames';
import styles from './collection-section.module.scss'
import { Link } from '@/i18n/navigation';
import { Collection } from '@/components/collection';
import { GetManyCollections } from '@/api/requests/collections/get-many';
import { MoreFictionAccrodion } from '@/components/more-fiction-accordion';
import { headers } from 'next/headers';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';

type Props = {
    className?: string;
}

const CollectionsSection = async ({ className }: Props) => {
    const collectionsResponse = await GetManyCollections.serverFetch(headers, {
        params: {
            limit: 4
        }
    })

    const firstCollection = collectionsResponse.data?.collections?.[0];
    const accordionCollections = collectionsResponse.data?.collections.slice(1) ?? [];

    if (!firstCollection) return null;

    return (
        <WrapperBlock className={classNames('container', styles.section)}>
            <section>
                <h3
                    className={styles.title}
                >
                    <Link href={"/collections"} className={styles.titleLink}>
                        Collections
                    </Link>
                </h3>

                <div className={styles.content}>
                    <Collection collection={firstCollection} />

                    {accordionCollections.length ? (
                        <MoreFictionAccrodion>
                            <div className={styles.more}>
                                {accordionCollections.map(c => (
                                    <Collection key={c.id} collection={c} />
                                ))}
                            </div>
                        </MoreFictionAccrodion>
                    ) : null}
                </div>
            </section>
        </WrapperBlock >

    )
}

export default CollectionsSection