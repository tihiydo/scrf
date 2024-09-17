export const SettingsPages = {
    Main: 'main',
    Qualities: 'qualities',
    Subtitles: 'subtitles',
    AudioTracks: 'audio-tracks',
    PlaybackRate: 'playback-rate'
} as const;

export type SettingsPages = ObjectValues<typeof SettingsPages>;