import { Paragraph, Price, Heading } from '@components';
import { useSelector } from 'react-redux';

const OrderPaymentSummary = ({ products = [] }) => {
  const { currency } = useSelector((state) => state.global);
  const totalItems = products?.length ? products?.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const subtotal = products?.length
    ? products.reduce((sum, item) => sum + item.quantity * item.price, 0)
    : 0;

  const baseShippingCost = 5000;
  const hasNoFreeShipping = products?.length
    ? products.some((product) => product.freeShipping === false)
    : 0;
  const shippingCost = hasNoFreeShipping ? baseShippingCost : 0;

  const finalAmount = subtotal + shippingCost;

  return (
    <div className="flex flex-col gap-6">
      <Heading level={5} variant="medium">
        Payment Summary
      </Heading>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Paragraph variant="F">Subtotal · {totalItems} items</Paragraph>
          <Price amount={subtotal} />
        </div>

        <div className="flex justify-between">
          <Paragraph variant="F">Shipping</Paragraph>
          <Paragraph variant="F">
            {shippingCost > 0 ? <Price amount={shippingCost} /> : 'FREE'}
          </Paragraph>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-300 pt-4">
        <Heading level={5} variant="medium">
          Total
        </Heading>
        <div className="flex gap-1 items-center">
          {currency}
          <Heading level={5} variant="medium">
            <Price amount={finalAmount} />
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentSummary;
