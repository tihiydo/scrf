'use client'

import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
} from "lucide-react";
import classNames from "classnames";

import styles from "./seasons-button.module.scss";
import { Button } from "@/components/ui/button";
import { Season } from "@/entities/serial/season";


type Props = {
  seasons: Season[];
  onChange: (season: Season) => void;
  selectedSeason: Maybe<Season>
}
export const SeasonSelect = ({ seasons, onChange, selectedSeason }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const clickAwayRef = useClickAway<HTMLDivElement>((e) => {
    setIsOpen(false);
  });

  return (
    <div className={styles.container} ref={clickAwayRef}>
      <Button
        variant="pimary"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={classNames(styles.trigger)}
      >
        <p>
          {selectedSeason ? (
            `Season ${selectedSeason?.position}`
          ) : (
            'Select season'
          )}
        </p>
        <motion.div
          className={styles.trigger__icon__motion}
          animate={{ rotate: isOpen ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <ChevronDownIcon className={styles.trigger__icon} />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className={styles.popover}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {seasons.map((season, i) => (
              <div
                className={styles.trigger__item}
                onClick={() => {
                  onChange?.(season);
                  setIsOpen(false);
                }}
              >
                <p className={styles.trigger__item__text}>Season {season.position}</p>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
