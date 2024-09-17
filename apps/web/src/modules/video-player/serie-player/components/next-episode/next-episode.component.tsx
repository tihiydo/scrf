'use client'

import { SkipForwardIcon } from 'lucide-react';
import styles from './styles.module.scss'
import { observer } from 'mobx-react-lite';
import { ControlsButton } from '../../../shared/components/ui/controls-button';
import { GetNextEpisode } from '@/api/requests/serials/next-episode';
import { PopoverMenu, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { useParams, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { LoadingIcon } from '@/components/icons/loading-icon';
import { Episode } from '@/entities/serial/episode';

type Props = {
    onClick?: () => void;
    isLoading: boolean;
    next: Maybe<Episode>;
}

const NextBtn = ({ onClick, isLoading, next }: Props) => {
    const { episode, season, slug } = useParams()
    const router = useRouter();

    const isSameEpisode = slug === next?.serial?.imdbid
        && season === next?.season?.position.toString()
        && episode === next?.position.toString()

    const isDisabled = isLoading || isSameEpisode


    return (
        <PopoverRoot position='top-left' triggers={['hover']}>
            <PopoverTrigger>
                <ControlsButton
                    disabled={isDisabled || !next}
                    className={classNames(styles.btn, styles.btnDisabled)}
                    onClick={() => {
                        if (isDisabled || !next) return;
                        const link = `/serial/${next?.serial?.imdbid}/${next?.season?.position}/${next?.position}/watch`

                        onClick?.();
                        router.push(link)
                    }}
                >
                    {isLoading ? (
                        <LoadingIcon />
                    ) : (
                        <SkipForwardIcon className={styles.icon} />
                    )}
                </ControlsButton>
            </PopoverTrigger>
            {next ? (
                <PopoverMenu>
                    <div className={styles.popoverMenu}>
                        <p className={styles.nextText}> Next Episode: S{next.season?.position}E{next.position} </p>
                        <p className={styles.nextTitle}>
                            {next.title}
                        </p>
                    </div>
                </PopoverMenu>
            ) : null}
        </PopoverRoot>
    )
}

export default observer(NextBtn)