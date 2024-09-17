import { AntdRegistry } from "@ant-design/nextjs-registry";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { fontsVariables } from "@/fonts";
import { ConfigProvider } from "antd";
import { themeConfig } from "@/theme.config";
import ReactQueryProvider from "@/components/providers/react-query.provider";
import SessionProvider from "@/session/session.provider";
import getRequestConfig from "@/i18n";
import { PortalRoot } from "@/components/portal";
import Script from "next/script";

type Props = {
    children: React.ReactNode;
    params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props) {
    const title = locale === "en" ? "Screenify" : "Скриніфай";
    return {
        title,
    };
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: Props) {
    const { messages } = await getRequestConfig({ locale });
    unstable_setRequestLocale(locale);

    return (
        <html lang={locale} >
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="theme-color" content="#000000" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </head>
            <body className={fontsVariables}>

                <ReactQueryProvider>
                    <SessionProvider>
                        <NextIntlClientProvider
                            locale={locale}
                            messages={messages}
                        >
                            <ConfigProvider
                                theme={themeConfig}
                            >
                                <AntdRegistry>
                                    {children}

                                    <PortalRoot id="video-player" />
                                </AntdRegistry>
                            </ConfigProvider>
                        </NextIntlClientProvider>
                    </SessionProvider>
                </ReactQueryProvider>

                {/* <Script
                    strategy="afterInteractive"
                    src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
                /> */}


            </body>
        </html>
    );
}
