import { Movie } from '@/entities/movie'
import React, { useEffect, useRef, useState } from 'react'
import { FilmItem } from '../film-item';
import { message, Modal, Upload } from 'antd';
import { Button } from '@/components/ui/button';
import styles from './film-modal.module.scss'
import { useMutation } from '@tanstack/react-query';
import { sleep } from '@/utils';
import { uploadSingleFile } from '@/app/api/upload/single';
import { AxiosInternalApiError } from '@/types';
import { FileWarningIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { apiClient } from '@/app/api/client';
import { env } from '@/env';

type Props = {
    movie: Movie;
    onSave?: (movie: Movie) => void;
    onRemove?: () => void;
}

const FilmModal = ({
    movie,
    onSave,
    onRemove
}: Props) => {
    const [open, setOpen] = useState(false);
    const [uploadedVideo, setUploadedVideo] = useState(movie.previewVideoUrl || "");
    const videoRef = useRef<HTMLVideoElement>(null);
    const movieMutation = useMutation({
        mutationFn: async (videoUrl: string) => {
            const response = await apiClient.patch<Movie>(`/movies/${movie.imdbid}`, {
                previewVideoUrl: videoUrl,
            });

            return response.data;
        },
        onSuccess: (updatedMovie, videoPath) => {
            setUploadedVideo(videoPath);
            onSave?.(updatedMovie)
        }
    });

    useEffect(() => {
        if (!open) {
            videoRef.current?.pause()
        }
    }, [open])

    return (
        <>
            <FilmItem
                onClick={() => {
                    setOpen(true)
                }}
                isActive={true}
                movie={movie}
                showError={true}
            />
            <Modal
                title={movie.title ?? 'Unknown movie'}
                open={open}
                onCancel={() => {
                    if (movieMutation.isPending) return;
                    setOpen(false)
                }}
                footer={<div className={styles.modalFooter}>
                    <Button
                        variant={'accent-outline'}
                        onClick={() => {
                            setOpen(false)
                            onRemove?.();
                        }}
                    >
                        Remove
                    </Button>

                    <Button
                        variant={'pimary'}
                        onClick={() => {
                            movieMutation.mutate(uploadedVideo)
                        }}
                        disabled={!uploadedVideo || uploadedVideo === movie.previewVideoUrl}
                        isLoading={movieMutation.isPending}
                    >
                        Save
                    </Button>
                </div>
                }
            >
                <div>
                    <Upload

                        onRemove={() => {
                            setUploadedVideo('')
                        }}
                        maxCount={1}
                        accept='video/mp4'
                        listType="text"
                        customRequest={async ({ onError, onSuccess, onProgress, file }) => {
                            const fileFile = file as File;
                            try {
                                const uploadResponse = await uploadSingleFile({
                                    collection: 'movie',
                                    path: [movie.imdbid],
                                    file: fileFile,
                                }, {
                                    onUploadProgress: (e) => {
                                        const percent = Math.floor((e.loaded / (e.total ?? 0)) * 100);

                                        onProgress?.({ percent: percent })
                                    }
                                })

                                onSuccess?.('Preview video uploaded');
                                message.success('Top section video uploaded successfully')

                                setUploadedVideo(uploadResponse.data.path);
                            } catch (error) {
                                const axiosError = error as AxiosInternalApiError;
                                onError?.({
                                    ...axiosError,
                                    message: axiosError.response?.data.message ?? 'Error uploading file',
                                });
                            }
                        }}
                    >
                        <Button variant={'accent-outline'}>
                            <UploadIcon /> Upload
                        </Button>
                    </Upload>
                </div>

                {uploadedVideo ? (
                    <div className={styles.videoPreview} key={uploadedVideo}>
                        <div className={styles.videoPreviewTitleContainer}>
                            <h5 className={styles.videoPreviewTitle}>Preview Video</h5>
                            <Button
                                size={'icon'}
                                variant={'ghost'}
                                disabled={movieMutation.isPending}
                                onClick={() => {
                                    movieMutation.mutate('')
                                }}
                            >
                                <Trash2Icon />
                            </Button>
                        </div>
                        <video ref={videoRef} controls autoPlay className={styles.videoPreviewVideo} >
                            <source src={env.NEXT_PUBLIC_API_URL + uploadedVideo} type="video/mp4" />
                        </video>
                    </div>
                ) : (
                    <div className={styles.notUploaded}>
                        <FileWarningIcon className={styles.notUploadedIcon} />
                        <p className={styles.notUploadedText}>No Video preview</p>
                    </div>
                )}
            </Modal >
        </>
    )
}

export default FilmModal