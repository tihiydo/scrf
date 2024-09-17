import { PageTransitionType } from "./enum"

export function durationToString(seconds?: number) {
    return typeof seconds === 'number'
        ? seconds.toString()
        : (.5).toString()
}

export function parseTransitionTypeString(type?: string): PageTransitionType {
    return typeof type === 'string'
        ? Object.values(PageTransitionType).some(t => t === type) ? type as PageTransitionType : PageTransitionType.None
        : PageTransitionType.None
}