import { useState, useEffect, useCallback } from 'react';

export const useExchangeRate = (sellCurrency, buyCurrency, setLoading) => {
    const [exchangeRate, setExchangeRate] = useState(1);
    const [error, setError] = useState(null);

    const fetchRate = useCallback(async () => {
        if (!sellCurrency || !buyCurrency) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`https://rates.staging.api.paytron.com/rate/public?sellCurrency=${sellCurrency}&buyCurrency=${buyCurrency}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.retailRate !== undefined) {
                setExchangeRate(data.retailRate);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching exchange rate:', err);
            setError(err.message);
            // Keep previous exchange rate on error
        } finally {
            setLoading(false);
        }
    }, [sellCurrency, buyCurrency]);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);

    return { 
        exchangeRate, 
        error, 
        refetch: fetchRate
    };
};
