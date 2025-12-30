import { useState } from 'react';
import { Heading, Paragraph, OrderDetails, TrackingForm } from '@components';

const TrackingPage = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-2 md:p-6 flex flex-col gap-4">
      <Heading variant="medium">Track Your Order</Heading>

      <div>
        <TrackingForm setOrder={setOrder} setError={setError} />
        {error && (
          <Paragraph variant="F" className="text-red-600 text-center mt-2">
            {error}
          </Paragraph>
        )}
      </div>

      {order && <OrderDetails order={order} />}
    </div>
  );
};

export default TrackingPage;
