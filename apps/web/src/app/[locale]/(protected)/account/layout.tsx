"use client";

import { useEffect, useMemo } from "react";
import open from "@/assets/images/oppengay.png";
import { LeftOutlined } from "@ant-design/icons";
import {
  ProfileIcon,
  SettingsIcon,
  SubscriptionIcon,
} from "@/components/icons";

import GoBackLink from "@/components/go-back-link/go-back-link.component";
import {
  HeroBackground,
  ImageBackground,
} from "@/components/ui/hero-background";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useResize } from "@/hooks/use-resize";
import { sessionStore } from "@/session/session.store";

import styles from "./layout.module.scss";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { AccountNavbar } from "./_components/navbar";
import { BreadCrumbs } from "@/components/ui/bread-crumbs";



const SIDEBAR_ITEMS = [
  {
    icon: <ProfileIcon />,
    title: "profile",
    href: "/account/profile",
  },
  {
    icon: <SubscriptionIcon />,
    title: "subscription",
    href: "/account/subscription",
  },
  {
    icon: <SettingsIcon />,
    title: "settings",
    href: "/account/settings",
  },
];

const AccountLayout = observer(({ children }: any) => {
  const pathname = usePathname();
  const { screenWidth } = useResize();
  const router = useRouter();

  const getBackLabel = useMemo(() => {
    const parts = pathname.split("/");
    if (pathname.includes("change-password")) {
      return "settings";
    }

    return parts[parts.length - 1];
  }, [pathname]);

  const isLabelInSidebar = SIDEBAR_ITEMS.some((item) => pathname.includes(item.title))


  const isSidebarShown = (screenWidth <= 1200 && !isLabelInSidebar) || screenWidth > 1200


  useEffect(() => {
    if (!isLabelInSidebar && screenWidth > 1200) {
      router.push("/account/profile");
    }
  }, [isLabelInSidebar, screenWidth]);

  useEffect(() => {
    if (pathname === localStorage.getItem("nextAuthRoute")) {
      localStorage.removeItem("nextAuthRoute");
    }
  }, [pathname]);


  return (
    <div className={classNames(styles.account__wrapper, 'container')}>
      <HeroBackground className={styles.account__hero}>
        <ImageBackground src={open} alt="Background" />
      </HeroBackground>

      {pathname !== '/account' && pathname !== '/account/profile'  ? (
        <BreadCrumbs
          className={styles.breadCrumbs}
          items={[
            {
              content: 'Home',
              link: '/'
            },
            {
              content: 'Account',
              link: '/account/profile'
            }
          ]}
        />
      ) : null}

      <h2 className={styles.account__name}>Account</h2>
      <div className={styles.account__content}>
        <div className={styles.account__actions}>
          {screenWidth <= 1200 ? (
            <div className={styles.account__back}>
              <h4>{getBackLabel}</h4>
            </div>
          ) : null}

          {isSidebarShown && (
            <AccountNavbar />
          )}
        </div>
        {children}
      </div>
    </div>
  );
});

export default AccountLayout;
