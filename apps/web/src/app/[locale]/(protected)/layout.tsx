import React from "react";
import { Footer } from "../_modules/footer";
import styles from "./layout.module.scss";
import TopAppBar from "../_modules/top-app-bar/top-app-bar.component";
import TextLogo from "@/components/ui/text-logo/text-logo.component";
import { getServerUser } from "@/session/api";
import { redirect } from "next/navigation";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { MobileSearch } from "@/modules/mobile-search";
import { Metadata } from "next";
import { env } from "@/env";
import { Filters } from "../(public)/collections/_query-params-context/schema";

type PropsChildren = {
  children: React.ReactNode;
};


export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  return {
    title: 'Screenify | Account',
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
};


const ProtectedLayout = async ({ children }: PropsChildren) => {
  const user = await getServerUser();

  if (user?.role !== "Admin" && !user?.verified) {
    redirect("/");
  }

  if (user?.isBanned) {
    redirect("/banned");
  }

  return (
    <div className={styles.wrapper}>
      <TopAppBar />

      <main className={styles.content}>{children}</main>

      <Footer className={styles.footer} />
      <TextLogo className={styles.textLogo} />
      <BottomNavBar className={styles.bottomBar} />
      <MobileSearch />
    </div>
  );
};

export default ProtectedLayout;
