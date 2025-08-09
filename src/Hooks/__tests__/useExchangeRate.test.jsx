import { renderHook, waitFor } from '@testing-library/react';
import { useExchangeRate } from '../useExchangeRate';

let errorSpy;
beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  errorSpy.mockRestore();
});

describe('useExchangeRate', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('success sets exchangeRate and clears loading', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ retailRate: 1.23 }) });

    const setLoading = jest.fn();
    const { result } = renderHook(() => useExchangeRate('AUD', 'USD', setLoading));

    await waitFor(() => expect(result.current.exchangeRate).toBe(1.23));
    expect(result.current.error).toBe(null);
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  test('timeout retries then errors after max attempts', async () => {
    const abortErr = new Error('Aborted');
    abortErr.name = 'AbortError';
    // With MAX_TIMEOUT_RETRIES=2, total attempts=2
    fetch
      .mockRejectedValueOnce(abortErr)
      .mockRejectedValueOnce(abortErr);

    const setLoading = jest.fn();
    const { result } = renderHook(() => useExchangeRate('AUD', 'USD', setLoading));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2), { timeout: 1500 });
    await waitFor(() => expect(result.current.error).toMatch(/timed out/i));
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  test('last-request-wins: older response does not override newer', async () => {
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

    // trigger second request with different pair
    rerender({ sell: 'AUD', buy: 'EUR' });

    // resolve older with 9.99, newer with 1.11
    resolveFirst({ ok: true, json: async () => ({ retailRate: 9.99 }) });
    resolveSecond({ ok: true, json: async () => ({ retailRate: 1.11 }) });

    await waitFor(() => expect(result.current.exchangeRate).toBe(1.11));
  });
}); 