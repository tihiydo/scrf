export const SOCKET_DENY_ERROR = {
    // Socket cannot be granted because of subscription plan limit
    DEVICE_LIMIT: 'device-limit',

    // Socket unauthentificated or device was not registered
    UNAUTHENTIFICATED: 'unauthentificated',

    INVALID_SUBSCRIPTION: 'invalid-subscription',

    // Handshake query params had no "mediaId" field
    NO_MEDIA_ID: 'no-media-id',

    OTHER: 'other',
} as const;

export type SOCKET_DENY_ERROR = ObjectValues<typeof SOCKET_DENY_ERROR>
