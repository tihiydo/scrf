
export const AudioTrackKind = {
    Episode: 'episode',
    Movie: 'movie',
  } as const;
  export type AudioTrackKind = ObjectValues<typeof AudioTrackKind>;
  

export type AudioTrack = {
    id: string;
    name: string;
    originalName: string;
    visible: boolean;
    m3u8Id: string;
    kind: AudioTrackKind;
    movieId?: string;
    episodeId?: string;
}