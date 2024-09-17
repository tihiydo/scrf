import { DropdownSelect } from '@/components/ui/dropdown-select'
import { AudioLinesIcon } from 'lucide-react'
import styles from './audio-tracks.module.scss'
import { observer } from 'mobx-react-lite'
import { ControlsButton } from '../ui/controls-button'
import { MediaPlaylist } from 'hls.js'

type Props = {
    tracks: MediaPlaylist[]
    selectedTrack: Maybe<number>;
    onChange?: (value: Maybe<number>) => void;
}

const AudioTracks = ({ tracks, selectedTrack, onChange }: Props) => {
    return (
        <DropdownSelect
            position='bottom-right'
            value={selectedTrack}
            onChange={(newValue) => {
                onChange?.(newValue);
            }}
            options={tracks.map(audio => ({
                label: audio.name,
                value: audio.id
            }))}
        >
            <ControlsButton className={styles.btn}>
                <AudioLinesIcon className={styles.icon} />
            </ControlsButton>
        </DropdownSelect>
    )
}

export default observer(AudioTracks);