import { User } from "@/entities/user";
import { refreshJWTToken } from "./client";


export namespace RefreshJWT {
    export const url = '/auth/refresh'
    export const method = 'POST';

    
    export const clientFetch = refreshJWTToken;
    
    export type ResponseData = User
}