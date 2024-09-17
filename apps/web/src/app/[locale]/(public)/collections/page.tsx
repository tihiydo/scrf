import { VideoSwiper } from '@/modules/video-swiper'
import classNames from 'classnames'
import styles from './page.module.scss'
import { Collection } from '@/components/collection'
import CollectionsPagination from './_components/pagination/pagination.component'
import { Filters } from './_query-params-context/schema'
import CollectionsContextProvider from './_query-params-context/collections-context-provider.component'
import { GetManyCollections } from '@/api/requests/collections/get-many'
import { headers } from 'next/headers'
import { SearchParametersSerializer } from '@/hooks/use-typesafe-search-params/utils'
import { SearchXIcon } from 'lucide-react'

import { env } from '@/env'
import { Metadata } from 'next'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'
import { NavTabs } from '@/modules/nav-tabs'
import { PageTitle } from '@/components/page-title'
import { Hero } from '@/components/ui/hero'

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    return {
        title: 'Screenify | Collections',
        description: 'Browse our curated collections of serials and films, designed to bring you themed entertainment experiences. Whether it’s a collection of award-winning dramas, a bundle of superhero adventures, or a mix of classic serials and modern hits, these collections make it easy to find content that matches your mood or occasion. Perfect for a weekend marathon or discovering new favorites.',
        openGraph: {
            title: 'Screenify | Collections',
            description: 'Browse our curated collections of serials and films, designed to bring you themed entertainment experiences. Whether it’s a collection of award-winning dramas, a bundle of superhero adventures, or a mix of classic serials and modern hits, these collections make it easy to find content that matches your mood or occasion. Perfect for a weekend marathon or discovering new favorites.',
            images: {
                url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
                alt: 'Screenify - Your Ultimate Streaming Destination',
            },
            url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/collections',
            siteName: 'Screenify'
        },
    }
}

type Props = {
    params: { locale: string }
    searchParams?: Partial<Record<keyof Filters, string>>;
};
const TAKE_ITEMS = 10;

const CollectionsPage = async ({ searchParams }: Props) => {
    const response = await GetManyCollections.serverFetch(headers, {
        params: {
            limit: TAKE_ITEMS,
            page: SearchParametersSerializer.deserialize(searchParams?.page)
        }
    })

    
    const data = response.data;
    data.collections.forEach(col => {
        col.collectionFictions.forEach(colFic => {
            console.log('col fic', colFic)
        })
    })

    // console.log('colections', data.collections)

    return (
        <CollectionsContextProvider>
            <div className={styles.page}>
                <NavTabs />


                <div className="container">
                    <VideoSwiper page="Collections" />
                </div>


                <PageTitle className='container' itemsCount={data.total} bottomSpacing >
                    Collections
                </PageTitle>

                <WrapperBlock className={classNames(styles.content, 'container')}>
                    <div className={styles.collections}>
                        {data.collections.length ? (
                            data.collections.map(collection => (
                                <Collection key={collection.id} collection={collection} />
                            ))
                        ) : (
                            <div className={styles.noData}>
                                <SearchXIcon className={styles.noDataIcon} />

                                <p className={styles.noDataText}>No Collections Found</p>
                            </div>
                        )}

                    </div>

                    <CollectionsPagination pages={Math.ceil(data.total / TAKE_ITEMS)} />
                </WrapperBlock>
            </div>
        </CollectionsContextProvider>

    )
}

export default CollectionsPage