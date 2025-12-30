import { CheckoutForm, CheckoutDisplay } from '@components';

const CheckoutPageLayout = () => {
  return (
    <div className="relative flex flex-col-reverse justify-start items-center lg:flex-row lg:items-start lg:justify-center w-full bg-(--color-surface-50) min-h-screen">
      <section className="w-full lg:w-1/2 flex justify-center items-center lg:justify-end">
        <CheckoutForm />
      </section>
      <section className="w-full lg:w-1/2 flex justify-center items-center lg:justify-end relative lg:sticky top-0 bg-inherit lg:bg-(--color-surface-300)">
        <div className="w-full flex justify-center lg:justify-start">
          <CheckoutDisplay />
        </div>
      </section>
    </div>
  );
};

export default CheckoutPageLayout;
