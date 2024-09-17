'use client'

import { SkipBackIcon } from 'lucide-react';
import styles from './styles.module.scss'
import { observer } from 'mobx-react-lite';
import { ControlsButton } from '../../../shared/components/ui/controls-button';
import { PopoverMenu, PopoverRoot, PopoverTrigger } from '@/components/ui/popover';
import { useParams, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { LoadingIcon } from '@/components/icons/loading-icon';
import { Episode } from '@/entities/serial/episode';

type Props = {
    onClick?: () => void;
    isLoading: boolean;
    prev: Maybe<Episode>;
}

const PlayBtn = ({ onClick, isLoading, prev }: Props) => {
    const { episode, season, slug } = useParams()
    const router = useRouter();


    const isSameEpisode = slug === prev?.serial?.imdbid
        && season === prev?.season?.position.toString()
        && episode === prev?.position.toString()

    const isDisabled = isLoading || isSameEpisode


    return (
        <PopoverRoot position='top-left' triggers={['hover']}>
            <PopoverTrigger>
                <ControlsButton
                    disabled={isDisabled || !prev}
                    className={classNames(styles.btn, styles.btnDisabled)}
                    onClick={() => {
                        if (isDisabled || !prev) return;
                        const link = `/serial/${prev?.serial?.imdbid}/${prev?.season?.position}/${prev?.position}/watch`

                        onClick?.();
                        router.push(link)
                    }}
                >
                    {isLoading ? (
                        <LoadingIcon />
                    ) : (
                        <SkipBackIcon className={styles.icon} />
                    )}
                </ControlsButton>
            </PopoverTrigger>
            {prev ? (
                <PopoverMenu>
                    <div className={styles.popoverMenu}>
                        <p className={styles.nextText}> Next Episode: S{prev.season?.position}E{prev.position} </p>
                        <p className={styles.nextTitle}>
                            {prev.title}
                        </p>
                    </div>
                </PopoverMenu>
            ) : null}
        </PopoverRoot>
    )
}

export default observer(PlayBtn)