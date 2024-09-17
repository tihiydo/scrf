import { env } from "@/env";
import { action, computed, makeObservable, observable } from "mobx";
import { io, Socket } from "socket.io-client";
import { SOCKET_DENY_ERROR } from "./constants";

export const WatchAccess = {
    Idle: 'idle',
    Granted: 'granted',
    Denied: 'denied'
} as const
export type WatchAccess = ObjectValues<typeof WatchAccess>;

function removeMultipleSlashes(url: string) {
    // Replace multiple slashes (more than one) with a single slash in the URL, except after the protocol (http:// or https://)
    return url.replace(/([^:]\/)\/+/g, '$1');
}

export class WatchAccessStore {
    socket: Maybe<Socket>;
    connected: boolean;
    access: WatchAccess;
    denyCode: Maybe<string>;

    constructor() {
        this.socket = null;
        this.denyCode = null;
        this.access = 'idle';
        this.connected = false;

        makeObservable(this, {
            access: observable,
            connected: observable,
            socket: observable,
            disconnect: action,
            connect: action,
            denyCode: observable,
            isGranted: computed
        })
    }

    manualUngrant() {
        this.socket?.emit('ungrant')
    }

    setAccess(watchAccess: WatchAccess) {
        this.access = watchAccess
    }

    connect(mediaId: string, mediaType: 'serial' | 'movie' | 'live') {
        if (!this.socket) {
            const wsUrl = removeMultipleSlashes(`${env.NEXT_PUBLIC_API_URL}/devices`);
            console.log('connect', wsUrl)
            this.socket = io(wsUrl, {
                path: '/api/socket.io',
                withCredentials: true,
                query: {
                    mediaId,
                    mediaType
                }
            });

            this.socket.connect();

            this.socket.on("connect", () => {
                this.connected = true;
            });


            this.socket.on("disconnect", () => {
                this.connected = false;
                this.access = 'idle'
            });

            this.socket.on("access/granted", () => {
                console.log('access granted')

                this.access = 'granted';
                this.denyCode = null
            });

            this.socket.on("access/denied", (data) => {
                console.log('access denied', data)

                if (data.code === SOCKET_DENY_ERROR.DEVICE_LIMIT) {
                    this.access = 'denied';
                    this.denyCode = data.code
                } else {
                    this.access = 'granted';
                }
            });

            this.socket.connect();
        }


    }

    disconnect() {
        if (this.socket) {
            this.socket?.disconnect()
            this.socket = null;
            this.connected = false;
            this.access = 'idle'
            this.denyCode = null;
        }
    }

    get isGranted() {
        return this.access === 'granted'
    }
}

export const watchAccessStore = new WatchAccessStore();