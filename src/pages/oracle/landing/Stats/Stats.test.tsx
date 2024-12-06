import { render, screen } from '@testing-library/react';
import { Stats, isValidStatsProps } from './Stats';

describe('Stats', () => {
  const defaultProps = {
    type: 'test',
    value: 1000,
    text: 'users',
  };

  it('renders correctly with minimum props', () => {
    render(<Stats {...defaultProps} />);
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('1 000')).toBeInTheDocument();
  });

  it('renders change information when provided', () => {
    render({
      ...defaultProps,
      change: 100,
      time: '24h'
    });
    expect(screen.getByText('+100')).toBeInTheDocument();
    expect(screen.getByText('in 24h')).toBeInTheDocument();
  });

  it('returns null when value is not provided', () => {
    const { container } = render(<Stats type="test" />);
    expect(container.firstChild).toBeNull();
  });

  it('handles invalid number inputs', () => {
    const { container } = render(<Stats type="test" value={NaN} />);
    expect(container.firstChild).toBeNull();
  });

  it('formats large numbers correctly', () => {
    render(<Stats type="test" value={1000000} text="users" />);
    expect(screen.getByText('1 000 000')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<Stats type="test" isLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('isValidStatsProps', () => {
  it('validates correct props', () => {
    expect(isValidStatsProps(defaultProps)).toBe(true);
  });

  it('invalidates incorrect props', () => {
    expect(isValidStatsProps({ type: 123 })).toBe(false);
  });
}); 