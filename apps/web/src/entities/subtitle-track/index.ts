
export const SubtitleTrackKind = {
    Episode: 'episode',
    Movie: 'movie',
} as const;
export type SubtitleTrackKind = ObjectValues<typeof SubtitleTrackKind>;


export type SubtitleTrack = {
    id: string;
    originalName: string;
    name: string;
    visible: boolean;
    m3u8Id: string;
    mediaKind: SubtitleTrackKind;
    movieId?: string;
    episodeId?: string;
}