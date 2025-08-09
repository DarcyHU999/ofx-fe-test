import { renderHook, waitFor } from '@testing-library/react';
import { useExchangeRate } from '../useExchangeRate';

describe('useExchangeRate (more branches)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('invalid response format sets error', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ notRetail: 1 }) });
    const setLoading = jest.fn();
    const { result } = renderHook(() => useExchangeRate('AUD', 'USD', setLoading));

    await waitFor(() => expect(result.current.error).toMatch(/Invalid response format/i));
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  test('http error does not retry and sets error', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
    const setLoading = jest.fn();
    const { result } = renderHook(() => useExchangeRate('AUD', 'USD', setLoading));

    await waitFor(() => expect(result.current.error).toMatch(/HTTP error/i));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  test('early return when currencies missing (no fetch, no loading)', async () => {
    const setLoading = jest.fn();
    const { result } = renderHook(() => useExchangeRate(undefined, 'USD', setLoading));
    expect(fetch).not.toHaveBeenCalled();
    expect(setLoading).not.toHaveBeenCalled();
    expect(result.current.exchangeRate).toBe(1);
    expect(result.current.error).toBe(null);
  });

  test('last-request-wins: older request errors, newer succeeds (older should not set error)', async () => {
    let resolveFirst;
    let resolveSecond;
    const first = new Promise((res) => (resolveFirst = res));
    const second = new Promise((res) => (resolveSecond = res));

    fetch
      .mockReturnValueOnce(first)
      .mockReturnValueOnce(second);

    const setLoading = jest.fn();
    const { result, rerender } = renderHook(({ sell, buy }) => useExchangeRate(sell, buy, setLoading), {
      initialProps: { sell: 'AUD', buy: 'USD' },
    });

    // trigger newer request
    rerender({ sell: 'AUD', buy: 'EUR' });

    // resolve older with HTTP error; should be ignored (non-latest)
    resolveFirst({ ok: false, status: 500, json: async () => ({}) });
    // resolve newer with success
    resolveSecond({ ok: true, json: async () => ({ retailRate: 1.11 }) });

    await waitFor(() => expect(result.current.exchangeRate).toBe(1.11));
    // ensure no error leaked from older request
    expect(result.current.error).toBe(null);
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });
}); 