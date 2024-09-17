import styles from './page.module.scss'
import classNames from 'classnames'
import { ListCard } from './_components/list-card'
import open from "@/assets/images/oppengay.png";

import { HeroBackground, ImageBackground } from '@/components/ui/hero-background'
import { NavTabs } from '@/modules/nav-tabs'
import { PageTitle } from '@/components/page-title'
import { Metadata } from 'next';
import { env } from '@/env';
import { Filters } from '../../(public)/collections/_query-params-context/schema';

type Props = {}

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


const ListsPage = (props: Props) => {


  return (
    <div>
      <HeroBackground className={styles.heroBackground}>
        <ImageBackground className={styles.heroBackgroundImage} alt='Hero' src={open} />
        <div className={styles.heroBackgroundOverlay}></div>
      </HeroBackground>



      <div className={styles.top}>
        <PageTitle className={'container'}>My Lists</PageTitle>
      </div>


      <div className={classNames(styles.content, 'container')}>
        <ListCard type='saved' />
        <ListCard type='watching' />
        <ListCard type='viewed' />
      </div>
    </div>
  )
}

export default ListsPage