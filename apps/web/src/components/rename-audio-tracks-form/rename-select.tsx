import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import styles from './rename-audio-tracks-form.module.scss'
import { AudioTrack, AudioTrackKind } from '@/entities/audio-track';
import { message } from 'antd';
import { RenameAudioTrack } from '@/entities/audio-track/requests/rename';
import { Select } from '../ui/select';
import { Languages } from '@/constants/langs';
import { PopoverMenu, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { EyeOffIcon, MoreVertical, Trash2Icon, EyeIcon } from 'lucide-react';
import { ToggleAudioTrackVisibility } from '@/entities/audio-track/requests/toggle-visibility';
import { DeleteAudioTrack } from '@/entities/audio-track/requests/delete-track';
import { GetAudioTracks } from '@/entities/audio-track/requests/get-tracks';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
    track: AudioTrack;
}

const RenameForm = ({ track }: Props) => {
    const imdbid = track.kind === AudioTrackKind.Episode
        ? track.episodeId
        : track.kind === AudioTrackKind.Movie
            ? track.movieId
            : null
    const queryClient = useQueryClient();
    const [value, setValue] = useState<string | undefined>(track.name);
    const useToggleVisibility = ToggleAudioTrackVisibility.useMutation({
        onSuccess: (updated) => {
            if (!imdbid) return;

            message.success(`Audio track "${updated.name}" is now ${updated.visible ? 'visible' : 'hidden'}`)
            GetAudioTracks.invalidate(queryClient, { imdbid: imdbid })
        }
    });
    const useDeleteAudio = DeleteAudioTrack.useMutation({
        onSuccess: (updated) => {
            if (!imdbid) return;

            message.success(`Audio track "${updated.name}" deleted`)
            GetAudioTracks.invalidate(queryClient, { imdbid: imdbid })
        }
    });

    const useRename = RenameAudioTrack.useMutation({
        onSuccess: (updated) => {
            if (!imdbid) return;

            message.success(`Audio track name changed from "${track.name}" to "${updated.name}"`)
            GetAudioTracks.invalidate(queryClient, { imdbid: imdbid })
        }
    })

    const isLoading = useToggleVisibility.isPending || useDeleteAudio.isPending || useRename.isPending

    return (
        <div className={styles.container}>

            <div className={styles.renameForm}>
                <Select
                    disabled={isLoading || useRename.isPending}
                    className={styles.renameFormSelect}
                    options={
                        [
                            {
                                label: track.originalName,
                                value: track.originalName
                            },
                            ...Languages.map(lang => ({
                                label: lang,
                                value: lang,
                            }))
                        ]
                    }
                    search={{
                        searchPlaceholder: 'Search language'
                    }}
                    value={value}
                    closeOnSelect
                    onChange={(option) => {
                        setValue(option?.value)
                    }}
                    isLoading={useRename.isPending}
                />

                <Button
                    disabled={!value}
                    onClick={() => {
                        if (track.name === value || !value) return;

                        useRename.mutate({
                            id: track.id,
                            newName: value
                        })
                    }}
                    variant={'pimary'}
                    type='button'
                >
                    Save
                </Button>
            </div>
            <PopoverRoot>
                <PopoverTrigger>
                    <Button variant={'ghost'} size={'icon'}>
                        <MoreVertical />
                    </Button>
                </PopoverTrigger>
                <PopoverMenu className={styles.actionsMenu}>
                    <div className={styles.actionsMenuList}>
                        <button
                            disabled={isLoading || useToggleVisibility.isPending}
                            className={styles.actionsMenuItem}
                            onClick={() => {
                                useToggleVisibility.mutate({
                                    id: track.id
                                })
                            }}
                        >
                            {track.visible ? <>
                                <EyeOffIcon /> Hide
                            </> : <>
                                <EyeIcon /> Show
                            </>}
                        </button>

                        <button
                            disabled={isLoading || useDeleteAudio.isPending}
                            className={styles.actionsMenuItem}
                            onClick={() => {
                                useDeleteAudio.mutate({
                                    id: track.id
                                })
                            }}
                        >
                            <Trash2Icon /> Delete
                        </button>
                    </div>
                </PopoverMenu>
            </PopoverRoot>
        </div>
    )
}

export default RenameForm