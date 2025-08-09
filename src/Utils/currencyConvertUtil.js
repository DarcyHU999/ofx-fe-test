import Decimal from 'decimal.js';

// Convert amount with true rate (without markup), handle empty/invalid input
export const convertAmount = (amount, rate, markup) => {
    if (!amount || amount === '' || isNaN(amount)) {
        return '0';
    }
    return new Decimal(amount).mul(rate).div(1 - markup).toFixed(2).toString();
}

// Convert amount with OFX true rate, handle empty/invalid input
export const convertAmountWithMarkup = (amount, rate) => {
    if (!amount || amount === '' || isNaN(amount)) {
        return '0';
    }
    return new Decimal(amount).mul(rate).toFixed(2).toString();
}