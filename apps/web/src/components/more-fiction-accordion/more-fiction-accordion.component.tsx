'use client'

import styles from './more-fiction-accordion.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react'
import { Button } from '../ui/button';
import classNames from 'classnames';
import { ChevronDownIcon } from 'lucide-react';

type Props = {
    children: React.ReactNode;
}

const MoreFictionAccrodion = ({ children }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <AnimatePresence initial={false}>
                {open ? (
                    <motion.div
                        className={styles.motion}
                        key={"content"}
                        initial={{ height: 0, opacity: 0,  }}
                        animate={{ height: "auto", opacity: 1, }}
                        exit={{ height: 0, opacity: 0, }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    >
                        <div
                            className={styles.content}
                        >
                            {children}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <Button
                variant={"accent-outline"}
                size={'lg'}
                className={classNames(styles.btn)}
                onClick={() => setOpen(!open)}
            >
                {open ? "Hide" : "More"}
                <motion.div
                    className={styles.btnMotion}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <ChevronDownIcon
                        className={classNames(styles.btnIcon)}
                    />
                </motion.div>
            </Button>
        </>
    )
}

export default MoreFictionAccrodion