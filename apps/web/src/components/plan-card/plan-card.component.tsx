'use client'

import classNames from "classnames";
import { Button } from "../ui/button";
import styles from "./plan-card.module.scss";
import { Link } from "@/i18n/navigation";
import { Subscriptions } from "@/entities/user";
import { useSession } from "@/session/hooks/use-session";

type Props = {
  className?: string;
  plan: "middle" | "base" | "pro";
  handleBuyButtonClick?: () => void;
  canFree: boolean
};

const PLANS = [
  {
    title: "Starter Plan",
    value: "base" as keyof typeof Subscriptions,
    ratedMovies: 100000,
    trendingSeries: 90000,
    quality: "FULL HD and 4K Quality",
    view: "2 devices, NO ADS",
    perMonth: "2$",
  },
  {
    title: "Medium Plan",
    value: "middle" as keyof typeof Subscriptions,
    ratedMovies: 100000,
    trendingSeries: 90000,
    quality: "FULL HD and 4K Quality",
    view: "5 devices, NO ADS",
    perMonth: "3$",
  },
  {
    title: "Premium Plan",
    value: "pro" as keyof typeof Subscriptions,
    ratedMovies: 100000,
    trendingSeries: 90000,
    quality: "HD, Full HD and 4K",
    view: "8 devices, NO ADS",
    perMonth: "4$",
  },
];

const PlanCard = ({ className, plan, handleBuyButtonClick, canFree }: Props) => {

  const sessionStore = useSession()


  const selectedPlan = PLANS.find((p) => p.value === plan);
  console.log(sessionStore.status)
  if (!selectedPlan) {
    return null; // or some fallback UI if the plan is not fou
  }

  return (
    <div className={classNames(styles.card, className)}>
      <h4 className={styles.title}>{selectedPlan.title}</h4>

      <div className={styles.advantages}>
        <div className={styles.advantagesItem}>
          <span className={styles.advantagesAccent}>{selectedPlan.ratedMovies}+</span> rated movies
        </div>

        <div className={styles.advantagesItem}>
          <span className={styles.advantagesAccent}>{selectedPlan.trendingSeries}+</span> trending series
        </div>

        <div className={styles.advantagesItem}>
          View from <span className={styles.advantagesAccent}>{selectedPlan.view}</span>
        </div>

        <div className={styles.advantagesItem}>
          <span className={styles.advantagesAccent}>{selectedPlan.quality}</span> quality
        </div>
      </div>

      <div className={styles.buy}>
        <p className={styles.buyPrice}>{selectedPlan.perMonth} / week after trial ends</p>

        <Link href={sessionStore.status == 'authentificated' ? 'account/subscription' : '/register'}>
          <Button
            className={styles.buyBtn}
            size={"lg"}
            variant={"pimary"}
            onClick={handleBuyButtonClick}
          >
            {canFree ? "FREE" : "TRY FOR FREE"}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PlanCard;