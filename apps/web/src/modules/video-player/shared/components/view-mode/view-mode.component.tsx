'use client'

import { MaximizeIcon, MinimizeIcon } from 'lucide-react';
import styles from './view-mode.module.scss'
import { observer } from 'mobx-react-lite';
import { ControlsButton } from '../ui/controls-button';

type Props = {
    isFullscreen: boolean;
    onClick?: () => void;
}

const ViewMode = ({ isFullscreen, onClick }: Props) => {

    return (
        <ControlsButton
            className={styles.btn}
            onClick={() => {
                onClick?.();
            }}
        >
            {isFullscreen ? (
                <MinimizeIcon
                    strokeWidth={1.5}
                    className={styles.icon}
                />
            ) : (
                <MaximizeIcon
                    strokeWidth={1.5}
                    className={styles.icon}
                />
            )}
        </ControlsButton>
    )
}

export default observer(ViewMode);
