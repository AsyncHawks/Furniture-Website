import {
  Paragraph,
  Divider,
  Timeline,
  AddressCard,
  ProductList,
  OrderPaymentSummary,
} from '@components';

const OrderDetails = ({ order }) => {
  const { shippingAddress, billingAddress, billingSameAsShipping, products } = order;

  return (
    <div className="mt-2 flex flex-col gap-6 p-4 border border-gray-200 rounded-lg bg-white">
      <Paragraph variant="F">
        <strong>Tracking ID:</strong> {order.trackingId}
      </Paragraph>
      <Paragraph variant="F">
        <strong>Status:</strong> {order.status}
      </Paragraph>
      <Paragraph variant="F">
        <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
      </Paragraph>

      <Divider />

      {billingSameAsShipping ? (
        <AddressCard label="Shipping & Billing Address" address={shippingAddress} />
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <AddressCard label="Shipping Address" address={shippingAddress} />
          <AddressCard label="Billing Address" address={billingAddress} />
        </div>
      )}

      <Divider />

      <ProductList products={products} />

      <Divider />

      <OrderPaymentSummary products={products} />

      <Divider />

      <Timeline events={order.timeline} currentStatus={order.status} />
    </div>
  );
};

export default OrderDetails;
