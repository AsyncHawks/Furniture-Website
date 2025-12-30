import { CheckoutItemsList, CheckoutPaymentSummary, Divider } from '@components';

const CheckoutDisplay = () => {
  return (
    <div className="w-full h-20 max-w-2xl lg:max-w-xl p-4 lg:p-9 min-h-fit lg:min-h-screen border-0 lg:border-l border-gray-300 flex flex-col gap-6">
      <CheckoutItemsList />
      <Divider />
      <div className="hidden lg:block">
        <CheckoutPaymentSummary />
      </div>
    </div>
  );
};

export default CheckoutDisplay;
