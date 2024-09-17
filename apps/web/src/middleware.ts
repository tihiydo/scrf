import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from '@/i18n/config';
import { NextRequest, NextResponse } from "next/server";

// Create the original middleware
const intlMiddleware = createMiddleware({
    defaultLocale: defaultLocale,
    locales,
    localeDetection: false,
    localePrefix: 'as-needed',
});

// Create a wrapper function to log the request and call the original middleware
const loggingMiddleware = async (req: NextRequest) => {

    // Call the original middleware function and get the response
    const response = intlMiddleware(req);

    // Perform any additional operations on the response if needed

    return response;
};

export default loggingMiddleware;

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Enable a redirect to a matching locale at the root
        '/',
        // Set a cookie to remember the previous locale for
        // all requests that have a locale prefix
        '/(en)/:path*',
        // Enable redirects that add missing locales
        // (e.g. `/pathnames` -> `/en/pathnames`)
        '/((?!api|admin|_next|_vercel|.*\\..*).*)'
    ],
};
