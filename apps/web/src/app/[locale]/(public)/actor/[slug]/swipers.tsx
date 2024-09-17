import React from "react";
import { ChevronDown } from "lucide-react";
import { swiperConst } from "@/constants/swiper-component";
import classNames from "classnames";
import { FictionSwiper } from "@/components/swipers";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "@/app/[locale]/(public)/page.module.scss";

import { useState } from "react";

type Props = {};

const swipers = (props: Props) => {
  const [isOpenedMore, setIsOpenedMore] = useState(false);
  return (
    <>
      <section
        className={classNames("container", styles.fiction, styles.fictionFilms)}
      >
        <h3 className={styles.fictionTitle}>Films</h3>

        <FictionSwiper fictions={swiperConst} />

        <AnimatePresence initial={false}>
          {isOpenedMore ? (
            <motion.div
              className={styles.moreContent}
              key={"content"}
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            >
              <div className={styles.fictionCategory}>
                <h5 className={styles.fictionCategoryTitle}>Trand</h5>

                <FictionSwiper fictions={swiperConst} />
              </div>

              <div className={styles.fictionCategory}>
                <h5 className={styles.fictionCategoryTitle}>POPULAR</h5>

                <FictionSwiper fictions={swiperConst} />
              </div>

              <div className={styles.fictionCategory}>
                <h5 className={styles.fictionCategoryTitle}>Trand</h5>

                <FictionSwiper fictions={swiperConst} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button
          variant={"accent-outline"}
          className={classNames(styles.moreHideBtn, styles.moreBtn)}
          onClick={() => {
            setIsOpenedMore(!isOpenedMore);
          }}
        >
          {isOpenedMore ? "Hide" : "More"}
          <motion.div
            className={styles.moreHideBtnIconMotion}
            animate={{ rotate: isOpenedMore ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ChevronDown
              className={classNames(styles.moreHideBtnIcon, styles.hideBtn)}
            />
          </motion.div>
        </Button>
      </section>
      <section
        className={classNames("container", styles.fiction, styles.fictionFilms)}
      >
        <h3 className={styles.fictionTitle}>SerialS</h3>

        <FictionSwiper fictions={swiperConst} />

        <AnimatePresence initial={false}>
          {isOpenedMore ? (
            <motion.div
              className={styles.moreContent}
              key={"content"}
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            >
              <div className={styles.fictionCategory}>
                <h5 className={styles.fictionCategoryTitle}>Trand</h5>

                <FictionSwiper fictions={swiperConst} />
              </div>

              <div className={styles.fictionCategory}>
                <h5 className={styles.fictionCategoryTitle}>POPULAR</h5>

                <FictionSwiper fictions={swiperConst} />
              </div>

              <div className={styles.fictionCategory}>
                <h5 className={styles.fictionCategoryTitle}>Trand</h5>

                <FictionSwiper fictions={swiperConst} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button
          variant={"accent-outline"}
          className={classNames(styles.moreHideBtn, styles.moreBtn)}
          onClick={() => {
            setIsOpenedMore(!isOpenedMore);
          }}
        >
          {isOpenedMore ? "Hide" : "More"}
          <motion.div
            className={styles.moreHideBtnIconMotion}
            animate={{ rotate: isOpenedMore ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ChevronDown
              className={classNames(styles.moreHideBtnIcon, styles.hideBtn)}
            />
          </motion.div>
        </Button>
      </section>
    </>
  );
};

export default swipers;
