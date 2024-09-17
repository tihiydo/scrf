

export function isNativeMobileAppUser(userAgent: string) {
    const appId = 'ScreenifyMobileApp';
    const agentAppId = userAgent.split('#').at(-1);

    return !!agentAppId?.startsWith(appId)
}