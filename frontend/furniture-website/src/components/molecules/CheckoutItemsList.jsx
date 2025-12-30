import { useSelector } from 'react-redux';
import { CheckoutProductCard } from '@components';

const CheckoutItemsList = () => {
  const { store = {} } = useSelector((state) => state.cart);

  const items = Object.values(store);

  return (
    <div className="w-full flex flex-col gap-4 max-h-64 py-4 overflow-y-auto scrollbar-thin">
      {items.map((item, i) => (
        <CheckoutProductCard key={item.productId} item={item} />
      ))}
    </div>
  );
};

export default CheckoutItemsList;
