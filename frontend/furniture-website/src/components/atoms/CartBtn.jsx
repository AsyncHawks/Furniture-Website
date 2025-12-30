import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { openCart } from '@store';
import { Tooltip } from '@components';

const CartBtn = ({ className = '' }) => {
  const dispatch = useDispatch();
  const { store = {} } = useSelector((state) => state.cart);
  const totalItems = Object.keys(store).length;

  return (
    <Tooltip text="View Cart">
      <div
        className="relative cursor-pointer top-1"
        onClick={() => {
          dispatch(openCart());
        }}
      >
        <div className="absolute -right-2 -top-2 bg-(--color-brand-primary) text-white text-xs aspect-square w-5 h-5 rounded-full flex justify-center items-center">
          {totalItems}
        </div>
        <ShoppingCart size={26} className={`${className}`} />
      </div>
    </Tooltip>
  );
};

export default CartBtn;
