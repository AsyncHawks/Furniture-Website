import { Paragraph, Price, Heading } from '@components';
import { useSelector } from 'react-redux';

const CheckoutPaymentSummary = () => {
  const { store = {} } = useSelector((state) => state.cart);
  const { currency } = useSelector((state) => state.global);

  const items = Object.values(store);
  const totalItems = items.reduce((prev, curr) => prev + curr?.quantity, 0);
  const totalAmount = items.reduce((prev, curr) => prev + curr?.quantity * curr?.price, 0);
  const hasNoFreeShipping = items.some((item) => item?.freeShipping === false);
  const baseShippingCost = 5000;
  const shippingCost = hasNoFreeShipping ? baseShippingCost : 0;
  const finalAmount = totalAmount + shippingCost;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Paragraph variant="F">Subtotal · {totalItems} items</Paragraph>
          <Price amount={totalAmount} />
        </div>
        <div className="flex justify-between">
          <Paragraph variant="F">Shipping</Paragraph>
          <Paragraph variant="F">
            {hasNoFreeShipping ? <Price amount={baseShippingCost} /> : 'FREE'}
          </Paragraph>
        </div>
      </div>
      <div className="flex justify-between">
        <Heading level={5} variant="medium">
          Total
        </Heading>
        <div className="flex gap-2 items-center">
          {currency}
          <Heading level={5} variant="medium">
            <Price amount={finalAmount} className="" />
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentSummary;
