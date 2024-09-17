"use client";

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import open from "@/assets/images/oppengay.png";
import { PlanCard } from "@/components/plan-card";
import { ImageBackground } from "@/components/ui/hero-background";
import { useRouter } from "@/i18n/navigation";
import styles from "./page.module.scss";
import { useSession } from "@/session/hooks/use-session";
import { useEffect, useState } from "react";
import { apiClient } from "@/app/api/client";
import { NavTabs } from "@/modules/nav-tabs";
import { PageTitle } from "@/components/page-title";
import { Hero } from "@/components/ui/hero";

const Plans = observer(() => {
  const router = useRouter();
  const { user } = useSession();
  const [canFree, setCanFree] = useState<boolean>(false);

  const handleBuyButtonClick = () => {
    if (user) {
      router.push("/account/subscription/");
    } else {
      router.push("/login");
      localStorage.setItem("nextAuthRoute", "/account/subscription");
    }
  };

  const canBeFree = async () => {
    try {
      const response = await apiClient.get("/subscriptions/can-buy-free");
      if (response.status === 200 && typeof response.data === 'boolean') {
        setCanFree(response.data);
      } else {
        console.error('Unexpected response data:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    }
  };

  useEffect(() => {
    canBeFree();
  }, []);

  return (
    <div className={classNames(styles.plans__wrapper)}>
      <ImageBackground src={open} overlay={{}} alt="Hero" className={styles.plans__hero} />

      <NavTabs />

      <PageTitle className={classNames('container',styles.paddingPage)} bottomSpacing >Plans</PageTitle>

      <section className={classNames(styles.plans, 'container')}>
        <PlanCard
          plan="base"
          className={styles.plans__item}
          canFree={canFree}
          handleBuyButtonClick={handleBuyButtonClick}
        />
        <PlanCard
          plan="middle"
          className={styles.plans__item}
          canFree={canFree}
          handleBuyButtonClick={handleBuyButtonClick}
        />
        <PlanCard
          plan="pro"
          className={styles.plans__item}
          canFree={canFree}
          handleBuyButtonClick={handleBuyButtonClick}
        />
      </section>
    </div>
  );
});

export default Plans;
