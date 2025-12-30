import { CurrencySwitcher, CheckoutHeader, CartSidebar } from '@components';
import { Outlet } from 'react-router-dom';

const CheckoutLayout = () => {
  return (
    <div className="min-h-screen min-w-85 flex flex-col">
      <CurrencySwitcher />
      <CartSidebar />
      <CheckoutHeader />
      <main className="w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CheckoutLayout;
