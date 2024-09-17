'use client';

import { PlayerEvents } from "@/modules/video-player/types/events";
import { HlsConfig } from "hls.js";
import { MoviePlayerProvider } from "../../context";
import { RefObject } from "react";
import { observer } from "mobx-react-lite";
import MoviePlayerComponent from "../movie-player/movie-player.component";
import { AccessProvider } from "@/modules/video-player/shared/components/access-provider";


type Props = {
    title: string;
    src: string
    imdbid: string;
    hlsConfig: Partial<HlsConfig>;
    coverImg: string;
    containerRef?: RefObject<HTMLDivElement>
    analytics?: boolean;
    autorotate?: boolean;
    watchAccessEnabled?: boolean;
} & PlayerEvents;

const MoviePlayerWrapper = ({ title, src, imdbid, hlsConfig, onTimeChange, onPlayChange, onViewModeChange, coverImg, containerRef, analytics = false, watchAccessEnabled = true, autorotate }: Props) => {

    return (
        <AccessProvider mediaId={imdbid} mediaType="movie" watchAccessEnabled={watchAccessEnabled}>
            <MoviePlayerProvider imdbid={imdbid} src={src} title={title}>
                <MoviePlayerComponent
                    autorotate={autorotate}
                    analytics={analytics}
                    containerRef={containerRef}
                    title={title}
                    coverImg={coverImg}
                    src={src}
                    hlsConfig={hlsConfig}
                    onPlayChange={onPlayChange}
                    onTimeChange={onTimeChange}
                    onViewModeChange={onViewModeChange}
                />
            </MoviePlayerProvider>
        </AccessProvider>
    )
}

export default observer(MoviePlayerWrapper)