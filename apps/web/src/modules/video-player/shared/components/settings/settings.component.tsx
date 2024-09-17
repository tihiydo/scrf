import React from 'react'
import { ControlsButton } from '../ui/controls-button'
import { SettingsIcon } from 'lucide-react'
import { MobileSettings } from '../mobile-settings'
import { useModalManager } from '@/hooks/use-modal-manager'
import { SettingsPages } from '../../constants'

type Props = {
    className?: string;
    onClick?: () => void;
}

const Settings = ({ className, onClick }: Props) => {

    return (

        <ControlsButton className={className} onClick={() => {
            onClick?.()
        }}>
            <SettingsIcon />
        </ControlsButton>

    )
}

export default Settings