import { AnimatePresence, MotionProps, motion } from 'framer-motion';
import styles from './dropdown-select.module.scss'
import cn from 'classnames';
import { useState } from 'react';
import { useClickAway } from '@uidotdev/usehooks';

type SelectOption<T> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const positionClassnames: Record<Position, string> = {
    'bottom-left': styles.popoverBottomLeft!,
    'top-left': styles.popoverTopLeft!,
    'top-right': styles.popoverTopRight!,
    'bottom-right': styles.popoverBottomRight!,
}

type Props<T> = {
    position?: Position;
    options: Array<SelectOption<T>>
    value: T;
    onChange?: (value: T) => void;
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    classNames?: Partial<{
        item: string;
    }>
}



function DropdownSelect<const T>({ options, position = 'top-left', value, onChange, children, onOpenChange: setOpenExternal, open: openExternal, classNames }: Props<T>) {
    const [openInternal, setOpenInternal] = useState(false);

    const open = typeof openExternal === 'undefined'
        ? openInternal
        : openExternal;

    const setOpen = typeof setOpenExternal === 'undefined'
        ? setOpenInternal
        : setOpenExternal;

    const ref = useClickAway<HTMLDivElement>(() => {
        setOpen(false)
    });


    return (
        <div ref={ref} className={styles.container}>
            <div
                className={styles.trigger}
                onClick={() => {
                    setOpen(!open)
                }}
            >
                {children}
            </div>
            <AnimatePresence>
                {open ? (
                    <motion.div
                        className={cn(styles.popover, positionClassnames[position])}
                        initial={{
                            height: 0,
                            opacity: 0
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1
                        }}
                        exit={{
                            height: 0,
                            opacity: 0
                        }}
                        transition={{ duration: .15 }}
                    >
                        <div
                            className={styles.dropdown}
                        >
                            {options.map(option => {
                                const isActive = option.value === value;
                                return (
                                    <button
                                        key={option.value as string}
                                        className={cn(styles.item, classNames?.item)}
                                        onClick={() => {
                                            onChange?.(option.value)
                                        }}
                                    >
                                        {option.label}

                                        <div className={cn(styles.dot, isActive && styles.dotActive)} />
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div >
    )
}

export default DropdownSelect