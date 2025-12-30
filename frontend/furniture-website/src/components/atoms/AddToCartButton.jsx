import PropTypes from 'prop-types';
import { BWButton } from '@components';
import { Plus } from 'lucide-react';
import { openCart, addToCart } from '@store';
import { useDispatch } from 'react-redux';

const AddToCartButton = ({
  type = 'text',
  product = {},
  quantity = 1,
  className = '',
  ...props
}) => {
  const dispatch = useDispatch();
  return (
    <BWButton
      type={type}
      icon={type === 'icon' ? <Plus /> : null}
      text="ADD TO CART"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(openCart());
        dispatch(addToCart({ ...product, quantity }));
      }}
      className={`${className}`}
      {...props}
    />
  );
};

AddToCartButton.propTypes = {
  type: PropTypes.string,
  product: PropTypes.shape({
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    variantTitle: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
  quantity: PropTypes.number,
  className: PropTypes.string,
};

export default AddToCartButton;
