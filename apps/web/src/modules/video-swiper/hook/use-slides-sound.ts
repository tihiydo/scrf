import { useCallback, useState } from "react";

export const useSlidesSound = (slidesKeys: string[]) => {
    const [slidesSound, setSlidesSound] = useState<Record<string, boolean>>(
        Object.fromEntries(
            slidesKeys.map(slideKey => ([
                slideKey,
                false
            ]))
        )
    )

    const toggleSound = useCallback((slide: string) => {
        if (!slidesKeys.includes(slide)) throw new Error('Not a slide key');

        setSlidesSound({
            ...slidesSound,
            [slide]: !slidesSound[slide]!
        });
    }, [slidesSound])

    
    return {
        slidesSound,
        toggleSound
    }
}