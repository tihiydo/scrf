'use client'

import { Button } from '@/components/ui/button';
import styles from './mobile-filters.module.scss'
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from 'lucide-react';

type Props = {
    className?: string;
    isOpened: boolean;
    toggle: () => void;
}

const FilterBtn = ({ toggle, isOpened, className }: Props) => {
    return (
        <Button className={classNames(styles.filtersBtn, className)} size={'lg'} variant={'pimary'} onClick={toggle}>
            Filters
            <motion.div
                className={styles.filtersBtnMotion}
                animate={{ rotate: isOpened ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <ChevronDownIcon className={styles.filtersBtnIcon} />
            </motion.div>
        </Button>
    )
}

export default FilterBtn