import { Logo, Divider, CartBtn, UserHeaderBtn } from '@components';

const CheckoutHeader = () => {
  return (
    <>
      <header className="w-full h-20 lg:h-26 bg-white relative min-w-85 z-50">
        <div className="w-full h-full px-4 lg:px-16 max-w-280 flex gap-10 justify-between items-center mx-auto">
          <Logo />

          <div className="flex gap-8 items-center">
            <CartBtn />
            <UserHeaderBtn />
          </div>
        </div>
        <Divider />
      </header>
    </>
  );
};

export default CheckoutHeader;
