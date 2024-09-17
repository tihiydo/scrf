import { useEffect, useRef } from "react";


/**
 * A custom React hook that runs a cleanup function only when the component unmounts.
 * 
 * @param {() => void} fn - The cleanup function to be executed when the component unmounts.
 * 
 * @example
 * useUnmount(() => {
 *   console.log('Component has unmounted');
 * });
 * 
 * @example
 * useUnmount(() => {
 *   subscription.unsubscribe();
 * });
 */
export const useUnmount = (fn: () => void): void => {
    // Create a mutable ref object to store the latest version of the cleanup function
    const fnRef = useRef(fn);

    // Update the ref with the latest function on every render
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]); // Dependency array ensures the ref updates when `fn` changes

    useEffect(() => {
        // Return the cleanup function that will be called on component unmount
        return () => {
            if (fnRef.current) {
                fnRef.current();
            }
        };
    }, []); // Empty dependency array ensures cleanup runs only on unmount
};