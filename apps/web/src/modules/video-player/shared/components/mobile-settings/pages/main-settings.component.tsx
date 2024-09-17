import styles from './settings-pages.module.scss'
import { SettingsBtn } from '../ui/settings-btn'
import { AudioWaveformIcon, SubtitlesIcon, VideoIcon } from 'lucide-react'
import PlaybackIcon from '@/components/icons/playback-icon';
import { QualityIcon } from '../../ui/quality-icon';
import { PlaybackRate, playbackRateOptions } from '../../../stores/playback-store';
import { resolutionQuality } from '../../../stores/levels-store';
import { LevelType } from '../../../types';

type Props = {
    onSelect?: (option: 'quality' | 'playback-rate' | 'audio' | 'subtitles') => void;
    playbackRate?: PlaybackRate;
    activeQualityType?: LevelType;
    activeSubtitle?: string;
    activeAudio?: string;
}

const MainSettings = ({ onSelect, playbackRate, activeQualityType, activeSubtitle, activeAudio }: Props) => {
    return (
        <div className={''}>
            <ul className={styles.mainList}>
                {typeof activeQualityType === 'string' ? (
                    <SettingsBtn
                        className={styles.mainOption}
                        onClick={() => {
                            onSelect?.('quality')
                        }}
                    >
                        <div className={styles.mainOptionInfo}>
                            <QualityIcon className={styles.mainOptionIcon} />

                            <h4 className={styles.mainOptionTitle}>Quality</h4>
                        </div>

                        <div className={styles.mainOptionValue}>
                            {resolutionQuality[activeQualityType]}
                        </div>
                    </SettingsBtn>
                ) : null}

                {typeof activeAudio === 'string' ? (
                    <SettingsBtn
                        className={styles.mainOption}
                        onClick={() => {
                            onSelect?.('audio')
                        }}
                    >
                        <div className={styles.mainOptionInfo}>
                            <AudioWaveformIcon className={styles.mainOptionIcon} />
                            <h4 className={styles.mainOptionTitle}>Audio</h4>
                        </div>

                        <div className={styles.mainOptionValue}>
                            {activeAudio}
                        </div>
                    </SettingsBtn>
                ) : null}

                {typeof activeSubtitle === 'string' ? (
                    <SettingsBtn
                        className={styles.mainOption}
                        onClick={() => {
                            onSelect?.('subtitles')
                        }}
                    >
                        <div className={styles.mainOptionInfo}>
                            <SubtitlesIcon className={styles.mainOptionIcon} />
                            <h4 className={styles.mainOptionTitle}>Subtitles</h4>
                        </div>

                        <div className={styles.mainOptionValue}>
                            {activeSubtitle}
                        </div>
                    </SettingsBtn>
                ) : null}

                {typeof playbackRate === 'number' ? (
                    <SettingsBtn
                        className={styles.mainOption}
                        onClick={() => {
                            onSelect?.('playback-rate')
                        }}
                    >
                        <div className={styles.mainOptionInfo}>
                            <PlaybackIcon className={styles.mainOptionIcon} />
                            <h4 className={styles.mainOptionTitle}>Speed</h4>
                        </div>

                        <div className={styles.mainOptionValue}>
                            {playbackRateOptions.find(opt => opt.value === playbackRate)?.name ?? "Normal"}
                        </div>
                    </SettingsBtn>
                ) : null}
            </ul>
        </div>
    )
}

export default MainSettings