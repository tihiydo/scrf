'use client';
import { sessionStore } from "./session.store";
import { createContext, useEffect } from "react";


export const SessionContext = createContext(sessionStore)

type Props = {
    children: React.ReactNode;
}

export default function SessionProvider({ children }: Props) {
    useEffect(() => 
    {
        (async () => {
            await sessionStore.loadUser();
        })()
    }, [])

    return <SessionContext.Provider value={sessionStore}>
        {children}
    </SessionContext.Provider>
}