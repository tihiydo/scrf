'use client'

import Image, { ImageProps as NextImageProps } from "next/image";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define context type
interface PictureContextType {
    hasError: boolean;
    setHasError: (arg: boolean) => void;
}

// Create context with default values
const PictureContext = createContext<PictureContextType>({
    hasError: false,
    setHasError: () => { },
});

// Custom hook to use Picture context
const usePicture = () => {
    return useContext(PictureContext);
};

// PictureRoot component to provide context values
type RootProps = {
    children: ReactNode;
};
export const PictureRoot = ({ children }: RootProps) => {
    const [hasError, setHasError] = useState(false);

    return (
        <PictureContext.Provider value={{ hasError, setHasError }}>
            {children}
        </PictureContext.Provider>
    );
};

// PictureImage component to display the image and handle error state
type ImageProps = NextImageProps;
export const PictureImage = ({ onError, src, ...props }: ImageProps) => {
    const { hasError, setHasError } = usePicture();

    useEffect(() => {
        if (!src) {
            setHasError(true)
        }
    }, [src])

    if (hasError || !src) return;

    return (
        <Image
            src={src}
            onError={(e) => {
                onError?.(e);
                setHasError(true);
            }}
            {...props}
        />
    );
};

type FallbackProps = {
    children: React.ReactNode
};
export const PictureFallback = ({ children }: FallbackProps) => {
    const { hasError } = usePicture();
    if (!hasError) return null;

    return children;
};
