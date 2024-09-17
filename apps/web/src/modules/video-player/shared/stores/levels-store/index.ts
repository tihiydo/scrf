import { Level } from "hls.js";
import { Resettable } from "..";
import { makeAutoObservable } from "mobx";
import { LevelData, LevelType } from "../../types";



export const resolutionQuality: Record<LevelType, string> = {
    auto: 'Auto',
    "360": '360p',
    "480": '480p',
    "720": '720p',
    "1080": "1080p",
    "2k": 'QHD',
    "4k": 'UHD',
}

export class LevelsControlsStore implements Resettable {
    resolutions: LevelData[];
    isSwitching: boolean;
    activeOption: {
        level: number;
        type: LevelType;
    };

    constructor() {
        this.resolutions = [];
        this.activeOption = {
            level: -1,
            type: 'auto'
        }
        this.isSwitching = false

        makeAutoObservable(this);

    }

    // Resolutions
    setResolutions(resolutions: LevelData[]) {
        this.resolutions = resolutions
    }

    setResolutionOption(resolutionType: Maybe<LevelType>) {
        if (resolutionType === 'auto' || !resolutionType) {
            this.activeOption = {
                level: -1,
                type: 'auto'
            }

            return;
        }

        const resolutionData = this.resolutions.find(resolution => {
            return resolution.type === resolutionType
        })

        if (resolutionData) {
            this.activeOption = {
                level: resolutionData.level,
                type: resolutionData.type
            };
        }

    }

    reset() {
        this.resolutions = [];
        this.activeOption = {
            level: -1,
            type: 'auto'
        }
        this.isSwitching = false
    }
}