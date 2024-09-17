'use client'
import styles from './category-filters.module.scss'
import classNames from 'classnames';
import { useState } from 'react';
import MobileFilters from './mobile-filters.component';
import DesktopFilters from './desktop-filters.component';

type Props = {
  className?: string;
}

const CategoryFilters = ({ className }: Props) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className={classNames(styles.filter, className)}>
      <div className={styles.mobile}>
        <MobileFilters isOpened={isOpened} setOpen={setIsOpened} />
      </div>

      <div className={styles.desktop}>
        <DesktopFilters />
      </div>
    </div>)
}

export default CategoryFilters