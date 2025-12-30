import { Logo, Divider } from '@components';
import { Outlet } from 'react-router-dom';

const AuthPageLayout = () => {
  return (
    <div className="min-w-85 flex flex-col">
      <header className="w-full h-20 lg:h-26 bg-white fixed top-0 left-0 min-w-85 z-50">
        <div className="w-full h-full px-4 lg:px-16 max-w-480 flex gap-10 justify-between items-center mx-auto">
          <Logo />

          <div className="flex gap-8 items-center"></div>
        </div>
        <Divider />
      </header>
      <div className="h-20 lg:h-26" />
      <main className="w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthPageLayout;
