"use client"
import { DownloadData, MoviesData, Resolutions, genres, personality, studios } from '@/types/downloads'

import React, { useEffect, useRef, useState } from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, DatePicker, Select, SelectProps, notification, Checkbox, List, Avatar } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

import 'dayjs/locale/en'
import { apiClient } from '@/app/api/client'
import { Genre } from '@/entities/genre'
import { Studio } from '@/entities/studio'
import { Personality } from '@/entities/pesonality'
import { Movie } from '@/entities/movie'
import { HlsConfig } from 'hls.js'
import { GetMovie } from '@/api/requests/movies/get-one'
import { encryptAes } from '@/utils'
import { AddListFiction } from '@/api/requests/lists/add-fiction'
import { RenameAudioTracksForm } from '@/components/rename-audio-tracks-form'
import { RenameAudioTrack } from '@/entities/audio-track/requests/rename'
import { RenameSubtitleTracksForm } from '@/components/rename-subtitle-tracks-form'
import { GetAudioTracks } from '@/entities/audio-track/requests/get-tracks'
import { GetSubtitleTracks } from '@/entities/subtitle-track/requests/get-tracks'
import { Serial } from '@/entities/serial'
import { Episode } from '@/entities/serial/episode'
import Link from 'next/link'
import styles from './page.module.scss'
import { MoviePlayer } from '@/modules/video-player'

type Props = {
    params: {
        imdbid: string,
        imdbidepisode: string
    }
}

const { TextArea } = Input;

const validateNumber = (_: any, value: string) => {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
        return Promise.reject(new Error('Value must be a number'));
    }
    return Promise.resolve();
};

const openNotification = () => {
    notification.open({
        message: 'Notify',
        description: "Data is saved",
        placement: "bottomRight"
    });
};
    
const EpisodePage = ({params : { imdbidepisode, imdbid }} : Props) =>
{

    const audioTracksQuery = GetAudioTracks.useQuery({
        imdbid: imdbidepisode
    })
    const subtitleTracksQuery = GetSubtitleTracks.useQuery({
        imdbid: imdbidepisode
    })

    const config = useRef({
        backBufferLength: 90,
        enableWorker: false,
    } satisfies Partial<HlsConfig>)
    

    dayjs.locale("en");
    dayjs.extend(customParseFormat)
    dayjs.extend(advancedFormat)
    dayjs.extend(weekday)
    dayjs.extend(localeData)
    dayjs.extend(weekOfYear)
    dayjs.extend(weekYear)
    const [form] = Form.useForm();

    const onFinish = (values: Episode) => {
        if (data == null) return

        values.rating = Number(values.rating);
        values.voteCount = Number(values.voteCount);
        values.imdbid = data.imdbid
        //@ts-ignore
        values.releaseDate = new Date(values.releaseDate.toDate()).toISOString()
    
        apiClient.patch(`/serials/episode/${imdbidepisode}/update`, values)
            .then(data => {
                openNotification()
                push(`/admin/serials-no/${imdbid}`)
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    };

    const { push } = useRouter()
    const [data, setData] = useState<Maybe<Episode>>(null)

    const cryptedTime = encryptAes(Math.round(Date.now() / 1000), "aeskey");
    const backServerUrl = "https://www.scrrenify.icu"
    const movieLink = `${backServerUrl}/${encodeURIComponent(cryptedTime)}/serial/${imdbid}/${data?.season?.position}/${data?.position}/playlist.m3u8`

    const getInfo = async () => {
        const episode = (await apiClient.get<Maybe<Episode>>(`/serials/episode/${imdbidepisode}`)).data;


        setData(episode);
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <div style={{ display: "flex", flexFlow: "column", rowGap: "10px", marginBottom: "35px" }}>
            <div>
                {data &&
                <div>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                ...data,
                                releaseDate: dayjs(data.releaseDate),
                            }}
                            onFinish={onFinish}
                            style={{ display: "flex", flexDirection: "column", rowGap: "15px", width: "650px" }}
                        >
                            <Form.Item
                                name="title"
                                label="Title"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the title!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="portraitImage"
                                label="Photo"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input movie photo!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="slug"
                                label="Slug"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the slug!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="releaseDate"
                                label="Release Date"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the release date!' }]}
                            >
                                <DatePicker format="YYYY-MM-DD" />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Description"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the description!' }]}
                            >
                                <TextArea rows={6} />
                            </Form.Item>
                            <Form.Item
                                name="rating"
                                label="Rating"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the rating!' }, { validator: validateNumber }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item
                                name="voteCount"
                                label="Vote Count"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the imdb vote count!' }, { validator: validateNumber }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "150px", height: "40px" }}>
                                Save
                            </Button>
                        </Form>
                        {(((audioTracksQuery.data?.length || 0) > 0) || ((subtitleTracksQuery.data?.length || 0) > 0)) &&
                            <div style={{ margin: "50px 0 30px 0" }}>
                                <h2 className={styles.titleOther}>Other info</h2>
                                <div style={{ display: "flex", rowGap: "20px", flexFlow: "column" }}>
                                    {
                                        (audioTracksQuery.data?.length || 0) > 0 &&
                                        <div>
                                            <h3 className={styles.titleAudio}>Audio Tracks</h3>
                                            <RenameAudioTracksForm imdbid={data.imdbid} />
                                        </div>
                                    }
                                    {(subtitleTracksQuery.data?.length || 0) > 0 &&
                                        <div>
                                            <h3 className={styles.titleAudio}>Subtitles Files</h3>
                                            <RenameSubtitleTracksForm imdbid={data.imdbid} />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                </div>
                }
            <div style={{ width: '100%', aspectRatio: "16/9", marginTop: "30px" }}>
                {data &&
                <MoviePlayer
                    imdbid={imdbidepisode}
                    hlsConfig={config.current}
                    src={movieLink}
                    title={data.title}
                    coverImg={data.portraitImage}
                    watchAccessEnabled={false}
                />
            }
            </div>
            </div>
        </div>
    )
}

export default EpisodePage;