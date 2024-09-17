import { FC, ReactNode } from "react";
import classnames from "classnames";

import { ArrowUpIcon } from "@/components/icons";

import styles from "./accordion.module.scss";

type AccordionProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  handleOpen: () => void;
  className?: string;
};

export const Accordion: FC<AccordionProps> = ({
  isOpen,
  title,
  children,
  handleOpen,
  className,
}) => {
  return (
    <div className={classnames(styles.accordion, className)}>
      <div
        className={classnames(styles.accordion__header, {
          [`${styles.accordion__header_shown}`]: isOpen,
        })}
        onClick={handleOpen}
      >
        <h5>{title}</h5>
        <ArrowUpIcon />
      </div>
      <div
        className={classnames(styles.accordion__content, {
          [`${styles.accordion__content_shown}`]: isOpen,
        })}
      >
        {children}
      </div>
    </div>
  );
};
