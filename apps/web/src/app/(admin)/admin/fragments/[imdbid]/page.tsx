"use client"
import { DownloadData, Resolutions } from '@/types/downloads'
import { Button } from 'antd'
import React, { use, useEffect, useState } from 'react'
import ReactHlsPlayer from 'react-hls-player'
import { json } from 'stream/consumers'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/app/api/client'

type Props = {
    params:
    {
        imdbid: string
    }
}

const PreviewMovie = ({params}: Props) => 
{
    const { push } = useRouter()
    const allow = async () =>
    {
        apiClient.patch(`downloads/${params.imdbid}`, {declined: false})
        push("/admin/fragments")
    }

    const decline = async () =>
    {
        apiClient.patch(`downloads/${params.imdbid}`, {declined: true})
        push("/admin/fragments")
    }

    const getInfo = async () =>
    {
        const response = await apiClient.get(`downloads/${params.imdbid}`) as DownloadData
        setData(response)
    }
    
    const [data, setData] = useState<DownloadData>()
    const [resolution, setResolution] = useState<number>(360)
    useEffect(() =>
    {
        getInfo()
    },
    [])

    const playerRef = React.useRef<HTMLVideoElement>(null);
    return (
        <div>
            <div>
                <h1>{data?.title}</h1>
                <p style={{color: "gray"}}>IM.DB ID: {data?.imdbid}</p>
                
            </div>
            <div style={{marginTop: "10px"}}>
                <div style={{display: "flex", columnGap: "10px",  padding: "15px  15px 15px", backgroundColor: "black", width: "640px"}}>
                    {Resolutions.map((el) =>
                    {
                        return (
                            <div key={el} onClick={() => {setResolution(el)}} style={{ cursor: "pointer", display: "flex", borderRadius: "6px", justifyContent: "center", alignItems: "center", width: 70, height: "30px", backgroundColor: `${resolution == el ? "#560000" : "red"}`, color: "white"}}>
                                {el}
                            </div>
                        )
                    })}
                </div>
                <ReactHlsPlayer
                    playerRef={playerRef}
                    src={`http://185.165.240.155/movie/${data?.imdbid}/${resolution}/playlist.m3u8`}
                    autoPlay={false}
                    controls={true}
                    width="640"
                    height="360"
                />
            </div>
            <div style={{display: "flex", justifyContent: "space-between", margin: "15px 0 35px 0"}}>
                <Button style={{height: "60px", width: "120px", color: "red", borderColor: "red"}} onClick={decline}>Decline</Button>
                <Button style={{height: "60px", width: "120px", color: "green", borderColor: "green"}} onClick={allow}>Allow</Button>
            </div>
        </div>
    )
}

export default PreviewMovie;