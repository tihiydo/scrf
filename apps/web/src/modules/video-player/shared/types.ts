import { Level } from "hls.js";

export type ActiveSubtitle = number | 'off';

export type LevelType = 'auto' | '360' | '480' | '720' | '1080' | '2k' | '4k'
export type LevelData = Level & LevelMeta;
export type LevelMeta = {
    type: LevelType;
    level: number;
}
