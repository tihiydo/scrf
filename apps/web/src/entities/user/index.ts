import { excludeKeysFromObject } from "@/utils";

export enum Subscriptions {
    base = 1,
    middle,
    pro,
  }
  

export type User = {
    id: string;
    email: string;
    userName?: string | null;
    avatarUrl?: string | null;
    subscriptionExpired?: string | null;
    currentSubscription?: Subscriptions | null;
    verified?: string;
    role: UserRole;
    isBanned: boolean;
    createdAt: string;
}

export const UserRole = {
    User: 'User',
    Admin: 'Admin',
    ContentManager: 'content-manager',
    ReviewManager: 'review-manager',
    SalesTeam: 'sales-team'
  } as const;
export type UserRole = ObjectValues<typeof UserRole>;

export const AdminRole = excludeKeysFromObject(UserRole, ['User']) 
export type AdminRole = ObjectValues<typeof AdminRole>;
