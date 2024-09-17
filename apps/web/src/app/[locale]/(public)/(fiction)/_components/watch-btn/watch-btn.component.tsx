'use client';

import styles from './watch-btn.module.scss'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/navigation'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { PlayIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useHover } from '@uidotdev/usehooks'
import { useCanWatch } from '@/hooks/use-can-watch';
import { sessionStore } from '@/session/session.store';
import { observer } from 'mobx-react-lite';
import { decryptAes, encryptAes } from '@/utils';
import { PopoverMenu, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';

type Props = {
    link: string;
}

const WatchBtn = ({ link }: Props) => {
    const router = useRouter();
    const [isOpenedTooltip, setIsOpenedTooltip] = useState(false);
    const { canWatch } = useCanWatch();

    console.log('WATCH_BTN', canWatch)

    return (
        <PopoverRoot
            triggers={['hover']}
            onOpenChange={setIsOpenedTooltip}
            open={canWatch ? false : isOpenedTooltip}
        >
            <PopoverTrigger>
                <Button
                    variant="pimary"
                    onClick={() => {
                        if (!canWatch) return;
                        router.push(link)
                    }}
                    className={classNames(styles.button, styles.buttonWatch)}
                >
                    watch <PlayIcon className={styles.buttonSvg} />
                </Button>
            </PopoverTrigger>

            <PopoverMenu>
                <div className={styles.tip}>
                    {sessionStore.status === 'authentificated' ? (
                        'Please purchase a subscription to watch the movie'
                    ) : 'Please log in and purchase subscription to watch the movie'}

                </div>
            </PopoverMenu>
        </PopoverRoot>
    )
}

export default observer(WatchBtn)