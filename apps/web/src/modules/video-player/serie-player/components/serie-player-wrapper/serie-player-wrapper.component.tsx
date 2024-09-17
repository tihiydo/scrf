'use client';

import { PlayerEvents } from "@/modules/video-player/types/events";
import { HlsConfig } from "hls.js";
import { SeriePlayerProvider, useSerialPlayer } from "../../context";
import { RefObject, useEffect } from "react";
import { observer } from "mobx-react-lite";
import SeriePlayer from "../serie-player/serie-player.component";
import { AccessProvider } from "@/modules/video-player/shared/components/access-provider";

type Props = {
    title: string;
    src: string
    serialImdbid: string;
    episodeImdbid: string;
    hlsConfig: Partial<HlsConfig>;
    coverImg: string;
    containerRef?: RefObject<HTMLDivElement>
    analytics?: boolean;
    autorotate?: boolean;
    watchAccessEnabled?: boolean;
} & PlayerEvents;

const SeriePlayerWrapper = ({ title, src, hlsConfig, onTimeChange, onPlayChange, onViewModeChange, coverImg, containerRef, episodeImdbid, serialImdbid, autorotate, analytics, watchAccessEnabled }: Props) => {

    return (
        <AccessProvider mediaId={episodeImdbid} mediaType="serial" watchAccessEnabled={watchAccessEnabled}>
            <SeriePlayerProvider serialImdbid={serialImdbid} episodeImdbid={episodeImdbid} src={src} title={title}>
                <SeriePlayer
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
            </SeriePlayerProvider>
        </AccessProvider>
    )
}

export default observer(SeriePlayerWrapper)