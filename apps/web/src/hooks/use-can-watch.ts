import { z } from "zod";
import { useLocalStorage } from "./use-local-storage";
import { decryptAes } from "@/utils";
import { useEffect, useState } from "react";
import { useSession } from "@/session/hooks/use-session";

export function useCanWatch() {
    const sessionStore = useSession();
    const { user } = useSession();
    const [canWatch, setCanWatch] = useState(false);


    const {
        storageState,
    } = useLocalStorage('ttm', z.string())
    const ttm = Number(decryptAes(storageState || 0, "ttmkey"));

    useEffect(() => {
        const canWatch = sessionStore.canWatch(ttm);
        setCanWatch(canWatch);
    }, [ttm, user])

    return {
        canWatch,
        ttm,
    }
}