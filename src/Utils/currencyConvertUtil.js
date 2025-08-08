import Decimal from 'decimal.js';

// Convert amount with rate, handle empty/invalid input
export const convertAmount = (amount, rate) => {
    if (!amount || amount === '' || isNaN(amount)) {
        return '0';
    }
    return new Decimal(amount).mul(rate).toString();
}

// Convert amount with rate and markup, handle empty/invalid input
export const convertAmountWithMarkup = (amount, rate, markup) => {
    if (!amount || amount === '' || isNaN(amount)) {
        return '0';
    }
    return new Decimal(amount).mul(rate).mul(1 - markup).toString();
}