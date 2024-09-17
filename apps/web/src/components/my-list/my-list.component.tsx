'use client'

import { useState } from 'react'
import styles from './my-list.module.scss'
import { CheckCheckIcon, ChevronDownIcon, EyeIcon, HeartIcon } from 'lucide-react';
import {  motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import classNames from 'classnames';
import { DropdownItem, DropdownMenu, DropdownRoot, DropdownTrigger } from '@/components/ui/dropdown';
import { PopoverPosition } from '../ui/popover';

type Props = {
    className?: string;
    position?: PopoverPosition;
}

const MyList = ({ className, position  }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownRoot position={position} open={isOpen} onOpenChange={setIsOpen} className={styles.container}>
            <DropdownTrigger>
                <button
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                    className={classNames(styles.trigger, className)}
                >
                    My list
                    <motion.div
                        className={styles.triggerIconMotion}
                        animate={{ rotate: isOpen ? -180 : 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                        <ChevronDownIcon className={styles.triggerIcon} />
                    </motion.div>
                </button>
            </DropdownTrigger>

            <DropdownMenu>
                <DropdownItem>
                    <Link href={'/lists/saved'} className={styles.item}>
                        <HeartIcon className={styles.itemIcon} />
                        <p className={styles.itemText}>Saved</p>
                    </Link>
                </DropdownItem>

                <DropdownItem>
                    <Link href={'/lists/watching'} className={styles.item}>
                        <EyeIcon className={styles.itemIcon} />
                        <p className={styles.itemText}>Watching</p>
                    </Link>
                </DropdownItem>

                <DropdownItem>
                    <Link href={'/lists/viewed'} className={styles.item}>
                        <CheckCheckIcon className={styles.itemIcon} />
                        <p className={styles.itemText}>Viewed</p>
                    </Link>
                </DropdownItem>
            </DropdownMenu>
        </DropdownRoot>
    )
}

export default MyList