

import styles from './page.module.scss'
import CollectionContextProvider from './_query-params-context/collection-context-provider.component';
import { CollectionQueryParams } from './_query-params-context/schema';
import CollectionPagination from './_components/pagination/pagination.component';
import classNames from 'classnames';
import { CollectionGrid } from './_components/grid';
import { SearchXIcon } from 'lucide-react';
import { HeroBackground, ImageBackground } from '@/components/ui/hero-background';
import open from "@/assets/images/oppengay.png";
import openMobile from "@/assets/images/open-mob.png";
import { BreadCrumbs } from '@/components/ui/bread-crumbs';
import { headers } from 'next/headers';
import { SearchParametersSerializer } from '@/hooks/use-typesafe-search-params/utils';
import { GetOneCollection } from '@/api/requests/collections/get-one';
import { env } from '@/env'
import { Metadata } from 'next'

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const collectionResponse = await GetOneCollection.serverFetch(headers, {
        slug: params.collection,
        params: {
            limit: 1,
            page: 1
        }
    })

    const collection = collectionResponse.data.collection;

    return {
        title: `Screenify | Collection | ${collection.name}`,
        description: collection.description,
        openGraph: {
            title: `Screenify | Collection | ${collection.name}`,
            description: collection.description,
            images: {
                url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
                alt: 'Screenify - Your Ultimate Streaming Destination',
            },
            url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/collections' + `/${collection.slug}`,
            siteName: 'Screenify'
        },
    }
}

type Props = {
    params: {
        collection: string;
        locale: string;
    }
    searchParams?: Partial<Record<keyof CollectionQueryParams, string>>;
}

const TAKE_ITEMS = 20;

const CollectionPage = async ({ params, searchParams }: Props) => {
    const response = await GetOneCollection.serverFetch(headers, {
        slug: params.collection,
        params: {
            limit: TAKE_ITEMS,
            page: SearchParametersSerializer.deserialize(searchParams?.page)
        }
    })

    const collection = response.data.collection;

    const fictions = response.data.collection.collectionFictions
        .map(cf => cf.fiction)
        .filter(fic => fic != null)

    return (
        <CollectionContextProvider>
            <HeroBackground className={classNames(styles.heroBackground, styles.heroBackgroundDesktop)}>
                <ImageBackground className={styles.heroBackgroundImage} alt='Hero' src={open} />
                <div className={styles.heroBackgroundOverlay}></div>
            </HeroBackground>

            <HeroBackground className={classNames(styles.heroBackground, styles.heroBackgroundMobile)}>
                <ImageBackground className={styles.heroBackgroundImage} alt='Hero' src={openMobile} />
                <div className={styles.heroBackgroundOverlay}></div>
            </HeroBackground>

            <div className={styles.page}>
                <BreadCrumbs
                    className={classNames('container', styles.breadCrumbs)}
                    items={[
                        {
                            link: '/',
                            content: 'Home'
                        },
                        {
                            link: '/collections',
                            content: 'Collections'
                        }
                    ]}
                />

                <div className={classNames(styles.header, 'container')}>
                    <h1 className={styles.title}>{collection.name}</h1>

                    {collection.description ? (
                        <p className={styles.description}>{collection.description}</p>
                    ) : null}
                </div>


                <div className={classNames(styles.content, 'container')}>
                    {fictions !== undefined ? (
                        <CollectionGrid fictions={fictions} />
                    ) : (
                        <div className={styles.noData}>
                            <SearchXIcon className={styles.noDataIcon} />

                            <p className={styles.noDataText}>No Movies or Serials Found</p>
                        </div>
                    )}

                </div>

                <div className='container'>
                    <CollectionPagination pages={Math.ceil(response.data.total / TAKE_ITEMS)} />
                </div>
            </div>
        </CollectionContextProvider>

    )
}

export default CollectionPage