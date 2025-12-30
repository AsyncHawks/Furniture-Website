import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { slugify } from '@utils';
import { updateQuantity, removeFromCart, toggleCart } from '@store';
import { Image, Price, Heading, Paragraph, QuantitySelector } from '@components';

const CartItem = ({ item }) => {
  const { productId, variantId, title, variantTitle, price, image, quantity } = item;
  const dispatch = useDispatch();
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);

  useEffect(() => {
    setSelectedQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
    dispatch(updateQuantity({ id: variantId || productId, quantity: selectedQuantity }));
  }, [selectedQuantity]);

  return (
    <div className="flex gap-5 h-full sm:h-28 min-h-28">
      <Link
        to={`/product/${productId}/${slugify(title)}`}
        className="w-24 h-full sm:h-28 sm:min-h-28"
        onClick={() => dispatch(toggleCart())}
      >
        <Image src={image} alt={title} className="w-full h-full select-none" />
      </Link>
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col sm:flex-row w-full justify-between gap-2">
          <div className="flex flex-col gap-1">
            <Heading level={3} variant="title" maxChars={38}>
              {title}
            </Heading>
            <Paragraph variant="H">
              <Price amount={price} />
            </Paragraph>
          </div>
          <div className="flex items-center gap-3 flex-row-reverse sm:flex-row">
            <Trash2
              size={38}
              className="cursor-pointer p-2"
              onClick={() => dispatch(removeFromCart({ id: variantId || productId }))}
            />
            <div className="w-24">
              <QuantitySelector quantity={quantity} setQuantity={setSelectedQuantity} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between select-none">
          <Paragraph variant="H" className="text-gray-500 text-sm!">
            {variantTitle}
          </Paragraph>
          <Price amount={price * quantity} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
