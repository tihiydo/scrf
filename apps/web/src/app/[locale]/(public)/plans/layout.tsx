import { env } from '@/env';
import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';


export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    return {
        title: 'Screenify | Plans',
        description: 'Choose from our flexible subscription plans tailored to fit your viewing habits. Whether you\'re a casual viewer or a dedicated binge-watcher, we have a plan that suits your needs. Enjoy unlimited access to our vast library of movies, serials, and live sports, with options for HD and 4K streaming, multiple devices, and family sharing. Start your journey with Screenify today and experience entertainment like never before.',
        openGraph: {
            title: 'Screenify | Plans',
            description: 'Choose from our flexible subscription plans tailored to fit your viewing habits. Whether you\'re a casual viewer or a dedicated binge-watcher, we have a plan that suits your needs. Enjoy unlimited access to our vast library of movies, serials, and live sports, with options for HD and 4K streaming, multiple devices, and family sharing. Start your journey with Screenify today and experience entertainment like never before.',
            images: {
                url: `${env.NEXT_PUBLIC_SITE_URL}/og-logo.png`,
                alt: 'Screenify - Your Ultimate Streaming Destination',
            },
            url: env.NEXT_PUBLIC_SITE_URL + `/${params.locale}` + '/plans',
            siteName: 'Screenify'
        },
    }
}

type Props = {
    children: React.ReactNode;
    params: { locale: string }
}

const PlansLayout = ({ children, params }: Props) => {
    unstable_setRequestLocale(params.locale);

    return children;
}

export default PlansLayout