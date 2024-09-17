'use client'

import { usePathname, useRouter } from "@/i18n/navigation";
import { safeParseJSON, pickKeysFromObject, excludeKeysFromObject } from "@/utils";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react"
import { z } from "zod";
import { zodKeys, excludingValidator } from "@/lib/zod";
import deepEqual from 'fast-deep-equal'

function searchParamsToObject(params: ReadonlyURLSearchParams) {
    const entries = params.entries()
    const paramsObj: SearchParamsMap = {};

    for (const [key, value] of entries) {
        const parsedValue = safeParseJSON(value);

        paramsObj[key] = parsedValue
    }

    return paramsObj;
}

function objectToSearchParams(params: SearchParamsMap) {
    const map = Object.entries(params).reduce((acc, [key, value]) => {
        if (value == null) {
            return acc
        } else {
            return {
                [key]: value?.toString(),
                ...acc
            }
        }
    }, {});

    return new URLSearchParams(map)
}

type Options<T extends SearchParamsMap> = {
    defaultValues?: T
}


type SupportedParamsValues = string | number | boolean | null | undefined
type SearchParamsMap = Record<string, SupportedParamsValues>

export function useZodSearchParams<T extends z.ZodType<SearchParamsMap>>(schema: T, options: Options<z.infer<T>>) {
    type V = z.infer<T>;

    const schemaKeys = zodKeys(schema);
    const searchParams = useSearchParams();

    // Everytime search params change parses them to object
    const searchParamsObject = useMemo(() => (
        searchParamsToObject(searchParams)
    ), [searchParams])

    // From all search params picks only those which included into schema
    const pickSchemaSearchParams = (searchParamsObject: V) => (
        pickKeysFromObject(schemaKeys, searchParamsObject) as Partial<V>
    )

    const router = useRouter();
    const pathname = usePathname()
    const [searchParamsState, setSearchParamsState] = useState<Partial<V>>({
        ...options.defaultValues,
        ...pickSchemaSearchParams(searchParamsObject)
    });

    useEffect(() => {
        // remove invalid schema fields
        const validatedParams = excludingValidator(schema)(searchParamsObject);

        setSearchParamsState(
            pickSchemaSearchParams({ ...options.defaultValues, ...validatedParams, })
        );
    }, [searchParamsObject]);

    // Sets new value in URL
    const mutateParams = useCallback((cb: (params: SearchParamsMap) => V) => {
        let newValue = cb(searchParamsState);

        const keysToExclude: string[] = [];
        // Get keys where value is equal to default value or undefined
        Object.entries(newValue)
            .map(([key, newValue]) => {
                const defaultValue = options.defaultValues?.[key];

                if (newValue === defaultValue || newValue == null || newValue == '') {
                    keysToExclude.push(key);
                }
            })

        newValue = excludeKeysFromObject(newValue, keysToExclude);

        if (deepEqual(newValue, pickKeysFromObject(schemaKeys, searchParamsObject))) return;


        if (schema.safeParse(newValue).success) {
            const paramsString = objectToSearchParams({
                ...newValue,
                ...excludeKeysFromObject(searchParamsObject, schemaKeys)
            });
            router.replace(`${pathname}${paramsString ? `?${paramsString}` : ''}`, { scroll: false })
        }
    }, [searchParamsObject, router, pathname, schema, options.defaultValues])


    // Actions ==============================================

    const remove = useCallback((key: keyof V) => {
        mutateParams((params) => excludeKeysFromObject(params, [key.toString()]));
    }, [mutateParams])

    const exclude = useCallback((keys: (keyof V)[]) => {
        mutateParams((params) => excludeKeysFromObject(params as V, keys));
    }, [mutateParams])

    const include = useCallback((keys: (keyof V)[]) => {
        mutateParams((params) => pickKeysFromObject(keys, params as V));
    }, [mutateParams])

    const update = useCallback(<K extends keyof V>(key: K, value: V[K]) => {
        mutateParams((params) => ({
            ...params,
            [key]: value
        }));
    }, [mutateParams])

    const merge = useCallback((mergedParams: Partial<V>) => {

        mutateParams(params => {
            return {
                ...params,
                ...mergedParams
            }
        });
    }, [mutateParams])

    const replace = useCallback((mergedParams: Partial<V>) => {
        mutateParams(() => mergedParams);
    }, [mutateParams])

    const clear = useCallback(() => {
        mutateParams(params => excludeKeysFromObject(params, zodKeys(schema)));
    }, [mutateParams, schema])

    return {
        searchParamsState,
        actions: {
            remove,
            update,
            merge,
            clear,
            exclude,
            include,
            replace
        }
    };
}



