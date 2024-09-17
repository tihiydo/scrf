import { InfoIcon, PlayIcon } from "lucide-react";
import styles from "./hero-card.module.scss";
import classNames from "classnames";
import { Button } from "@/components/ui/button";
import { Movie } from "@/entities/movie";
import { sessionStore } from "@/session/session.store";
import { useHover } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCanWatch } from "@/hooks/use-can-watch";

type Props = {
  movie: Movie;
};

const HeroCard = observer(({ movie }: Props) => {
  const [hoverRef, hovering] = useHover();
  const [isOpenedTooltip, setIsOpenedTooltip] = useState(false);
  const router = useRouter();
  const { canWatch, ttm } = useCanWatch();
  // const isButtonDisabled = useMemo(() => {
  //   const { user } = sessionStore || {};
  //   const { currentSubscription, subscriptionExpired } = user || {};

  //   return (
  //     (!currentSubscription && !subscriptionExpired) ||
  //     (currentSubscription && !subscriptionExpired)
  //   );
  // }, [sessionStore?.user]);

  useEffect(() => {
    setIsOpenedTooltip(hovering);
  }, [hovering]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h2 className={styles.title}>{movie.title}</h2>

        <div className={styles.tagContainer}>
          <div className={styles.tag}>TOP</div>

          <p className={styles.tagContinue}>among the movies today</p>
        </div>

        <p className={styles.description}>{movie.description}</p>

        <div className={styles.buttonContainer}>
          <div ref={hoverRef}>
            <Button
              // disabled={isButtonDisabled!!}
              variant="pimary"
              onClick={() => {
                router.push(`/movie/${movie.imdbid}/watch`)
              }}
              className={classNames(styles.button, styles.buttonWatch,)}
            >
              watch <PlayIcon className={styles.buttonSvg} />
            </Button>
          </div>
          {/* <AnimatePresence>
            {isOpenedTooltip ? (
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
                  Please purchase a subscription to watch the movie
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence> */}

          <Button
            variant={"accent-outline"}
            className={classNames(styles.button, styles.buttonInfo)}
            onClick={() => router.push(`/movie/${movie.imdbid}`)}
          >
            info
            <InfoIcon />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default HeroCard;
