import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";


export const env = createEnv({
    server: {

    },
    client: {
        NEXT_PUBLIC_SITE_URL: z.string().min(1),
        NEXT_PUBLIC_API_URL: z.string().min(1),
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
        NEXT_PUBLIC_ENVIROMENT: z.union([z.literal("dev"), z.literal("prod")]),
        NEXT_PUBLIC_ANALYTICS_SERVER_URL: z.string(),
        
    },
    clientPrefix: "NEXT_PUBLIC_",

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        NEXT_PUBLIC_ENVIROMENT: process.env.NEXT_PUBLIC_ENVIROMENT,
        NEXT_PUBLIC_ANALYTICS_SERVER_URL: process.env.NEXT_PUBLIC_ANALYTICS_SERVER_URL,
    },
    emptyStringAsUndefined: true,
});