import { useState, useEffect } from "react";

export const useResize = () => {
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return {
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
    };
};