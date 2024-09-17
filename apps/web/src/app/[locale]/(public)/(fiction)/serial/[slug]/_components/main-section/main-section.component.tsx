'use client'

import { AddButton } from '@/components/add-button'
import { DislikeIcon, DownloadIcon, LikeIcon, ShareIcon } from '@/components/icons'
import { ArrowDownToLine, PlusIcon, Share2, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import classNames from 'classnames'
import styles from './main-section.module.scss'
import { useEffect, useState } from 'react'
import { apiClient } from '@/app/api/client'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { message } from 'antd'
import { env } from '@/env'
import { useSession } from '@/session/hooks/use-session'
import { GetOneSerial } from '@/api/requests/serials/get-one-serial'
import ReadMore from '../../../../movie/[slug]/_components/main-section/_components/read-more'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetMyVote } from '@/api/requests/likes/my-vote'
import { observer } from 'mobx-react-lite'

type Props = {
    serial: GetOneSerial.ResponseData;
}

const MainSection = ({ serial }: Props) => {
    useEffect(() => {
        getLikes()
    }, [])
    const session = useSession();
    const [likes, setLikes] = useState<number>(0)
    const [dislikes, setDislikes] = useState<number>(0)
    const { user } = useSession();
    const queryClient = useQueryClient();

    const getLikes = async () => {
        try {
            const response = await apiClient(`/serials/${serial.imdbid}/likes`);
            if (response.data) {
                setLikes(response.data.likes);
                setDislikes(response.data.dislikes);
            } else {
                console.error('Failed to like the movie');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const myVoteQuery = useQuery({
        queryKey: ['serials/my-vote', serial.imdbid],
        queryFn: async () => {
            const response = await apiClient<GetMyVote.ResponseData>(`/serials/${serial.imdbid}/my-vote`)

            return response.data
        }
    })

    const getLikesQuery = useQuery({
        queryKey: ['serials/likes', serial.imdbid],
        queryFn: async () => {
            const response = await apiClient<{ likes: number, dislikes: number }>(`/serials/${serial.imdbid}/likes`);
            console.log(response)
            return response.data;
        }
    })

    const [_, copyToClipboard] = useCopyToClipboard();

    const likeMutation = useMutation({
        mutationFn: async () => {
            if (user) {
                const response = await apiClient(`/serials/${serial.imdbid}/like`);

                return response.data;
            } else {
                message.info('Please register to vote')
                throw new Error('Unauthentificated')
            }
        },
        onSuccess: (data: { likes: number, dislikes: number }) => {
            queryClient.setQueryData<{ likes: number, dislikes: number }>(['serials/likes', serial.imdbid], () => ({
                likes: data.likes,
                dislikes: data.dislikes
            }))
            queryClient.invalidateQueries({
                queryKey: ['serials/likes', serial.imdbid]
            })
            queryClient.invalidateQueries({
                queryKey: ['serials/my-vote', serial.imdbid]
            })
        },
        onError: () => {
            console.error('Failed to like the serials');
        }
    })

    const disikeMutation = useMutation({
        mutationFn: async () => {
            if (user) {
                const response = await apiClient(`/serials/${serial.imdbid}/dislike`);

                return response.data;
            } else {
                message.info('Please register to vote')
                throw new Error('Unauthentificated')
            }
        },
        onSuccess: (data: { likes: number, dislikes: number }) => {
            queryClient.setQueryData<{ likes: number, dislikes: number }>(['serials/likes', serial.imdbid], () => ({
                likes: data.likes,
                dislikes: data.dislikes
            }))
            queryClient.invalidateQueries({
                queryKey: ['serials/likes', serial.imdbid]
            })
            queryClient.invalidateQueries({
                queryKey: ['serials/my-vote', serial.imdbid]
            })
        },
        onError: () => {
            console.error('Failed to dislike the movie');
        }
    })



    return (

        <WrapperBlock className={classNames('container', styles.topMargin)}>
            <div className={styles.actions}>
                <div
                    onClick={() => likeMutation.mutate()}
                    className={classNames(styles.actionsItem, styles.vote, myVoteQuery.data?.vote === 'liked' ? styles.likedActive : '')}
                >
                    <ThumbsUpIcon className={classNames(styles.likedIcon, styles.actionsItemIcon, myVoteQuery.data?.vote === 'liked' ? styles.likedIconActive : '')} />
                    <p className={styles.voteValue}>
                        {getLikesQuery.data?.likes ?? 0}
                    </p>
                </div>
                <div
                    onClick={() => disikeMutation.mutate()}
                    className={classNames(styles.actionsItem, styles.vote, myVoteQuery.data?.vote === 'disliked' ? styles.dislikedActive : '')}
                >
                    <ThumbsDownIcon className={classNames(styles.dislikedIcon, styles.actionsItemIcon, myVoteQuery.data?.vote === 'disliked' && styles.dislikedIconActive)} />

                    <p className={styles.voteValue}>
                        {getLikesQuery.data?.dislikes ?? 0}
                    </p>
                </div>
                <div
                    className={styles.actionsItem}
                    onClick={async () => {
                        message.info('Coming soon')
                    }}
                >
                    <ArrowDownToLine className={styles.actionsItemIcon} />
                </div>
                <div
                    className={styles.actionsItem}
                    onClick={async () => {
                        try {
                            await copyToClipboard(env.NEXT_PUBLIC_SITE_URL + `/serial/${serial.imdbid}`)
                            message.success('Link copied')
                        } catch (error) {
                            message.error('Unable to copy the link')
                        }
                    }}
                >
                    <Share2 className={styles.actionsItemIcon} />
                </div>

                {session.status === 'authentificated' ? (
                    <div
                        className={styles.actionsItem}
                    >
                        <AddButton fiction={serial} className={styles.actionsItemIcon} />
                    </div>
                ) : null}
            </div>

            <div className={styles.info}>
                <div className={styles.description}>
                    <h2 className={styles.descriptionTitle}>Description</h2>
                    <div className={styles.descriptionContent}>{<ReadMore description={serial.description} maxChars={100} />}</div>
                </div>
                <div className={styles.playbackInfo}>
                    {serial.audioTracks?.length ? (<>
                        <div className={styles.playbackInfoItemLeft}>
                            AUDIO TRACKS:
                        </div>
                        <div className={styles.playbackInfoItemRight}>
                            {serial.audioTracks.map(audio => audio.name).join(', ')}
                        </div>
                    </>) : null}

                    {serial.subtitleTracks?.length ? (<>
                        <div className={styles.playbackInfoItemLeft}>
                            SUBTITLES:
                        </div>
                        <div className={styles.playbackInfoItemRight}>
                            {serial.subtitleTracks.map(audio => audio.name).join(', ')}
                        </div>
                    </>) : null}
                </div>
            </div>
        </WrapperBlock>
    )
}

export default observer(MainSection)