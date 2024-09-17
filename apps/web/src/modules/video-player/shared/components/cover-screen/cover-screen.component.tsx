import styles from './cover-screen.module.scss'
import Image from 'next/image';
import { PlayIcon } from 'lucide-react';
import { ShadowBottom, ShadowTop } from '../shadows';
import { Skeleton } from '@/components/ui/skeleton';
import img from "@/assets/images/Screenify.png"
import { watchAccessStore } from '@/modules/video-player/shared/stores/watch-access-store'
import { observer } from 'mobx-react-lite';
import sharedStyles from '@/modules/video-player/shared/styles.module.scss'
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames';
import { SOCKET_DENY_ERROR } from '../../stores/watch-access-store/constants';
import PlayerMessage from '../player-message/player-message.component';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

type Props = {
    needPay: boolean;
    coverImage: string;
    onClick?: () => void;
}

const denyInfo: Record<SOCKET_DENY_ERROR, { title: string, description: string }> = {
    [SOCKET_DENY_ERROR.DEVICE_LIMIT]: {
        title: 'Connections limit',
        description: 'Upgrade your subscription plan or stop watching videos on other devices, browsers or tabs'
    },
    [SOCKET_DENY_ERROR.INVALID_SUBSCRIPTION]: {
        title: 'You cant view this video',
        description: 'You were declined by server. To gain access for watching this video you can try refreshing the page, upgrading subscription plan or stop watching videos on other devices, browsers or tabs'
    },
    [SOCKET_DENY_ERROR.NO_MEDIA_ID]: {
        title: 'You cant view this video',
        description: 'You were declined by server. To gain access for watching this video you can try refreshing the page, upgrading subscription plan or stop watching videos on other devices, browsers or tabs'
    },

    [SOCKET_DENY_ERROR.OTHER]: {
        title: 'You cant view this video',
        description: 'You were declined by server. To gain access for watching this video you can try refreshing the page, upgrading subscription plan or stop watching videos on other devices, browsers or tabs'
    },

    [SOCKET_DENY_ERROR.UNAUTHENTIFICATED]: {
        title: 'Unauthentificated',
        description: 'You were declined by server. To gain access for watching this video you can try refreshing the page, upgrading subscription plan or stop watching videos on other devices, browsers or tabs'
    },


}

const CoverScreen = ({ coverImage, needPay, onClick }: Props) => {
    return <div className={styles.playScreen} onClick={() => onClick?.()}>
        <Skeleton className={styles.skeleton} />
        <Image src={coverImage || img} loading='eager' className={classNames(styles.image, styles.imageDarken)} alt='' fill />

        <AnimatePresence>
            {(watchAccessStore.access === 'granted' && !needPay) ? (
                <PlayIcon className={styles.icon} />
            ) : null}
        </AnimatePresence>

        <div className={styles.overlay}>

        </div>

        <div className={classNames(sharedStyles.container)}>
            <PlayerMessage
                title={denyInfo[(watchAccessStore.denyCode as SOCKET_DENY_ERROR) ?? SOCKET_DENY_ERROR.OTHER]?.title ?? denyInfo[SOCKET_DENY_ERROR.OTHER].title}
                description={denyInfo[(watchAccessStore.denyCode as SOCKET_DENY_ERROR) ?? SOCKET_DENY_ERROR.OTHER]?.description ?? denyInfo[SOCKET_DENY_ERROR.OTHER].description}
                visible={watchAccessStore.access === 'denied'}
            />

            <PlayerMessage
                title={'Free plan expired'}
                description={'Your free plan has ended. Purchase a subscription now to enjoy uninterrupted access to movies, serials and other exclusive content.'}
                visible={needPay}
            >
                <motion.div
                    style={{ marginTop: '20px' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                >
                    <Link href={'/plans'}>
                        <Button variant='accent-outline'>
                            View plans
                        </Button>
                    </Link>
                </motion.div>
            </PlayerMessage>
        </div>


        <ShadowTop className={styles.shadow} />
        <ShadowBottom className={styles.shadow} />
    </div>
};



export default observer(CoverScreen)