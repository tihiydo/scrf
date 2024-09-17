import { UserRole } from "@/entities/user";
import { AxiosError } from "axios";

export type AxiosInternalApiError = AxiosError<Partial<{
    error: string;
    code: number;
    message: string;
}>>

export type RouteAccess = UserRole[] | '*' | 'protected'