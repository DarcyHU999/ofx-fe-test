import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import DropDown from '../DropDown';
import { DropdownProvider } from '../../../Providers/DropdownProvider';

const options = [
  { option: 'USD', key: 'US', icon: <span /> },
  { option: 'EUR', key: 'EU', icon: <span /> },
  { option: 'JPY', key: 'JP', icon: <span /> },
];

const renderWithProvider = (ui) => render(<DropdownProvider>{ui}</DropdownProvider>);

describe('DropDown interactions', () => {
  test('opens menu and selects an option, then closes', () => {
    const onSelect = jest.fn();

    renderWithProvider(
      <DropDown
        id="from"
        leftIcon={<span />}
        label="From"
        selected="USD"
        options={options}
        setSelected={onSelect}
      />
    );

    // open
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    const menu = screen.getByRole('list');
    const eurItemButton = within(menu).getByRole('button', { name: /EUR/i });
    fireEvent.click(eurItemButton);

    expect(onSelect).toHaveBeenCalledWith('EU');
    // menu should be closed after selection
    expect(screen.queryByRole('list')).toBeNull();
  });

  test('clicking outside closes the open menu', () => {
    renderWithProvider(
      <DropDown
        id="from"
        leftIcon={<span />}
        label="From"
        selected="USD"
        options={options}
        setSelected={jest.fn()}
      />
    );

    // open
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(screen.getByRole('list')).toBeInTheDocument();

    // click outside
    fireEvent.click(document.body);
    expect(screen.queryByRole('list')).toBeNull();
  });

  test('opening a second dropdown closes the first (single open at a time)', () => {
    renderWithProvider(
      <div>
        <DropDown
          id="from"
          leftIcon={<span />}
          label="From"
          selected="USD"
          options={options}
          setSelected={jest.fn()}
        />
        <DropDown
          id="to"
          leftIcon={<span />}
          label="To"
          selected="EUR"
          options={options}
          setSelected={jest.fn()}
        />
      </div>
    );

    const buttons = screen.getAllByRole('button');
    // open first
    fireEvent.click(buttons[0]);
    expect(screen.getByRole('list')).toBeInTheDocument();

    // open second
    fireEvent.click(buttons[1]);

    // now only the second menu should be present
    const lists = screen.getAllByRole('list');
    expect(lists.length).toBe(1);
    // ensure it contains expected options (sanity)
    expect(within(lists[0]).getByRole('button', { name: /USD/i })).toBeInTheDocument();
  });
}); 