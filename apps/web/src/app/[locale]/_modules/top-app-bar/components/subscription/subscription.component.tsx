"use client";

import { observer } from "mobx-react-lite";
import { useClickAway, useHover } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import classNames from "classnames";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "@/i18n/navigation";

import styles from "./subscription.module.scss";
import { calculateDaysFrom } from "@/utils/time";
import { apiClient } from "@/app/api/client";
import { useSession } from "@/session/hooks/use-session";
import { AdminRole } from "@/entities/user";

type Props = {};

const Subscription = observer((props: Props) => {
  const pathname = usePathname();
  const sessionStore = useSession();
  const [isOpenedTooltip, setIsOpenedTooltip] = useState(false);
  const [isOpenedSubscription, setIsOpenedSubscription] = useState(true);
  const [isModel, setIsModal] = useState(sessionStore.isModalShowed)
  const clickAwayRef = useClickAway<HTMLButtonElement>(() => {
    setIsOpenedSubscription(false);
  });
  const [hoverRef, hovering] = useHover();
  const router = useRouter();

  useEffect(() => {
    setIsOpenedTooltip(hovering);
  }, [hovering]);

  const isActiveSubscription = useMemo(
    () =>
      sessionStore.user?.subscriptionExpired &&
      sessionStore.user?.currentSubscription,
    [sessionStore.user]
  );

  const isSubscriptionGonnaEnd = useMemo(() => {
    if (sessionStore.user) {
      const { subscriptionExpired } = sessionStore.user;
      return subscriptionExpired && calculateDaysFrom(subscriptionExpired) <= 7;
    }
    return false;
  }, [sessionStore.user]);

  if (sessionStore.user) {
    const { currentSubscription, subscriptionExpired } = sessionStore.user;

    if (typeof subscriptionExpired == "string") {
      const data = new Date(subscriptionExpired)

      const isSubscriptionActive = data.getTime() > new Date().getTime() || currentSubscription == null

      if (!isSubscriptionActive) {
        sessionStore.user.currentSubscription = null;
        sessionStore.user.subscriptionExpired = null;
        const t = apiClient.patch(`/users/decline-subscription/${sessionStore.user.id}`)
      }
    }

  }
  const handleClickSubscriptionButton = () => {
    if (!sessionStore.user) {
      router.push("/login");
      localStorage.setItem("nextAuthRoute", "/account/subscription");
      return;
    }

    const { currentSubscription, subscriptionExpired } = sessionStore.user;

    if ((currentSubscription || !currentSubscription) && !subscriptionExpired) {
      router.push("/account/subscription");
    }

    if (isSubscriptionGonnaEnd) {
      setIsOpenedSubscription((prev) => !prev);
      setIsModal(true)
    }
  };


  const handeModal = () => {
    sessionStore.toggleModal()
  }

  useEffect(() => {
    if (isSubscriptionGonnaEnd) {
      setIsOpenedSubscription(true);
    }
  }, []);

  if (!sessionStore.isInitialized || Object.values(AdminRole).some(r => r === sessionStore.user?.role)) return null;

  return (
    <div className={styles.container} ref={hoverRef}>
      <Button
        ref={clickAwayRef}
        variant={"accent-outline"}
        className={styles.btn}
        onClick={() => {
          handeModal()
          setIsModal(true)
        }}
      >
        {isActiveSubscription
          ? `${calculateDaysFrom(sessionStore.user?.subscriptionExpired!)} days`
          : "SUBSCRIPTION"}
      </Button>
      <AnimatePresence>
        {isOpenedTooltip && !isOpenedSubscription ? (
          <motion.div
            className={classNames(styles.popover, styles.popoverTooltip)}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className={styles.tip}>
              {isActiveSubscription
                ? "Day of your subscription"
                : "Click to buy subscription"}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isModel && isSubscriptionGonnaEnd ? (
          <motion.div
            className={classNames(styles.popover, styles.popoverSubscription)}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div className={styles.subscriptionContent}>
              <h4 className={styles.subscriptionContentTitle}>
                <span className={styles.subscriptionContentHighlight}>
                  {calculateDaysFrom(sessionStore.user?.subscriptionExpired!)}{" "}
                  days
                </span>{" "}
                before your subscription ends
              </h4>
              <p className={styles.subscriptionContentDescr}>
                Update your subscription in your account settings
              </p>
              <Button
                className={styles.subscriptionContentClose}
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  handeModal()
                  setIsModal(false)
                }}
              >
                <XIcon />
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

export default Subscription;
