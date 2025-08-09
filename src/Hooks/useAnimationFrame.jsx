import { useRef, useEffect } from 'react';

export const useAnimationFrame = (run, callback) => {
    const requestRef = useRef();
    const previousTimeRef = useRef();
    const callbackRef = useRef(callback);

    // keep latest callback without changing effect deps
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const animateRef = useRef();
    animateRef.current = (time) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;
            callbackRef.current && callbackRef.current(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animateRef.current);
    };

    useEffect(() => {
        if (!run) {
            requestRef.current = undefined;
            previousTimeRef.current = undefined;
        } else {
            requestRef.current = requestAnimationFrame(animateRef.current);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [run]);
};
