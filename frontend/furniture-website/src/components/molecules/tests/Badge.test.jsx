import { render, screen } from '@testing-library/react';
import { Badge } from '@components';

describe('Badge', () => {
  it('renders icon, title, and description correctly', () => {
    render(<Badge icon="/test-icon.svg" title="My Title" description="Some description" />);

    expect(screen.getByText('My Title')).toBeInTheDocument();

    expect(screen.getByText('Some description')).toBeInTheDocument();

    const icon = screen.getByAltText('My Title');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/test-icon.svg');
  });
});
