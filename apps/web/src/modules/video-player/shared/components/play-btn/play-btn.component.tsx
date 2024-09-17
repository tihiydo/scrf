'use client'

import { PauseIcon, PlayIcon } from 'lucide-react';
import styles from './play-btn.module.scss'
import { observer } from 'mobx-react-lite';
import { ControlsButton } from '../ui/controls-button';

type Props = {
    paused: boolean;
    onClick?: () => void;
}

const PlayBtn = ({ onClick, paused }: Props) => {

    return (
        <ControlsButton
            className={styles.btn}
            onClick={() => {
                onClick?.();
            }}
        >
            {paused ? (
                <PlayIcon className={styles.icon} />
            ) : (
                <PauseIcon className={styles.icon} />
            )}
        </ControlsButton>
    )
}

export default observer(PlayBtn)