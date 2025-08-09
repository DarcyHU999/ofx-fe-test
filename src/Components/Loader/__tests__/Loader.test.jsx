import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  test('renders with custom size', () => {
    render(
      <div role="status">
        <Loader width="25px" height="25px" />
      </div>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('merges custom style', () => {
    render(
      <div role="status">
        <Loader width="25px" height="25px" style={{ marginTop: '10px' }} />
      </div>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('defaults to 20px when no props provided', () => {
    render(
      <div role="status">
        <Loader />
      </div>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
}); 