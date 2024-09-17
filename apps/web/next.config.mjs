import createNextIntlPlugin from 'next-intl/plugin';


/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    webpack: (config) => {
        // Transform css casing to camelCase
        const rules = config.module.rules
            .find((rule) => typeof rule.oneOf === 'object').oneOf.filter((rule) => Array.isArray(rule.use));
        rules.forEach((rule) => {
            rule.use.forEach((moduleLoader) => {
                if (
                    moduleLoader.loader !== undefined
                    && moduleLoader.loader.includes('css-loader')
                    && typeof moduleLoader.options.modules === 'object'
                ) {
                    moduleLoader.options = {
                        ...moduleLoader.options,
                        modules: {
                            ...moduleLoader.options.modules,
                            exportLocalsConvention: 'camelCase'
                        }
                    };
                }
            });
        });

        return config;
    }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
