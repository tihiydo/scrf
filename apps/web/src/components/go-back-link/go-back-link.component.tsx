"use client";

import classNames from "classnames";
import { useRouter } from "@/i18n/navigation";
import { LeftOutlined } from "@ant-design/icons";

import styles from "./go-back-link.module.scss";

type Props = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const GoBackLink = ({ className, children, onClick }: Props) => {
  const router = useRouter();

  return (
    <button
      role="link"
      className={classNames(styles.link, className)}
      onClick={() => {
        onClick ? onClick() : router.back();
      }}
    >
      {children ? (
        children
      ) : (
        <>
          <LeftOutlined className={styles.linkIcon} />
          Go back
        </>
      )}
    </button>
  );
};

export default GoBackLink;
