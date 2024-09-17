import { useModalManager } from '@/hooks/use-modal-manager'
import { SettingsPages } from '../../constants'
import { AudioTracksSettings, MainSettings, PlaybackRateSettings, SubtitlesSettings } from './pages'
import { PlayerDrawer } from '../ui/player-drawer'
import QualitySettings from './pages/qualities.component'
import { PlaybackControlStore } from '../../stores/playback-store'
import { LevelsControlsStore } from '../../stores/levels-store'
import { AudioTrackControls } from '../../stores/audio-tracks-store'
import { SubtitlesControlsStore } from '../../stores/subtitles-store'

type Props = {
    controls: ReturnType<typeof useModalManager<SettingsPages>>;
    stores: {
        playback?: PlaybackControlStore;
        quality?: LevelsControlsStore;
        audio?: AudioTrackControls;
        subtitles?: SubtitlesControlsStore;
    }
}

const MobileSettings = ({ controls: { closeModal, currentModal, openModal }, stores }: Props) => {

    return (
        <>
            <PlayerDrawer
                open={currentModal === SettingsPages.Main}
                onClose={() => closeModal(SettingsPages.Main)}
            >
                <MainSettings
                    activeQualityType={stores.quality ? stores.quality.activeOption.type : undefined}
                    playbackRate={stores.playback ? stores.playback.playbackRate : undefined}
                    activeAudio={stores.audio ? stores.audio?.tracks.find(track => track.id === stores.audio?.activeTrackId)?.name ?? 'Unknown' : undefined}
                    activeSubtitle={stores.subtitles ? stores.subtitles.tracks.find(track => track.id === stores.subtitles?.activeTrack)?.name ?? 'Off' : undefined}
                    onSelect={(opt) => {
                        if (opt === 'quality') {
                            openModal(SettingsPages.Qualities, { delay: 250 })
                        }

                        if (opt === 'audio') {
                            openModal(SettingsPages.AudioTracks, { delay: 250 })
                        }

                        if (opt === 'subtitles') {
                            openModal(SettingsPages.Subtitles, { delay: 250 })
                        }

                        if (opt === 'playback-rate') {
                            openModal(SettingsPages.PlaybackRate, { delay: 250 })
                        }
                    }}
                />
            </PlayerDrawer>

            {stores.quality ? (
                <PlayerDrawer
                    open={currentModal === SettingsPages.Qualities}
                    onClose={() => closeModal(SettingsPages.Qualities)}
                >
                    <QualitySettings
                        activeType={stores.quality.activeOption.type}
                        levels={stores.quality.resolutions}
                        onSelect={(q) => {
                            closeModal()
                            stores.quality?.setResolutionOption(q)
                        }}
                    />

                </PlayerDrawer>
            ) : null}

            {stores.subtitles ? (
                <PlayerDrawer
                    open={currentModal === SettingsPages.Subtitles}
                    onClose={() => closeModal(SettingsPages.Subtitles)}
                >
                    <SubtitlesSettings
                        selectedSubtitle={stores.subtitles.activeTrack}
                        tracks={stores.subtitles.tracks}
                        onSelect={(v) => {
                            closeModal()
                            stores.subtitles?.selectSubtitlesTrack(v)
                        }}
                    />
                </PlayerDrawer>
            ) : null}

            {stores.audio ? (
                <PlayerDrawer
                    open={currentModal === SettingsPages.AudioTracks}
                    onClose={() => closeModal(SettingsPages.AudioTracks)}
                >
                    <AudioTracksSettings
                        onSelect={(v) => {
                            closeModal()
                            stores.audio?.setCurrentAudioTrack(v)
                        }}
                        selectedTrack={stores.audio.activeTrackId}
                        tracks={stores.audio.tracks}
                    />
                </PlayerDrawer>
            ) : null}

            {stores.playback ? (
                <PlayerDrawer
                    open={currentModal === SettingsPages.PlaybackRate}
                    onClose={() => closeModal(SettingsPages.PlaybackRate)}
                >
                    <PlaybackRateSettings
                        playbackRate={stores.playback.playbackRate}
                        onSelect={(pbR) => {
                            closeModal()
                            stores.playback?.setPlaybackRate(pbR)
                        }}
                    />
                </PlayerDrawer>
            ) : null}
        </>
    )
}

export default MobileSettings