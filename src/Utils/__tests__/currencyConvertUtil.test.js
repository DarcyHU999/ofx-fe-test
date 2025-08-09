import { convertAmount, convertAmountWithMarkup } from '../currencyConvertUtil';

describe('currencyConvertUtil', () => {
  test('convertAmount returns 0 for empty or invalid input', () => {
    expect(convertAmount('', 1.2, 0.05)).toBe('0');
    expect(convertAmount(undefined, 1.2, 0.05)).toBe('0');
    expect(convertAmount('abc', 1.2, 0.05)).toBe('0');
  });

  test('convertAmount applies true-rate (remove markup) and rounds to 2 dp', () => {
    // amount * rate / (1 - markup)
    expect(convertAmount('100', 1.2, 0.05)).toBe('126.32');
    expect(convertAmount('1', 0.98765, 0.01)).toBe('1.00');
  });

  test('convertAmountWithMarkup returns 0 for empty or invalid input', () => {
    expect(convertAmountWithMarkup('', 1.2)).toBe('0');
    expect(convertAmountWithMarkup(undefined, 1.2)).toBe('0');
    expect(convertAmountWithMarkup('abc', 1.2)).toBe('0');
  });

  test('convertAmountWithMarkup multiplies and rounds to 2 dp', () => {
    expect(convertAmountWithMarkup('100', 1.2)).toBe('120.00');
    expect(convertAmountWithMarkup('1', 0.98765)).toBe('0.99');
  });
}); 