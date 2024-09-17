import { Level } from "hls.js";
import { LevelData, LevelType } from "../shared/types";

export function getVideoResolution(width: number, height: number): Maybe<LevelType> {
    if (width >= 3840 && height >= 2160) {
        return "4k";
    } else if (width >= 2048 && height >= 1080) {
        return "2k";
    } else if (width >= 1920 && height >= 1080) {
        return "1080";
    } else if (width >= 1280 && height >= 720) {
        return "720";
    } else if (width >= 854 && height >= 480) {
        return "480";
    } else if (width >= 640 && height >= 360) {
        return "360";
    } else {
        return null
    }
}


type LevelWithIndex = Level & { index: number  }
// export function getLevelToRemove(levels: Level[]): Maybe<LevelWithIndex> {
//     const resolutionsMatches: Partial<Record<ResolutionType, boolean>> = {};




//     const level: LevelWithIndex[] = levels
//         .map((level, index) => ({
//             ...level,
//             index: index
//         }))
//         .find((level, index) => {
//             const resolutionType = level.width && level.height
//                 ? getVideoResolution(level.width, level.height)
//                 : null;

//             if (!resolutionType) return true;

//             if (resolutionsMatches[resolutionType]) {
//                 return true;
//             } else {
//                 resolutionsMatches[resolutionType] = true
//             }
//         })


//     return level;
// }

export function formatResolutions(levels: Level[]): LevelData[] {
    const resolutionSort: LevelType[] = ["360", "480", "720", "1080"];

    const formattedResolutions: LevelData[] = levels
        .map((level, index) => {
            const resolutionType = level.width && level.height
                ? getVideoResolution(level.width, level.height)
                : null;

            if (!resolutionType) {
                console.warn('Could not parse resolution for level', level)
                return
            };

            return {
                ...level,
                type: resolutionType,
                level: index,
            } as LevelData;
        })
        .filter(Boolean)

    return formattedResolutions
        // Sort from lowest to highest quality
        .sort((level1, level2) => {
            const index1 = resolutionSort.findIndex(val => level1.type === val)
            const index2 = resolutionSort.findIndex(val => level2.type === val)

            return index1 - index2;
        })
        // Update level index for sorted levels
        .map((level, index) => ({
            ...level,
            level: index
        } as LevelData))
}