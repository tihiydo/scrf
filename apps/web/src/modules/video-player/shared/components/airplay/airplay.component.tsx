import React from 'react'
import { ControlsButton } from '../ui/controls-button'
import { AirplayIcon } from 'lucide-react'
import styles from './styles.module.scss'


type Props = {
    onClick: () => void;
}

const Airplay = ({  onClick }: Props) => {
    return (
        <ControlsButton
            className={styles.btn}
            onClick={() => {
                onClick?.()
            }}
        >
            <AirplayIcon
                className={styles.icon}
            />
        </ControlsButton>
    )
}

export default Airplay