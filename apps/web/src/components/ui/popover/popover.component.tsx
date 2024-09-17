'use client'

import { ComponentProps, createContext, useContext, useEffect, useState } from 'react';
import styles from './popover.module.scss'
import { useClickAway, useHover } from '@uidotdev/usehooks';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

export type PopoverTriggerType =
    | 'click'
    | 'hover'

export type Triggers = PopoverTriggerType[]


export type PopoverPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'

const positionClassnames: Record<PopoverPosition, string> = {
    'bottom-left': styles.popoverBottomLeft!,
    "bottom-center": styles.popoverBottomCenter!,
    'bottom-right': styles.popoverBottomRight!,
    'top-left': styles.popoverTopLeft!,
    "top-center": styles.popoverTopCenter!,
    'top-right': styles.popoverTopRight!,
}


const PopoverContext = createContext<{
    position: PopoverPosition;
    open: boolean;
    setOpen: (open: boolean) => void;
    triggers: Triggers;
}>({
    position: 'bottom-left',
    open: false,
    setOpen: () => null,
    triggers: ['click']
});

export function __usePopoverContext() {
    return useContext(PopoverContext)
}


type RootProps = {
    position?: PopoverPosition;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggers?: Triggers
} & ComponentProps<'div'>
function PopoverRoot({
    children,
    onOpenChange: setOpenExternal,
    open: openExternal,
    position,
    className,
    triggers = ['click'],
    ...props
}: RootProps) {
    const clickAwayRef = useClickAway<any>(() => {
        setOpen(false)
    });

    const [openInternal, setOpenInternal] = useState(false);

    const open = typeof openExternal === 'undefined'
        ? openInternal
        : openExternal;

    const setOpen = typeof setOpenExternal === 'undefined'
        ? setOpenInternal
        : setOpenExternal;

    // TODO: add delay for hover
    const [hoverRef, isHovering] = useHover()


    useEffect(() => {
        if (!triggers.includes('hover')) return

        setOpen(isHovering);
    }, [isHovering])


    return (
        <PopoverContext.Provider value={{
            position: position ?? 'bottom-left',
            open,
            setOpen,
            triggers
        }}>
            <div
                ref={(node) => {
                    clickAwayRef.current = node;
                    hoverRef(node);
                }}
                className={classNames(styles.container, className)}
                {...props}
            >
                {children}
            </div>
        </PopoverContext.Provider>
    )
}

type MenuProps = {
} & ComponentProps<typeof motion.div>;
function PopoverMenu({ children, className, exit, animate, initial, transition, ...props }: MenuProps) {
    const { open, position } = __usePopoverContext();

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    className={classNames(styles.popover, positionClassnames[position], className)}
                    initial={initial ?? {
                        height: 0,
                        opacity: 0
                    }}
                    animate={animate ?? {
                        height: 'auto',
                        opacity: 1,
                    }}
                    exit={exit ?? {
                        height: 0,
                        opacity: 0
                    }}
                    transition={transition ?? { duration: .2 }}
                    {...props}
                >
                    {children}
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

type TriggerProps = {
} & ComponentProps<'div'>;
function PopoverTrigger({ children, className, onClick, ...props }: TriggerProps) {
    const { setOpen, triggers, open } = __usePopoverContext();

    return (
        <div
            className={classNames(styles.trigger, className)}
            onClick={(e) => {
                if (triggers.includes('click')) {

                    setOpen(!open)
                }

                onClick?.(e)
            }}
            {...props}
        >
            {children}
        </div>
    )
}


export { PopoverRoot, PopoverMenu, PopoverTrigger }