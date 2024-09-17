import { Subscriptions } from "../user";

export type SubscriptionHistoryItem = {
    id: string;
    price: number;
    type: Subscriptions;
    createdAt: string;
}