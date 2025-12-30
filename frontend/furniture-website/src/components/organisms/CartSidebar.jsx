import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '@store';
import { SideBarOverlay, Divider, Paragraph, CartItem, Price, BWButton } from '@components';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const CartSidebar = () => {
  const cartOpen = useSelector((state) => state.global.cartOpen);
  const { store = {} } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = Object.values(store);
  const totalItems = Object.keys(store).length;

  const totalAmount = useMemo(() => {
    return items.reduce((prev, curr) => {
      return prev + curr.quantity * curr.price;
    }, 0);
  }, [store]);

  return (
    <SideBarOverlay isOpen={cartOpen} side="right" onClose={() => dispatch(toggleCart())}>
      <div className="flex flex-col gap-4 h-full pb-2 md:pb-5">
        <div className="flex gap-2">
          <Paragraph variant="G">Your Cart</Paragraph>
          <span>{totalItems}</span>
        </div>
        <Divider />
        <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] justify-between">
          <div className="overflow-y-auto scrollbar-thin pr-2">
            <div className="flex flex-col gap-4 pb-4">
              {items?.map((item, i) => (
                <CartItem key={i} item={item} />
              ))}
            </div>
          </div>
          <div className="w-full max-h-36 min-h-36 flex flex-col justify-between pt-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <Paragraph variant="C">Subtotal</Paragraph>
                <div className="text-xs">
                  <span className="underline">Shipping</span> calculated at checkout.
                </div>
              </div>
              <Price amount={totalAmount} className="whitespace-nowrap text-xl font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <BWButton
                variant="white"
                text="CLOSE CART"
                onClick={() => {
                  dispatch(toggleCart());
                }}
              />
              <Link to="/checkout">
                <BWButton
                  text="CHECKOUT"
                  onClick={() => {
                    dispatch(toggleCart());
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SideBarOverlay>
  );
};

export default CartSidebar;
