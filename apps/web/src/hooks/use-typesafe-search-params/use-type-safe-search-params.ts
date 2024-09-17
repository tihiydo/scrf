

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchParametersSerializer } from "./utils";
import { ZodType } from "zod";
import deepEqual from 'fast-deep-equal'


export function useTypesafeSearchParams<T extends Record<string, any>>(schema: { [K in keyof T]: ZodType<T[K]> }) {
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const router = useRouter();
    const [isSynced, setIsSynced] = useState(true);

    const parseSearchParams = () => {
        const searchParamsEntries: Array<[string, string]> = []
        searchParams.forEach((v, k) => searchParamsEntries.push([k, v]))

        const map = searchParamsEntries.reduce((acc, [key, value]) => {
            const parsedValue = SearchParametersSerializer.deserialize(value);
            const paramSchema = schema[key];
            if (!paramSchema) return acc;


            const { success, data } = paramSchema.safeParse(parsedValue)

            if (!success) return acc;

            return {
                ...acc,
                [key]: data
            }
        }, {})

        return map as T;
    }

    const [parsedParams, setParsedParams] = useState<T>(parseSearchParams());

    useEffect(() => {
        setIsSynced(true);
    }, [searchParams])

    const setNewParams = (params: T) => {
        const map = Object.entries(params).reduce((acc, [key, value]) => {
            const serializedValue = SearchParametersSerializer.serialize(value);
            if (!serializedValue) return acc;

            return {
                ...acc,
                [key]: serializedValue
            }
        }, {});

        

        const stringSearchParams = new URLSearchParams(map).toString()

        if (deepEqual(parsedParams, params)) return;
        setParsedParams(params)
        setIsSynced(false);

        router.push(pathname + `${stringSearchParams ? `?${stringSearchParams}` : ''}`, { scroll: false })
    }

    return [parsedParams, setNewParams, isSynced] as const;
}