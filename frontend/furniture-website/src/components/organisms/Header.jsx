import { Logo, Navbar, Divider, CartBtn, TrackOrderBtn, UserHeaderBtn } from '@components';
import { mainNavLinks } from '@config';

const Header = () => {
  return (
    <>
      <div className="h-20 lg:h-26" />

      <header className="w-full h-20 lg:h-26 bg-white fixed top-0 left-0 min-w-85 z-50">
        <div className="w-full h-full px-4 lg:px-16 max-w-480 flex gap-10 justify-between items-center mx-auto">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="hidden lg:block">
            <Logo />
          </div>

          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <Navbar links={mainNavLinks} />
          </div>

          <div className="flex items-center gap-4 md:gap-8 ml-auto lg:hidden">
            <TrackOrderBtn />
            <CartBtn />
            <UserHeaderBtn />
            <Navbar links={mainNavLinks} />
          </div>

          <div className="hidden lg:flex gap-8 items-center ml-auto ">
            <TrackOrderBtn />
            <CartBtn />
            <UserHeaderBtn />
          </div>
        </div>
        <Divider />
      </header>
    </>
  );
};

export default Header;
