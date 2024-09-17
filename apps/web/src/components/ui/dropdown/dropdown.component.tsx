'use client'

import styles from './dropdown.module.scss'
import classNames from 'classnames';
import React, { ComponentProps, createContext, useContext, useState } from 'react';
import { PopoverMenu, PopoverRoot, PopoverTrigger, __usePopoverContext } from '../popover';


type RootProps = {
} & ComponentProps<typeof PopoverRoot>

function DropdownRoot({ children, onOpenChange, open, position, className, ...props }: RootProps) {
    return (
        <PopoverRoot
            open={open}
            onOpenChange={onOpenChange}
            position={position}
            {...props}
        >
            {children}
        </PopoverRoot>
    );
}



type MenuProps = {
} & ComponentProps<typeof PopoverMenu>;
function DropdownMenu({ className, ...props }: MenuProps) {
    return <PopoverMenu className={styles.dropdown} {...props} />
}





type TriggerProps = {
} & ComponentProps<typeof PopoverTrigger>;
function DropdownTrigger({ ...props }: TriggerProps) {
    return (
        <PopoverTrigger   {...props} />
    )
}





type ItemProps = {
} & ComponentProps<'div'>
function DropdownItem({ className, children, ...props }: ItemProps) {
    const a = __usePopoverContext();
    return (
        <div
            {...props}
            className={classNames(styles.item, className)}
        >
            {children}
        </div>
    )
}




export { DropdownRoot, DropdownMenu, DropdownTrigger, DropdownItem }