import { LanguageCodes } from "@/constants/iso-639";
import { AudioTrack } from "@/entities/audio-track";
import { SubtitleTrack } from "@/entities/subtitle-track";
import { MediaPlaylist } from "hls.js";

function matchMediaLanguageCode(mediaPlaylist: MediaPlaylist) {
    let subtitleTrack = mediaPlaylist;

    const langValueFromLang = LanguageCodes[mediaPlaylist.lang as keyof typeof LanguageCodes] ?? Object.values(LanguageCodes).find(lang => lang.toLowerCase() === mediaPlaylist.lang?.toLowerCase());
    if (langValueFromLang) {
        subtitleTrack = {
            ...subtitleTrack,
            lang: langValueFromLang,
            name: langValueFromLang
        }
    }

    const langValueFromName = LanguageCodes[mediaPlaylist.name as keyof typeof LanguageCodes] ?? Object.values(LanguageCodes).find(lang => lang.toLowerCase() === mediaPlaylist.name?.toLowerCase())
    if (langValueFromName) {
        subtitleTrack = {
            ...subtitleTrack,
            lang: langValueFromName,
            name: langValueFromName
        }
    }

    return subtitleTrack;
}


export function matchSubtitleTracksName(playlists: MediaPlaylist[], subtitiles: SubtitleTrack[]) {
    const filteredItems = playlists.map((playlist) => {
        let subtitleTrack = matchMediaLanguageCode(playlist)
        const dbSubtitleTrack = subtitiles.find(track => playlist.url.endsWith(track.m3u8Id))
        if (dbSubtitleTrack) {
            subtitleTrack = {
                ...subtitleTrack,
                name: dbSubtitleTrack.name
            }

            if (!dbSubtitleTrack.visible) return null;
        } else {
            return null;
        }

        return subtitleTrack;
    })
        .filter(playlist => playlist != null)
        .sort((a, b) => {
            if (a !== null && b !== null) {
                const startsWithEnglishA = a.name.toLowerCase().startsWith('english');
                const startsWithEnglishB = b.name.toLowerCase().startsWith('english');

                if (startsWithEnglishA && !startsWithEnglishB) {
                    return -1;
                }
                if (!startsWithEnglishA && startsWithEnglishB) {
                    return 1;
                }
                return a.name.localeCompare(b.name);
            } return 1
        }
        );

    return filteredItems;
}

export function matchAudioTracksName(playlists: MediaPlaylist[], audioTracks: AudioTrack[]) {
    const filteredItems = playlists.map((playlist) => {
        let audioTrack = matchMediaLanguageCode(playlist)
        const dbAudioTrack = audioTracks.find(track => playlist.url.endsWith(track.m3u8Id))

        if (dbAudioTrack) {
            audioTrack = {
                ...audioTrack,
                name: dbAudioTrack.name
            }
            if (!dbAudioTrack.visible) return null;
        } else {
            return null;
        }


        return audioTrack;
    })
        .filter(playlist => playlist != null)
        .sort((a, b) => {
            if (a !== null && b !== null) {
                const startsWithEnglishA = a.name.toLowerCase().startsWith('english');
                const startsWithEnglishB = b.name.toLowerCase().startsWith('english');

                if (startsWithEnglishA && !startsWithEnglishB) {
                    return -1;
                }
                if (!startsWithEnglishA && startsWithEnglishB) {
                    return 1;
                }
                return a.name.localeCompare(b.name);
            } return 1
        });


    return filteredItems;
}