import { User } from "../user";

export type Device = {
    id: string;
    userAgent: string;
    ipAddress: string;
    location?: string;
    blocked: boolean;
    isOnline: string;
    lastSeen: string; // Date string
    user?: User;
}