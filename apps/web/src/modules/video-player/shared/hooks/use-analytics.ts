import { useUnmount } from "@/hooks/use-unmount";
import { PlayerAnalyticsData, sendAnalytics } from "../api/statistic";
import { useEffect, useState } from "react";
import useDeepCompareEffect  from 'use-deep-compare-effect'

export function useAnalytics(options: { data: PlayerAnalyticsData, analyticsEnabled?: boolean }) {
    const [analyticsData, setAnalyticsData] = useState<PlayerAnalyticsData>(options.data);

    useDeepCompareEffect(() => {
        setAnalyticsData(options.data)
    }, [options.data])

    useUnmount(() => {
        if (!options.analyticsEnabled) return;
        sendAnalytics({
            data: analyticsData,
            useBeacon: false,
        })
    });

    useEffect(() => {
        const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
            if (!options.analyticsEnabled) return;

            sendAnalytics({
                data: options.data,
                useBeacon: true
            })
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [analyticsData, options.analyticsEnabled])
}