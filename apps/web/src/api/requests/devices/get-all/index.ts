import { Device } from "@/entities/devices";
import { QueryKey } from "@tanstack/react-query";
import { useDevices } from "./use-query";


export namespace GetAllDevices {
    export const url = '/devices'
    export const method = 'GET';
    export const queryKey: QueryKey = ['devices/me']

    export const useQuery = useDevices

    export type ResponseData = {
        devices: Device[];
    }
}