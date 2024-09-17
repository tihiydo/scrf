'use client'

import { makeObservable, runInAction, computed, action, observable, } from "mobx";
import { ACCESS_TOKEN_KEY } from '@/constants/jwt';
import { AdminRole, User } from '@/entities/user';
import { apiClient } from '@/app/api/client';
import { UNAUTHORIZED_WATCH_ACCESS_TIMEOUT } from "./constants";
import { sleep } from "@/utils";

export type SessionStatus = 'idle' | 'loading' | 'authentificated' | 'unauthentificated';
class SessionStore {
    user: Maybe<User>;
    status: SessionStatus;
    isModalShowed: boolean;


    constructor() {
        this.status = 'idle'
        this.user = null
        this.isModalShowed = true;

        makeObservable(this, {
            status: observable,
            user: observable,
            isModalShowed: observable,
            loadUser: action,
            toggleModal: action,
            getCookieValue: action,
            isInitialized: computed,
            isAdmin: computed,
            isSubscriptionValid: computed,
            canWatch: action
        });
    }

    getCookieValue(cookieName: string): Maybe<string> {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === cookieName) {
                return value;
            }
        }
        return null;
    }

    async loadUser(): Promise<Maybe<User>> {
        const accessToken = this.getCookieValue(ACCESS_TOKEN_KEY);

        if (accessToken) {
            try {
                runInAction(() => {
                    this.status = 'loading'
                });

                const response = await apiClient.get<User>(`/users/me`)
                if (!response.data.id) {
                    runInAction(() => {
                        this.status = 'unauthentificated'
                    });
                    return null;
                }
                else {
                    runInAction(() => {
                        this.user = response.data;
                        this.status = 'authentificated'
                    });
                    return response.data;
                }
            } catch (error: any) {
                runInAction(() => {
                    this.status = 'unauthentificated'
                });
                return null;
            }

        } else {
            runInAction(() => {
                this.status = 'unauthentificated'
            });

            return null
        }
    }

    get isSubscriptionValid() {
        if (this.isAdmin) return true;

        const hasSubscription: boolean = !!this.user?.currentSubscription
        const isSubscriptionExpired: boolean = this.user?.subscriptionExpired
            ? Date.now() > new Date(this.user.subscriptionExpired).getTime()
            : true


        return hasSubscription && !isSubscriptionExpired;
    }

    canWatch(ttm: number): boolean {
        const isTtmExpired: boolean = ttm > UNAUTHORIZED_WATCH_ACCESS_TIMEOUT

        if (isTtmExpired) {
            return this.isSubscriptionValid
        }

        return true;
    }

    get isAdmin() {
        return Object.values(AdminRole).some(r => r === this.user?.role)
    }

    get isInitialized() {
        return this.status === 'authentificated' || this.status === 'unauthentificated'
    }

    toggleModal() {
        this.isModalShowed = !this.isModalShowed;
    }
}

export const sessionStore = new SessionStore();
