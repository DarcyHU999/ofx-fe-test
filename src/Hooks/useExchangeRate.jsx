import { useState, useEffect, useCallback, useRef } from 'react';

export const useExchangeRate = (sellCurrency, buyCurrency, setLoading) => {
    const [exchangeRate, setExchangeRate] = useState(1);
    const [error, setError] = useState(null);

    const DEFAULT_TIMEOUT_MS = 5000;
    const MAX_TIMEOUT_RETRIES = 2;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchWithTimeout = async (url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            return res;
        } finally {
            clearTimeout(id);
        }
    };

    // Guard to ensure only the latest request can update UI
    const latestRequestIdRef = useRef(0);

    const fetchRate = useCallback(async () => {
        if (!sellCurrency || !buyCurrency) return;
        
        const requestId = ++latestRequestIdRef.current;
        setLoading(true);
        setError(null);
        
        const url = `https://rates.staging.api.paytron.com/rate/public?sellCurrency=${sellCurrency}&buyCurrency=${buyCurrency}`;

        try {
            let attempt = 0;
            let backoffMs = 400; // simple backoff between timeouts

            while (true) {
                try {
                    const response = await fetchWithTimeout(url, {}, DEFAULT_TIMEOUT_MS);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.retailRate !== undefined) {
                        // Only the latest request is allowed to update UI
                        if (latestRequestIdRef.current === requestId) {
                            setExchangeRate(data.retailRate);
                        }
                        break; // success
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (err) {
                    const isTimeout = err?.name === 'AbortError';
                    if (isTimeout && attempt < MAX_TIMEOUT_RETRIES - 1) {
                        attempt += 1;
                        await sleep(backoffMs);
                        backoffMs = Math.min(backoffMs * 2, 2000);
                        continue; // retry
                    }
                    // Non-timeout or exceeded retries
                    const finalErr = isTimeout
                        ? new Error(`Request timed out after ${MAX_TIMEOUT_RETRIES} attempts`)
                        : err;
                    // Only latest request can set error
                    if (latestRequestIdRef.current === requestId) {
                        throw finalErr;
                    } else {
                        // If not latest, just stop without affecting UI
                        return;
                    }
                }
            }
        } catch (err) {
            // Only latest request should reach here with thrown error
            if (latestRequestIdRef.current === requestId) {
                console.error('Error fetching exchange rate:', err);
                setError(err?.message || 'Unknown error');
            }
        } finally {
            // Only the latest in-flight request may turn loading off
            if (latestRequestIdRef.current === requestId) {
                setLoading(false);
            }
        }
    }, [sellCurrency, buyCurrency, setLoading]);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);

    return { 
        exchangeRate, 
        error, 
        refetch: fetchRate
    };
};
