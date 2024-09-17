import { useCallback, useEffect, useState } from "react";

export function useTrigger(duration: number = 1000) {
    const [state, setState] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setVisible(false);
        }, duration)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [duration, visible, state])

    const trigger = useCallback(() => {
        setVisible(true);
        setState(prev => prev + 1)
    }, []);

    return [
        trigger,
        visible
    ] as const;
}