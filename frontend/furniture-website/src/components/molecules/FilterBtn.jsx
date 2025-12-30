import { ChevronRight } from 'lucide-react';

const FilterBtn = ({ text = 'Filters', onClick = () => {}, className }) => {
  return (
    <div
      onClick={onClick}
      className={`border border-gray-400 transition-colors duration-300 h-fit px-8 py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-300 ${className}`}
    >
      {text}
      <span className="rotate-90">
        <ChevronRight />
      </span>
    </div>
  );
};

export default FilterBtn;
