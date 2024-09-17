'use client';

import { PlayerEvents } from "@/modules/video-player/types/events";
import { HlsConfig } from "hls.js";
import { LiveStreamPlayerProvider } from "../../context";
import { RefObject } from "react";
import { observer } from "mobx-react-lite";
import { LiveStreamPlayer } from "../live-stream-player";
import { AccessProvider } from "@/modules/video-player/shared/components/access-provider";

type Props = {
    title: string;
    src: string
    hlsConfig: Partial<HlsConfig>;
    coverImg: string;
    containerRef?: RefObject<HTMLDivElement>
    autorotate?: boolean;
    watchAccessEnabled?: boolean;
} & PlayerEvents;

const LiveStreamPlayerWrapper = ({ title, src, hlsConfig, onPlayChange, onViewModeChange, coverImg, containerRef, autorotate, watchAccessEnabled }: Props) => {
    return (
        <AccessProvider mediaId={'live-stream'} mediaType="live" watchAccessEnabled={watchAccessEnabled}>
            <LiveStreamPlayerProvider src={src} title={title}>
                <LiveStreamPlayer
                    autorotate={autorotate}
                    containerRef={containerRef}
                    title={title}
                    coverImg={coverImg}
                    src={src}
                    hlsConfig={hlsConfig}
                    onPlayChange={onPlayChange}
                    onViewModeChange={onViewModeChange}
                />
            </LiveStreamPlayerProvider>
        </AccessProvider>
    )
}

export default observer(LiveStreamPlayerWrapper)