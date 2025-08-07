import { useState, useCallback, createContext } from 'react';

export const DropdownContext = createContext({
    openDropdownId: null,
    openDropdown: () => {},
    closeDropdown: () => {},
    toggleDropdown: () => {}
});

export const DropdownProvider = ({ children }) => {
  // Track currently open dropdown (only one can be open at a time)
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const openDropdown = useCallback((id) => {
    setOpenDropdownId(id);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  // Toggle dropdown: open if closed, close if open
  const toggleDropdown = useCallback((id) => {
    setOpenDropdownId(prev => prev === id ? null : id);
  }, []);

  const contextValue = {
    openDropdownId,
    openDropdown,
    closeDropdown,
    toggleDropdown
  };

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  );
};