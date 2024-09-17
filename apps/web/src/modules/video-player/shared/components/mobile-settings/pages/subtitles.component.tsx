import { MediaPlaylist } from 'hls.js'
import styles from './settings-pages.module.scss'
import { ActiveSubtitle } from '../../../types';
import { SettingSelectOption } from '../ui/select-option';

type Props = {
    selectedSubtitle: ActiveSubtitle;
    tracks: MediaPlaylist[];
    onSelect?: (selected: ActiveSubtitle) => void;
}

const SubtitlesSettings = ({ selectedSubtitle, tracks, onSelect }: Props) => {
    return (
        <div>
            <div className={styles.settingsPageHead}>
                <h4 className={styles.settingsPageTitle}>Current subtitles</h4>
                <p className={styles.settingsPageSelected}>({tracks.find(track => track.id === selectedSubtitle)?.name ?? 'Off'})</p>
            </div>

            <ul className={styles.settingsPageList}>
                <SettingSelectOption
                    className={styles.settingsPageOption}
                    onClick={() => {
                        onSelect?.('off');
                    }}
                    selected={selectedSubtitle === 'off'}
                >
                    Off
                </SettingSelectOption>

                {tracks.map((track) => (
                    <SettingSelectOption
                        className={styles.settingsPageOption}
                        onClick={() => {
                            onSelect?.(track.id);
                        }}
                        selected={selectedSubtitle === track.id}
                    >
                        {track.name}
                    </SettingSelectOption>
                ))}
            </ul>
        </div>
    )
}

export default SubtitlesSettings