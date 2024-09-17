import { useCallback, useEffect, useState } from "react";


export function useModalManager<T extends string = string>(opts?: { initialValue?: T }) {
    const [currentModal, setCurrentModal] = useState<Maybe<T>>(opts?.initialValue);
    const [nextModal, setNextModal] = useState<Maybe<T>>(null);

    useEffect(() => {
        if (!nextModal) return;

        setCurrentModal(nextModal)
        setNextModal(null);
    }, [nextModal])


    const openModal = useCallback((modal: T, options?: { delay?: number }) => {
        if (currentModal === modal) return;


        if (typeof options?.delay === 'number' && currentModal) {
            setCurrentModal(null)
            setTimeout(() => {
                setNextModal(modal)
            }, options.delay)
        } else {
            setNextModal(modal)
        }
    }, [currentModal]);

    const closeModal = useCallback((modal?: T) => {
        if (typeof modal === 'string') {
            if (currentModal === modal) {
                setCurrentModal(null);
            }
        } else {
            setCurrentModal(null);
        }
    }, [currentModal]);

    return {
        currentModal,
        nextModal,
        closeModal,
        openModal,
    };
}
