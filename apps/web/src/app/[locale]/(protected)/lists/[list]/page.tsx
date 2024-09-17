import GoBackLink from '@/components/go-back-link/go-back-link.component'
import styles from './list-page.module.scss'
import { FictionSwiper } from '@/components/swipers'
import { MinimalMovie } from '@/entities/movie'
import { MinimalSerial } from '@/entities/serial'
import classNames from 'classnames'
import open from "@/assets/images/oppengay.png";
import { HeroBackground, ImageBackground } from '@/components/ui/hero-background'
import { GetList } from '@/api/requests/lists/get-one'
import { headers } from 'next/headers'
import { Metadata } from 'next'
import { env } from '@/env'
import { Filters } from '@/app/[locale]/(public)/collections/_query-params-context/schema'
import { NavTabs } from '@/modules/nav-tabs'
import { BreadCrumbs } from '@/components/ui/bread-crumbs'


export async function generateMetadata(
  { params }: PropsServer
): Promise<Metadata> {
  return {
    title: 'Screenify | Lists',
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

type PropsServer = {
  params: { locale: string }
  searchParams?: Partial<Record<keyof Filters, string>>;
};



type Props = {
  params: {
    list: string
  }
}

const ListPage = async ({ params }: Props) => {
  const response = await GetList.serverFetch(headers, {
    slug: params.list,
  })

  const films: MinimalMovie[] = response.data?.movies ?? [];
  const serials: MinimalSerial[] = response.data?.serials ?? [];

  return (
    <div className={styles.page}>
      <NavTabs className={styles.header} />
      <HeroBackground className={styles.heroBackground}>
        <ImageBackground className={styles.heroBackgroundImage} alt='Hero' src={open} />
        <div className={styles.heroBackgroundOverlay}></div>
      </HeroBackground>
      <div className={classNames('container')}>
        <BreadCrumbs
          className={classNames(styles.breadCrumbs)}
          items={[
            {
              link: '/lists',
              content: 'My lists'
            }
          ]}
        />
        <h1 className={styles.title}>{params.list}</h1>
      </div>


      <div className={styles.content}>
        {films.length ? (
          <div className={classNames(styles.fictions, 'container')}>
            <h2 className={styles.fictionsTitle}>Films</h2>

            <div className={styles.fictionsSwiper}>
              <FictionSwiper fictions={films} />
            </div>
          </div>
        ) : null}

        {serials.length ? (
          <div className={classNames(styles.fictions, 'container')}>
            <h2 className={styles.fictionsTitle}>Serials</h2>

            <div className={styles.fictionsSwiper}>
              <FictionSwiper fictions={serials} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ListPage