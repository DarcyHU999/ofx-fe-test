import { useRef, useEffect } from 'react';

export const useAnimationFrame = (run, callback) => {
    const requestRef = useRef();
    const previousTimeRef = useRef();

    const animate = (time) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (!run) {
            requestRef.current = undefined;
            previousTimeRef.current = undefined;
        } else {
            requestRef.current = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [run]);
};
