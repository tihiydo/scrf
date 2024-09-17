import { useLocalStorage } from "@/hooks/use-local-storage";
import { z } from "zod";

type Args = {
    type: string;
}

const Schema =  z.object({
    expires: z.number(),
    allowedAt: z.number(),
    email: z.string().email(),
    type: z.string()
}).nullable()

export function useEmailAuthSession({ type }: Args) {
    const { removeStorageState, setStorageState, storageState } = useLocalStorage(
        'email-auth-session',
        Schema,
    );

    return { 
        removeStorageState,
        setStorageState: (values: Omit<z.infer<typeof Schema>, 'type'>) => {
            setStorageState({
                type: type,
                ...values
            })
        },
        storageState: storageState?.type === type ? storageState : null
    }
}