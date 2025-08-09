import { render, screen, rerender as rtlRerender } from '@testing-library/react';
import ConversionResult from '../ConversionResult';

const setup = (props) => render(<ConversionResult {...props} />);

describe('ConversionResult', () => {
  test('freezes values while loading and updates after', () => {
    const { rerender } = setup({
      trueAmount: '100.00',
      amountAfterMarkup: '120.00',
      currency: 'USD',
      leftIcon: <span data-testid="icon">icon</span>,
      isLoading: true,
    });

    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('120.00')).toBeInTheDocument();
    expect(screen.getAllByTestId('icon').length).toBeGreaterThan(0);

    // while loading, change props should not reflect
    rerender(
      <ConversionResult
        trueAmount="200.00"
        amountAfterMarkup="240.00"
        currency="EUR"
        leftIcon={<span data-testid="icon">icon2</span>}
        isLoading={true}
      />
    );

    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('120.00')).toBeInTheDocument();

    // after loading, values should update
    rerender(
      <ConversionResult
        trueAmount="200.00"
        amountAfterMarkup="240.00"
        currency="EUR"
        leftIcon={<span data-testid="icon">icon2</span>}
        isLoading={false}
      />
    );
    expect(screen.getByText('200.00')).toBeInTheDocument();
    expect(screen.getByText('240.00')).toBeInTheDocument();
  });
}); 