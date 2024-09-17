'use client'

import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import styles from './search.module.scss'
import { useState } from 'react'
import classNames from 'classnames'
import { Search } from '@/modules/search'
import { PopoverMenu, PopoverRoot, PopoverTrigger } from '@/components/ui/popover'

type Props = {
    className?: string;
}

const SearchToggle = ({ className }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <PopoverRoot
            className={styles.popover}
            open={isOpen}
            onOpenChange={setIsOpen}
            position='bottom-right'
        >
            <PopoverTrigger>
                <Button
                    variant={'ghost'} size={'icon'}
                    className={classNames(styles.btn, className)}
                >
                    <SearchIcon className={styles.icon} />
                </Button>
            </PopoverTrigger>

            <PopoverMenu
                className={styles.popoverContent}
                exit={{ opacity: 0, }}
                initial={{ opacity: 0, }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: .2, type: 'spring', stiffness: 260, damping: 20 }}
            >
                <Search close={() => setIsOpen(false)} />
            </PopoverMenu>
        </PopoverRoot>
    )
}

export default SearchToggle