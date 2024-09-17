import {  useState } from 'react';
import { Button } from '../ui/button';
import styles from './rename-subtitle-tracks-form.module.scss'
import { message } from 'antd';
import { Select } from '../ui/select';
import { Languages } from '@/constants/langs';
import { PopoverMenu, PopoverRoot, PopoverTrigger } from '../ui/popover';
import { EyeOffIcon, MoreVertical, Trash2Icon, EyeIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { SubtitleTrack, SubtitleTrackKind } from '@/entities/subtitle-track';
import { DeleteSubtitleTrack } from '@/entities/subtitle-track/requests/delete-track';
import { RenameSubtitleTrack } from '@/entities/subtitle-track/requests/rename';
import { ToggleSubtitleTrackVisibility } from '@/entities/subtitle-track/requests/toggle-visibility';
import { GetSubtitleTracks } from '@/entities/subtitle-track/requests/get-tracks';

type Props = {
    track: SubtitleTrack;
}

const RenameForm = ({ track }: Props) => {
    const imdbid = track.mediaKind === SubtitleTrackKind.Episode 
        ? track.episodeId
        : track.mediaKind === SubtitleTrackKind.Movie
            ? track.movieId
            : null
    const queryClient = useQueryClient();
    const [value, setValue] = useState<string | undefined>(track.name);
    const useToggleVisibility = ToggleSubtitleTrackVisibility.useMutation({
        onSuccess: (updated) => {
            if (!imdbid) return;

            message.success(`Subtitle track "${updated.name}" is now ${updated.visible ? 'visible' : 'hidden'}`)
            GetSubtitleTracks.invalidate(queryClient, { imdbid: imdbid })
        }
    });
    const useDeleteSubtitle = DeleteSubtitleTrack.useMutation({
        onSuccess: (updated) => {
            if (!imdbid) return;

            message.success(`Subtitle track "${updated.name}" deleted`)
            GetSubtitleTracks.invalidate(queryClient, { imdbid: imdbid })
        }
    });

    const useRename = RenameSubtitleTrack.useMutation({
        onSuccess: (updated) => {
            if (!imdbid) return;

            message.success(`Subtitle track name changed from "${track.name}" to "${updated.name}"`)
            GetSubtitleTracks.invalidate(queryClient, { imdbid: imdbid })
        }
    })

    const isLoading = useToggleVisibility.isPending || useDeleteSubtitle.isPending || useRename.isPending

    return (
        <div className={styles.container}>

            <div className={styles.renameForm}>
                <Select
                    disabled={isLoading  || useRename.isPending}
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
                            disabled={isLoading || useDeleteSubtitle.isPending}
                            className={styles.actionsMenuItem}
                            onClick={() => {
                                useDeleteSubtitle.mutate({
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