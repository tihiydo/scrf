import { MediaPlaylist } from 'hls.js';
import { SettingSelectOption } from '../ui/select-option';
import styles from './settings-pages.module.scss'

type Props = {
    onSelect?: (value: number) => void;
    tracks: MediaPlaylist[]
    selectedTrack: Maybe<number>;
}

const AudioTracksSettings = ({ onSelect, selectedTrack, tracks }: Props) => {
    return (
        <div>
            <div className={styles.settingsPageHead}>
                <h4 className={styles.settingsPageTitle}>Current audio track</h4>
                <p className={styles.settingsPageSelected}>({tracks.find(track => track.id === selectedTrack)?.name ?? 'Unknown'})</p>
            </div>

            <ul className={styles.settingsPageList}>
                {tracks.map((track) => (
                    <SettingSelectOption
                        className={styles.settingsPageOption}
                        onClick={() => {
                            onSelect?.(track.id);
                        }}
                        selected={selectedTrack === track.id}
                    >
                        {track.name}
                    </SettingSelectOption>
                ))}
            </ul>
        </div>
    )
}

export default AudioTracksSettings