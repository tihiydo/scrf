import classNames from "classnames";
import { PlanCard } from "@/components/plan-card";
import { VideoSwiper } from "@/modules/video-swiper";
import styles from "./page.module.scss";
import { SerialsSection } from "./_components/serials-section";
import { MoviesSection } from "./_components/movies-section";
import { unstable_setRequestLocale } from "next-intl/server";
import TopStudios from "./_components/top-studios/top-studios.component";
import MockUp from "./_components/mockup-section/mockup-section.components";
import { CollectionsSection } from "./_components/collections-section";
import { Metadata } from "next";
import { env } from "@/env";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { NavTabs } from "../../../modules/nav-tabs";
import { MobileSearch } from "@/modules/mobile-search";
import { PageTitle } from "@/components/page-title";
import { Hero } from "@/components/ui/hero";
import { useMediaQuery } from "@uidotdev/usehooks";


type Props = {
  params: { locale: string };
};


export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  return {
    title: 'Screenify | Home',
    description: 'Discover a world of entertainment at your fingertips with Screenify. Whether you\'re a fan of blockbuster movies, binge-worthy series, or live sports action, Screenify has it all. Our platform brings you an extensive library of the latest and greatest in entertainment, tailored to suit every taste.',
    openGraph: {
      title: 'Screenify | Home',
      description: 'Discover a world of entertainment at your fingertips with Screenify. Whether you\'re a fan of blockbuster movies, binge-worthy series, or live sports action, Screenify has it all. Our platform brings you an extensive library of the latest and greatest in entertainment, tailored to suit every taste.',
      images: [
        {
          url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
          alt: 'Screenify - Your Ultimate Streaming Destination',
        },
      ],
      url: env.NEXT_PUBLIC_SITE_URL + '/',
      siteName: 'Screenify',
      type: 'website',
    },
  }
}



const MainPage = ({ params }: Props) => {
  unstable_setRequestLocale(params.locale)

  return (
    <div className={styles.page}>
      <NavTabs />

      <div className="container">
        <VideoSwiper page="Home" />
      </div>

      <TopStudios />

      {/* <PageTitle className={'container'} bottomSpacing>Main</PageTitle> */}

      <MoviesSection />

      <SerialsSection />

      <CollectionsSection />

      <MockUp />


      <WrapperBlock className={classNames('container', styles.fictionMargin, styles.plans)}>
        <PlanCard plan="base" className={styles.plansItem} canFree={false} />
        <PlanCard plan="middle" className={styles.plansItem} canFree={false} />
        <PlanCard plan="pro" className={styles.plansItem} canFree={false} />
      </WrapperBlock>


    </div >
  );
};

export default MainPage;
