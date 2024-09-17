'use client'

import { AddButton } from '@/components/add-button'
import classNames from 'classnames'
import styles from './main-section.module.scss'
import { useState } from 'react'
import { Movie } from '@/entities/movie'
import { apiClient } from '@/app/api/client'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { env } from '@/env'
import { usePathname } from '@/i18n/navigation'
import { message } from 'antd'
import { useSession } from '@/session/hooks/use-session'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetMyVote } from '@/api/requests/likes/my-vote'
import { ArrowDownToLine, Plus, Share2, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import ReadMore from './_components/read-more'
import { useResize } from '@/hooks/use-resize'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'
import MobileFilters from './_components/mobile-filters/mobile-filters'
import { observer } from 'mobx-react-lite'

type Props = {
    movie: Movie;
}

const MainSection = ({ movie }: Props) => {
    const session = useSession();
    const pathname = usePathname();
    const { user } = useSession();
    const queryClient = useQueryClient();
    const [isOpened, setIsOpened] = useState(false);
    const sessionStore = useSession()

    const myVoteQuery = useQuery({
        queryKey: ['movie/my-vote', movie.imdbid],
        queryFn: async () => {
            const response = await apiClient<GetMyVote.ResponseData>(`/movies/${movie.imdbid}/my-vote`)

            return response.data
        }
    })

    const getLikesQuery = useQuery({
        queryKey: ['movie/likes', movie.imdbid],
        queryFn: async () => {
            const response = await apiClient<{ likes: number, dislikes: number }>(`/movies/${movie.imdbid}/likes`);
            console.log(response)
            return response.data;
        }
    })

    const [_, copyToClipboard] = useCopyToClipboard();

    const likeMutation = useMutation({
        mutationFn: async () => {
            if (user) {
                const response = await apiClient(`/movies/${movie.imdbid}/like`);

                return response.data;
            } else {
                message.info('Please register to vote')
                throw new Error('Unauthentificated')
            }
        },
        onSuccess: (data: { likes: number, dislikes: number }) => {
            queryClient.setQueryData<{ likes: number, dislikes: number }>(['movie/likes', movie.imdbid], () => ({
                likes: data.likes,
                dislikes: data.dislikes
            }))
            queryClient.invalidateQueries({
                queryKey: ['movie/likes', movie.imdbid]
            })
            queryClient.invalidateQueries({
                queryKey: ['movie/my-vote', movie.imdbid]
            })
        },
        onError: () => {
            console.error('Failed to like the movie');
        }
    })

    const disikeMutation = useMutation({
        mutationFn: async () => {
            if (user) {
                const response = await apiClient(`/movies/${movie.imdbid}/dislike`);

                return response.data;
            } else {
                message.info('Please register to vote')
                throw new Error('Unauthentificated')
            }
        },
        onSuccess: (data: { likes: number, dislikes: number }) => {
            queryClient.setQueryData<{ likes: number, dislikes: number }>(['movie/likes', movie.imdbid], () => ({
                likes: data.likes,
                dislikes: data.dislikes
            }))
            queryClient.invalidateQueries({
                queryKey: ['movie/likes', movie.imdbid]
            })
            queryClient.invalidateQueries({
                queryKey: ['movie/my-vote', movie.imdbid]
            })
        },
        onError: () => {
            console.error('Failed to dislike the movie');
        }
    })

    return (
        <WrapperBlock className={classNames(styles.topMargin, 'container')}>
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
                            await copyToClipboard(env.NEXT_PUBLIC_SITE_URL + pathname)
                            message.success('Link copied')
                        } catch (error) {
                            message.error('Unable to copy the link')
                        }
                    }}
                >
                    <Share2 className={styles.actionsItemIcon} />
                </div>

                {session.status === 'authentificated' ? (
                    <AddButton className={styles.actionsItemIcon} fiction={movie} />
                ) : null}
            </div>

            <div className={styles.info}>
                <div className={styles.description}>
                    <h2 className={styles.descriptionTitle}>Description</h2>
                    <div className={styles.descriptionContent}>{<ReadMore description={movie.description} maxChars={100} />}</div>
                </div>
                <div className={styles.playbackInfo}>
                    {movie.audioTracks?.length ? (<>
                        <div className={styles.playbackInfoItemLeft}>
                            AUDIO TRACKS:
                        </div>
                        <div className={styles.playbackInfoItemRight}>
                            {movie.audioTracks.map(audio => audio.name).join(', ')}
                        </div>
                    </>) : null}

                    {movie.subtitleTracks?.length ? (<>
                        <div className={styles.playbackInfoItemLeft}>
                            SUBTITLES:
                        </div>
                        <div className={styles.playbackInfoItemRight}>
                            {movie.subtitleTracks.map(audio => audio.name).join(', ')}
                        </div>
                    </>) : null}
                </div>
            </div>
        </WrapperBlock>
    )
}

export default observer(MainSection)

