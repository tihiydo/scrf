import { safeParseJSON } from "@/utils";
import { getWindow } from "@/utils/client";
import { useCallback, useEffect, useState } from "react";
import { ZodType } from "zod";

type Options<T> = {
    defaultValue?: T;
};

const window = getWindow();

export function useLocalStorage<const T extends any>(
    path: string,
    schema: ZodType<T>,
    options?: Options<T>,
) {
    const defaultValue = (
        window
            ? safeParseJSON(window.localStorage?.getItem(path) ?? '')
            : {}
    )
        ?? options?.defaultValue;

    const [storageState, setStorageState] = useState<T | undefined | null>(
        schema.safeParse(defaultValue).data,
    );

    useEffect(() => {
        if (!window) return;

        window.addEventListener("storage", function (e) {
            if (e.key === path) {
                const value = JSON.parse(e.newValue ?? "{}")
                const parseResult = schema.safeParse(value)
                setStorageState(parseResult.data);
            }
        });
    }, [path]);

    const setStorageStateHandler = useCallback(
        (value: Partial<T>) => {
            // for other pages
            localStorage?.setItem(
                path,
                JSON.stringify({ ...(storageState ?? {}), ...value }),
            );

            if (typeof storageState === 'object') {
                // for page where state was mutated
                setStorageState({ ...storageState, ...value } as T);
            } else {
                setStorageState(value as T)
            }
        },
        [path, storageState],
    );

    const removeStorageItem = useCallback(
        () => {
            // for other pages
            localStorage?.setItem(
                path,
                JSON.stringify(null),
            );

            // for page where state was mutated
            setStorageState(null);
        },
        [path, storageState]
    )

    return {
        storageState,
        setStorageState: setStorageStateHandler,
        removeStorageState: removeStorageItem
    } as const;
}
