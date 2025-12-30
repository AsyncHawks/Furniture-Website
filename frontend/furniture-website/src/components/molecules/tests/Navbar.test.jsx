import { render, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '@components';

describe('Navbar', () => {
  const links = [
    { link: '/', title: 'Home' },
    { link: '/about', title: 'About' },
  ];

  it('renders navLinks and toggle button responsively', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar links={links} />
      </MemoryRouter>
    );

    const desktopNav = container.querySelector('#desktop-nav');

    links.forEach((link) => {
      expect(within(desktopNav).getByText(link.title)).toBeInTheDocument();
    });

    const toggleBtn = within(container).getAllByRole('button')[0];
    expect(toggleBtn).toBeInTheDocument();
  });
});
