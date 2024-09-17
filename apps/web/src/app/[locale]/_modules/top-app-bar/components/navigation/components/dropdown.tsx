'use client'

import { useState } from 'react'
import styles from './dropdown.module.scss'
import { CheckCheckIcon, ChevronDownIcon, EyeIcon, HeartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import classNames from 'classnames';
import { DropdownItem, DropdownMenu, DropdownRoot, DropdownTrigger } from '@/components/ui/dropdown';
import { PopoverPosition } from '@/components/ui/popover';

type Props = {
    className?: string;
    position?: PopoverPosition;
}

const Dropdown = ({ className, position }: Props) => {
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
                    MORE
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
                    <Link href={'/plans'} className={styles.item}>
                        <p className={styles.itemText}>Plans</p>
                    </Link>
                </DropdownItem>

                <DropdownItem>
                    <Link href={'/collections'} className={styles.item}>
                        <p className={styles.itemText}>Collections</p>
                    </Link>
                </DropdownItem>
            </DropdownMenu>
        </DropdownRoot>
    )
}

export default Dropdown