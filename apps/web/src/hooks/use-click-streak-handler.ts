import { MouseEvent, useEffect, useState } from "react";

type Options = {
    delay: number
    maxClicksStreak?: number,
    onStreakFinish?: (clicks: number) => void;
}

export function useClickStreakHandler<T extends MouseEvent>(handler: (clicks: number, e: T) => void, opts?: Partial<Options>) {
    const [state, setState] = useState<{ clicks: number }>({ clicks: 0 });

    // Default values
    const options: Options = {
        delay: 400,
        ...opts
    }


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (state.clicks > 0) { 
                options.onStreakFinish?.(state.clicks);
            }

            setState({
                clicks: 0
            })
        }, options.delay)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [options.delay, options.maxClicksStreak, options.onStreakFinish, state.clicks])


    const handleMultiClick = (e: T) => {
        const newClicks = state.clicks + 1;
        if (typeof options.maxClicksStreak === 'number' && newClicks > options.maxClicksStreak) {
            return;
        }

        setState(prev => ({
            ...prev,
            clicks: newClicks
        }));

        handler(newClicks, e);
    }

    return handleMultiClick;
}