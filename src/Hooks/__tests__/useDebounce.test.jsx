import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  test('debounces value updates', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: '' },
    });

    // initial
    expect(result.current.debouncedValue).toBe('');
    expect(result.current.isDebouncing).toBe(false);

    // change value -> should set debouncing true immediately
    rerender({ value: '12' });
    expect(result.current.isDebouncing).toBe(true);

    // not yet updated before delay
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(result.current.debouncedValue).toBe('');

    // after delay
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current.debouncedValue).toBe('12');
    expect(result.current.isDebouncing).toBe(false);
  });

  test('multiple rapid changes collapses to last value', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: '' },
    });

    rerender({ value: '1' });
    rerender({ value: '12' });
    rerender({ value: '123' });

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current.debouncedValue).toBe('');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.debouncedValue).toBe('123');
  });
}); 