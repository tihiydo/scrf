"use client"
import { DownloadData, MoviesData, Resolutions, genres, personality, studios } from '@/types/downloads'

import React, { useEffect, useRef, useState } from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, DatePicker, Select, SelectProps, notification, Checkbox, List, Avatar, message, Spin } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import { Button as ButtonModify } from '@/components/ui/button'
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
import { EpisodesSection } from './_components/episodes-section'
import { Servers } from '@/entities/servers'

type Props = {
    params: {
        imdbid: string
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

const EditMovie = ({ params: { imdbid } }: Props) => {
    dayjs.locale("en");
    dayjs.extend(customParseFormat)
    dayjs.extend(advancedFormat)
    dayjs.extend(weekday)
    dayjs.extend(localeData)
    dayjs.extend(weekOfYear)
    dayjs.extend(weekYear)
    const [form] = Form.useForm();

    const onFinish = (values: MoviesData) => {
        if (data == null) return

        values.rating = Number(values.rating);
        values.voteCount = Number(values.voteCount);
        values.imdbid = data.imdbid
        //@ts-ignore
        values.releaseDate = new Date(values.releaseDate.toDate())
        //@ts-ignore
        values.addedAt = new Date(values.addedAt.toDate())

        values.genres = values.genres.map((item: any) => item.value || item);
        values.studios = values.studios.map((item: any) => item.value || item)

        apiClient.patch(`/serials/${imdbid}/update`, values)
            .then(data => {
                openNotification()
                getInfo()
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const { push } = useRouter()
    const [options, setOptions] = useState<{ studios: SelectProps['options'], genres: SelectProps['options'] }>({ studios: [], genres: [] });
    const [data, setData] = useState<Maybe<Serial>>(null)
    const [servers, setServers] = useState<Servers>([])

    const getInfo = async () => {
        const serial = (await apiClient.get<Maybe<Serial>>(`/serials/${imdbid}/one`)).data;
        const genresFetch = (await apiClient.get<Genre[]>(`/genres`)).data;
        const studiosFetch = (await apiClient.get<Studio[]>(`/studios`)).data;
        const getServers = (await apiClient.get<Servers>('/fictions/fragments-servers')).data;
        setServers(getServers)

        const uniqueOptions = (dataList: any[], key: string) => {
            const map = new Map();
            dataList.forEach(item => map.set(item[key], item));
            return Array.from(map.values());
        };

        const genres = uniqueOptions([...(serial?.fiction?.genres ?? []), ...genresFetch], 'id').map((el) => ({
            label: el.genreName,
            value: el.id, 
        }));

        const studios = uniqueOptions([...(serial?.fiction?.studios ?? []), ...studiosFetch], 'imdbid').map((el) => ({
            label: el.studioName,
            value: el.imdbid,
        }));

        setOptions({ genres, studios });
        setData(serial);
    }

    useEffect(() => {
        getInfo()
    }, [])

    const [nowInSearch, setNowInSearch] = useState(false)
    const findResource = async (data: Serial) => {
        if (nowInSearch === false) {
            setNowInSearch(true);
            const server = (await apiClient.post("/fictions/magic-find", { kind: "serial", imdbid: data.imdbid })).data as { serverId: number | undefined }
            setNowInSearch(false);

            if (server.serverId === undefined) {
                message.error("Can't find server")
            }
            else {
                message.success("Server find")
            }
            return server.serverId;
        }
    };

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
                                serverId: data.fiction?.server?.id,
                                slug: data.fiction?.slug,
                                checked: data.fiction?.checked,
                                releaseDate: dayjs(data.releaseDate),
                                addedAt: dayjs(data.addedAt),
                                genres: data.fiction?.genres?.map((el) => {
                                    return { label: el.genreName, value: el.id }
                                }),
                                studios: data.fiction?.studios?.map((el) => {
                                    return { label: el.studioName, value: el.imdbid }
                                })
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
                                <DatePicker />
                            </Form.Item>
                            <Form.Item
                                name="addedAt"
                                label="Added Date"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input the release date!' }]}
                            >
                                <DatePicker />
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
                                name="fullDescription"
                                label="Full Description"
                                style={{ marginBottom: 0 }}
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
                            <Form.Item
                                name="genres"
                                label="Select genres"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input writers' }]}
                            >
                                <Select
                                    mode="multiple"
                                    size="middle"
                                    style={{
                                        width: '100%',
                                    }}
                                    options={options.genres}
                                    filterOption={(input, option) => {
                                        const keyMatches = String(option?.value).toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        const titleMatches = String(option?.label).toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        return keyMatches || titleMatches;
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="studios"
                                label="Select studios"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Please input studios' }]}
                            >
                                <Select
                                    mode="multiple"
                                    size="middle"
                                    style={{
                                        width: '100%',
                                    }}
                                    options={options.studios}
                                    filterOption={(input, option) => {
                                        const keyMatches = String(option?.value).toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        const titleMatches = String(option?.label).toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        return keyMatches || titleMatches;
                                    }}
                                />
                            </Form.Item>
                            {/* <div style={{ display: "flex", columnGap: "20px" }}>
                                <Form.Item
                                    name="serverId"
                                    label="Select server"
                                    style={{ marginBottom: 0 }}
                                    rules={[{ required: true, message: 'Please input server' }]}
                                >
                                    <Select
                                        size="middle"
                                        style={{
                                            width: '200px',
                                        }}
                                        options={servers.map((el) => {
                                            return {
                                                label: `Server ${el.id}`,
                                                value: el.id
                                            }
                                        })}
                                    />
                                </Form.Item>
                                <ButtonModify variant={"accent-outline"} type="button" onClick={async () => {
                                    const serverId = await findResource(data)
                                    if (serverId) {
                                        form.setFieldValue("serverId", serverId)
                                    }
                                }}
                                    style={{ fontWeight: 100, height: "33px", width: "124px", fontSize: "15px", alignSelf: "end" }}>
                                    {nowInSearch
                                        ?
                                        <Spin size="small" />
                                        :
                                        "MAGIC FIND"
                                    }
                                </ButtonModify>
                            </div> */}
                            <Form.Item
                                name="checked"
                                label="Сhecked or no"
                                valuePropName='checked'
                                style={{ marginBottom: 0 }}
                            >
                                <Checkbox></Checkbox>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: "150px", height: "40px" }}>
                                Save
                            </Button>
                        </Form>
                    </div>
                }
            </div>
            {data &&
                <div style={
                    { maxWidth: "80%", marginTop: "30px", borderRadius: "10px", padding: "20px", borderColor: "gray", borderStyle: "dashed", borderWidth: "1px" }}>
                    <EpisodesSection serial={data}></EpisodesSection>
                </div>
            }
        </div>
    )
}

export default EditMovie;
