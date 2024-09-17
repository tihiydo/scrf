import axios from 'axios';
import { env } from '@/env';
import https from 'https'

export type PlayerAnalyticsData = {
    type: 'movie' | 'episode';
    audiolang: ExtendString<'unknown'>;
    subslang: ExtendString<'unknown' | 'off'>;
    country: string;
    imdbid: string;
    userid: ExtendString<'unknown'>;
}
export const sendAnalytics = async (args: { data: PlayerAnalyticsData, useBeacon?: boolean }) => {
    const start = Date.now();


    const analyticsData = {
        type: args.data.type,
        imdbid: args.data.imdbid,
        userid: args.data.userid,
        audiolang: args.data.audiolang,
        subslang: args.data.subslang,
        country: args.data.country,
    }

    const url = `${env.NEXT_PUBLIC_ANALYTICS_SERVER_URL}/statistics`
    const formData = new FormData();

    Object.entries(analyticsData).map(([k, v]) => {
        formData.append(k, v)
    })

    if (args.useBeacon && navigator.sendBeacon) {
        const success = navigator.sendBeacon(url, formData);

        return success;
    } else {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        try {

            const response = await axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                httpsAgent: agent, // Use the agent with self-signed certificate approval
            });

            console.log('Analytics response:', response.data);
            return response;
        } catch (error: any) {
            console.error('Analytics error:', error.message);
            // throw error; // Optional: rethrow for caller to handle
        } finally {
            console.log(`Analytics took ${Date.now() - start}ms`);
        }
    }
}