import { renderHook, act } from '@testing-library/react';
import { DropdownContext, DropdownProvider } from '../DropdownProvider';
import { useContext } from 'react';

const useDropdownConsumer = () => useContext(DropdownContext);

describe('DropdownProvider context', () => {
  test('toggleDropdown opens/closes by id', () => {
    const wrapper = ({ children }) => <DropdownProvider>{children}</DropdownProvider>;

    const { result } = renderHook(() => useDropdownConsumer(), { wrapper });

    act(() => {
      result.current.toggleDropdown('from');
    });
    expect(result.current.openDropdownId).toBe('from');

    act(() => {
      result.current.toggleDropdown('from');
    });
    expect(result.current.openDropdownId).toBe(null);
  });

  test('openDropdown and closeDropdown work as expected', () => {
    const wrapper = ({ children }) => <DropdownProvider>{children}</DropdownProvider>;

    const { result } = renderHook(() => useDropdownConsumer(), { wrapper });

    act(() => {
      result.current.openDropdown('to');
    });
    expect(result.current.openDropdownId).toBe('to');

    act(() => {
      result.current.closeDropdown();
    });
    expect(result.current.openDropdownId).toBe(null);
  });

  test('toggling another id closes previous', () => {
    const wrapper = ({ children }) => <DropdownProvider>{children}</DropdownProvider>;

    const { result } = renderHook(() => useDropdownConsumer(), { wrapper });

    act(() => {
      result.current.toggleDropdown('from');
    });
    expect(result.current.openDropdownId).toBe('from');

    act(() => {
      result.current.toggleDropdown('to');
    });
    expect(result.current.openDropdownId).toBe('to');

    // toggle again to close 'to'
    act(() => {
      result.current.toggleDropdown('to');
    });
    expect(result.current.openDropdownId).toBe(null);
  });

  test('default context functions (no provider) are callable', () => {
    // directly consume context without provider to hit default no-op functions
    const { result } = renderHook(() => useDropdownConsumer());

    // call default functions; they should not throw
    act(() => {
      result.current.openDropdown('x');
      result.current.toggleDropdown('x');
      result.current.closeDropdown();
    });

    // default state remains null
    expect(result.current.openDropdownId).toBe(null);
  });
}); 