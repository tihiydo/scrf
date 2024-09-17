import { SubtitlesIcon } from 'lucide-react'
import styles from './subtitles.module.scss'
import { DropdownSelect } from '@/components/ui/dropdown-select'
import { observer } from 'mobx-react-lite'
import { ControlsButton } from '../ui/controls-button'
import { MediaPlaylist } from 'hls.js'
import { ActiveSubtitle } from '../../types'


type Props = {
    selectedSubtitle: ActiveSubtitle;
    tracks: MediaPlaylist[];
    onChange?: (selected: ActiveSubtitle) => void;
}



const Subtitles = ({ tracks, selectedSubtitle, onChange }: Props) => {

    return (
        <DropdownSelect
            position='top-left'
            value={selectedSubtitle}
            onChange={(value) => {
                onChange?.(value)
            }}
            options={[
                {
                    label: 'Off',
                    value: 'off'
                },
                ...tracks.map(track => ({
                    label: track.name,
                    value: track.id
                })),

            ]}
        >
            <ControlsButton className={styles.btn}>
                <SubtitlesIcon className={styles.icon} />
            </ControlsButton>
        </DropdownSelect>
    )
}

export default observer(Subtitles);