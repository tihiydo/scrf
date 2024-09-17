import "swiper/css";
import { env } from '@/env';
import { Metadata } from 'next';
import PlayerClient from "./_components/player-client";
import { NavTabs } from "@/modules/nav-tabs";

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: 'Screenify | Sport Matches',
    description: 'Catch all the excitement of live sports with Screenify. From the biggest international tournaments to your favorite local matches, our sports catalog brings you the action as it happens. Watch live or catch up on-demand with replays and highlights. Whether it\'s football, basketball, tennis, or any other sport, you\'ll never miss a moment of the action with Screenify.',
    openGraph: {
      title: 'Screenify | Sport Matches',
      description: 'Catch all the excitement of live sports with Screenify. From the biggest international tournaments to your favorite local matches, our sports catalog brings you the action as it happens. Watch live or catch up on-demand with replays and highlights. Whether it\'s football, basketball, tennis, or any other sport, you\'ll never miss a moment of the action with Screenify.',
      images: {
        url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
        alt: 'Screenify - Your Ultimate Streaming Destination',
      },
      url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/sport',
      siteName: 'Screenify'
    },
  }
}

type Props = {
  params: { locale: string }
}

const Page = (props: Props) => {
  return (
    <div>
      {/* <TopSection/> */}
      <NavTabs />


      <div className='container'>
        <PlayerClient />
      </div>
    </div>
  )
}

export default Page