import { excludeKeysFromObject } from "@/utils";
import { useCallback, useState } from "react"

export const useObjectState = <T extends Record<string, any>>(defaultValue: Partial<T>) => {
    const [state, setState] = useState<Partial<T>>(defaultValue);


    const remove = useCallback((arg: keyof T | Array<keyof T>) => {
        setState((state) => {

            const keys = arg instanceof Array
                ? arg
                : [arg]

            return {
                ...excludeKeysFromObject(state, keys),
            } as Partial<T>
        });
    }, [state])


    const update = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
        setState({
            ...state,
            [key]: value
        })
    }, [state]);

    const merge = useCallback((mergedState: Partial<T>) => {

        setState(state => {
            return {
                ...state,
                ...mergedState
            }
        });
    }, [state])

    const clear = useCallback(() => {
        setState({})
    }, [state])

    return {
        state,
        actions: {
            update,
            remove,
            merge,
            clear,
            setState
        }
    }
} 