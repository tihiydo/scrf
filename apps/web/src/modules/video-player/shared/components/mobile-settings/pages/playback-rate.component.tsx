import styles from './settings-pages.module.scss'
import { SettingSelectOption } from '../ui/select-option'
import { PlaybackRate, playbackRateOptions } from '../../../stores/playback-store'

type Props = {
    playbackRate: PlaybackRate;
    onSelect?: (arg: PlaybackRate) => void;
}



const PlaybackRateSettings = ({ playbackRate, onSelect }: Props) => {

    return (
        <div>
            <div className={styles.settingsPageHead}>
                <h4 className={styles.settingsPageTitle}>current playback speed</h4>
                <p className={styles.settingsPageSelected}>({playbackRateOptions.find(opt => opt.value === playbackRate)?.name ?? 'Normal'})</p>
            </div>

            <ul className={styles.settingsPageList}>
                {playbackRateOptions.map((opt) => (
                    <SettingSelectOption
                        className={styles.settingsPageOption}
                        onClick={() => {
                            onSelect?.(opt.value);
                        }}
                        selected={playbackRate === opt.value}
                    >
                        {opt.name}
                    </SettingSelectOption>
                ))}
            </ul>
        </div>
    )
}

export default PlaybackRateSettings