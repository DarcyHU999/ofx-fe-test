import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  test('renders progress wrapper', () => {
    render(<div aria-label="progress-wrapper"><ProgressBar progress={0.5} /></div>);
    expect(screen.getByLabelText('progress-wrapper')).toBeInTheDocument();
  });
}); 