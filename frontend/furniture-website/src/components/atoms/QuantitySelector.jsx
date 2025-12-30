import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity, setQuantity, min = 1, max = 99 }) => {
  const increment = () => setQuantity((prev) => Math.min(prev + 1, max));
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, min));

  return (
    <div className="flex justify-between gap-2 items-center border border-gray-400 px-2 w-full h-full max-h-12 min-h-10">
      <Minus size={12} onClick={decrement} className="cursor-pointer h-full w-4" />
      <span className="px-2 select-none">{quantity}</span>
      <Plus size={12} onClick={increment} className="cursor-pointer h-full w-4" />
    </div>
  );
};

export default QuantitySelector;
