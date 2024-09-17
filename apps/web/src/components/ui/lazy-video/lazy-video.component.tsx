'use client';

import React, { ComponentProps, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'



type LazyVideoProps = ComponentProps<'video'> & {
    src: string;
}

const LazyVideo = ({ preload, src, ...props }: LazyVideoProps) => {
    console.log('lazy video', src)

    const ref = useRef<HTMLVideoElement>(null)
    const [localUrl, setLocalUrl] = useState<string>('');


    useEffect(() => {
        (async () => {
            console.log('FETCHING_VIDEO', src)

            const response = await fetch(src);
            console.log('VIDEO_FETCHED')

            const blob = await response.blob();
            console.log('VIDEO_BLOB', blob)


            const localUrl = URL.createObjectURL(blob);
            console.log('LOCAL_URL', localUrl)

            setLocalUrl(localUrl);
        })()

    }, [src])

    useEffect(() => {
        ref.current?.load();
        console.log("LOAD_VIDEO", ref.current?.src)

        return () => {
            URL.revokeObjectURL(localUrl)

        }
    }, [localUrl])


    if (!localUrl) return;

    return (
        <video preload={preload ?? 'none'} src={localUrl} ref={ref}  {...props} />
    )
}

export { LazyVideo }
