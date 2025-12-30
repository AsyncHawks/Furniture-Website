import { formatPrice } from '@utils';
import { useSelector } from 'react-redux';

const Price = ({ amount, className = '' }) => {
  const currency = useSelector((state) => state.global.currency);
  return <span className={`${className}`}>{formatPrice(amount, currency)}</span>;
};

export default Price;
