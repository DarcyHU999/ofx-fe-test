import { render, act } from '@testing-library/react';
import Input from '../Input';

jest.useFakeTimers();

describe('Input', () => {
  test('calls debouncing callbacks correctly with valid input (controlled rerender)', () => {
    const onDebouncingChange = jest.fn();
    const onDebouncedValueChange = jest.fn();

    const { rerender } = render(
      <Input
        label="Amount"
        value=""
        onChange={() => {}}
        onDebouncingChange={onDebouncingChange}
        onDebouncedValueChange={onDebouncedValueChange}
        currency="USD"
        leftIcon={<span/>}
      />
    );

    // Clear any initial emission (e.g., empty string on mount)
    onDebouncedValueChange.mockClear();

    // Parent updates value -> debounce starts
    rerender(
      <Input
        label="Amount"
        value="12"
        onChange={() => {}}
        onDebouncingChange={onDebouncingChange}
        onDebouncedValueChange={onDebouncedValueChange}
        currency="USD"
        leftIcon={<span/>}
      />
    );

    expect(onDebouncingChange).toHaveBeenCalledWith(true);

    // advance less than debounce
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(onDebouncedValueChange).not.toHaveBeenCalled();

    // finish debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(onDebouncedValueChange).toHaveBeenCalledWith('12');
    expect(onDebouncingChange).toHaveBeenLastCalledWith(false);
  });

  test('invalid input does not emit debouncedValue changes (controlled rerender)', () => {
    const onDebouncedValueChange = jest.fn();

    const { rerender } = render(
      <Input
        label="Amount"
        value=""
        onChange={() => {}}
        onDebouncedValueChange={onDebouncedValueChange}
        currency="USD"
        leftIcon={<span/>}
      />
    );

    onDebouncedValueChange.mockClear();

    // Parent provides invalid value
    rerender(
      <Input
        label="Amount"
        value="12..3"
        onChange={() => {}}
        onDebouncedValueChange={onDebouncedValueChange}
        currency="USD"
        leftIcon={<span/>}
      />
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(onDebouncedValueChange).not.toHaveBeenCalled();
  });
}); 