import { useState, useEffect } from 'react';

// Custom hook for debouncing values with loading state
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isDebouncing, setIsDebouncing] = useState(false);
    const [lastValidValue, setLastValidValue] = useState(value); // Track last valid value

    useEffect(() => {
        if (value !== debouncedValue) {
            setIsDebouncing(true);
            
            const handler = setTimeout(() => {
                // Check if current value is valid (basic validation)
                const isValid = value === '' || /^\d{1,9}(\.\d{0,2})?$/.test(value);
                
                if (isValid) {
                    setDebouncedValue(value);
                    setLastValidValue(value);
                } else {
                    // Keep the last valid value instead of updating to invalid value
                    setDebouncedValue(lastValidValue);
                }
                setIsDebouncing(false);
            }, delay);

            return () => {
                clearTimeout(handler);
                setIsDebouncing(false);
            };
        }
    }, [value, delay, debouncedValue, lastValidValue]);

    return { debouncedValue, isDebouncing };
}; 