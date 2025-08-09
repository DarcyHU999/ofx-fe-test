import { renderHook } from '@testing-library/react';
import { useDropdown } from '../useDropdown';
import { DropdownProvider, DropdownContext } from '../../Providers/DropdownProvider';

describe('useDropdown', () => {
  test('throws if context value is null (simulating missing provider)', () => {
    const wrapper = ({ children }) => (
      <DropdownContext.Provider value={null}>{children}</DropdownContext.Provider>
    );
    expect(() => renderHook(() => useDropdown(), { wrapper })).toThrow();
  });

  test('returns context inside provider', () => {
    const wrapper = ({ children }) => <DropdownProvider>{children}</DropdownProvider>;
    const { result } = renderHook(() => useDropdown(), { wrapper });
    expect(result.current).toHaveProperty('toggleDropdown');
    expect(result.current).toHaveProperty('openDropdownId');
  });
}); 