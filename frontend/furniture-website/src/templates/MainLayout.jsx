import { Header, Footer, CurrencySwitcher, CartSidebar } from '@components';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen min-w-85 flex flex-col">
      <CurrencySwitcher />
      <CartSidebar />
      <Header />
      <main className="w-full mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
