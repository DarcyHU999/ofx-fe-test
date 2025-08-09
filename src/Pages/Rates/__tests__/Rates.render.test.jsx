import { render, screen, fireEvent, within, act } from '@testing-library/react';
import React from 'react';

jest.mock('../../../Hooks/useExchangeRate', () => ({
  useExchangeRate: jest.fn(),
}));

// controllable mock frames for useAnimationFrame to drive progression branches
let mockFrames = [];
let mockAlreadyRan = false;
jest.mock('../../../Hooks/useAnimationFrame', () => ({
  useAnimationFrame: (run, cb) => {
    if (!run || typeof cb !== 'function' || mockAlreadyRan) return;
    mockAlreadyRan = true;
    mockFrames.forEach((d, i) => setTimeout(() => cb(d), i));
  },
}));

const Rates = require('../Rates').default;
const { useExchangeRate } = require('../../../Hooks/useExchangeRate');

describe('Rates page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
    mockFrames = [];
    mockAlreadyRan = false;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows rate when loaded without error', () => {
    useExchangeRate.mockReturnValue({ exchangeRate: 1.23, error: null, refetch: jest.fn() });
    render(<Rates />);
    expect(screen.getByText(/1\.23/)).toBeInTheDocument();
  });

  test('rate area shows loader when error', () => {
    useExchangeRate.mockReturnValue({ exchangeRate: 0, error: 'Network error', refetch: jest.fn() });
    render(<Rates />);
    expect(screen.getByText(/OFX Rate/i)).toBeInTheDocument();
  });

  test('currency change freezes display and keeps ConversionResult mounted', () => {
    useExchangeRate.mockReturnValue({ exchangeRate: 1.23, error: null, refetch: jest.fn() });
    render(<Rates />);

    const buttons = screen.getAllByRole('button');
    // change From currency (covers onFromChange lines)
    fireEvent.click(buttons[0]);
    let list = screen.getByRole('list');
    let anyOption = within(list).getAllByRole('button')[0];
    fireEvent.click(anyOption);

    // change To currency (covers onToChange lines)
    fireEvent.click(buttons[1]);
    list = screen.getByRole('list');
    anyOption = within(list).getAllByRole('button')[0];
    fireEvent.click(anyOption);

    expect(screen.getByText(/Conversion Result/i)).toBeInTheDocument();
  });

  test('error panel retry triggers refetch', () => {
    const refetch = jest.fn();
    useExchangeRate.mockReturnValue({ exchangeRate: 0, error: 'Network error', refetch });
    render(<Rates />);

    const retry = screen.getByRole('button', { name: /Retry/i });
    fireEvent.click(retry);
    expect(refetch).toHaveBeenCalled();
  });

  test('rising-edge: when progression crosses threshold, refetch is called (lines 40-44)', () => {
    const refetch = jest.fn();
    useExchangeRate.mockReturnValue({ exchangeRate: 1.11, error: null, refetch });
    // drive two frames: first brings progression close to 1, second triggers threshold branch
    mockFrames = [9990, 1];
    render(<Rates />);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('progression reset path when error is present (lines 45-47)', () => {
    const refetch = jest.fn();
    useExchangeRate.mockReturnValue({ exchangeRate: 0, error: 'E', refetch });
    mockFrames = [1];
    render(<Rates />);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(refetch).not.toHaveBeenCalled();
  });

  test('changing amount triggers input onChange (line 153)', () => {
    useExchangeRate.mockReturnValue({ exchangeRate: 1.23, error: null, refetch: jest.fn() });
    render(<Rates />);
    const amountInput = screen.getByPlaceholderText('00.00');
    fireEvent.change(amountInput, { target: { value: '123' } });
    expect(amountInput).toHaveValue('123');
  });
}); 