import PropTypes from 'prop-types';
import { useState } from 'react';
import { Heading, Icon, Divider, Link } from '@components';
import hamburgerIcon from '/icons/hamburger.svg';
import closeIcon from '/icons/X.svg';

const Navbar = ({ links }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav id="desktop-nav" className="hidden lg:block">
        <ul className="flex gap-14 whitespace-nowrap">
          {links.map((link, i) => (
            <li key={i}>
              <Link to={link.link} underline="left">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button onClick={() => setOpen(!open)} className="block lg:hidden">
        <Icon
          src={open ? closeIcon : hamburgerIcon}
          alt="Menu"
          className="w-7 h-7 cursor-pointer"
        />
      </button>

      <div
        id="mobile-nav"
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50 lg:hidden
        ${open ? 'translate-x-0' : 'translate-x-full'}  whitespace-nowrap`}
      >
        <div className="px-4 pt-7 pb-6 flex justify-between items-center border-gray-200">
          <Heading variant="tertiary" className="text-lg font-semibold">
            Menu
          </Heading>
          <button onClick={() => setOpen(false)} className="pr-0 lg:pr-11">
            <Icon src={closeIcon} alt="Menu" className="w-7 h-7  cursor-pointer" />
          </button>
        </div>
        <Divider />
        <ul className="flex flex-col gap-6 p-6">
          {links.map((link, i) => (
            <li key={i}>
              <Link to={link.link} underline="left" onClick={() => setOpen(false)}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 lg:hidden z-40" />
      )}
    </>
  );
};

Navbar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Navbar;
