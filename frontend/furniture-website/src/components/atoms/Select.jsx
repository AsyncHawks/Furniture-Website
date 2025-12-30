import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  error = '',
  className = '',
  selectClassName = '',
  ...props
}) => {
  return (
    <div className={`relative w-full flex flex-col gap-1 ${className}`}>
      <label
        className={`z-10 text-sm text-gray-700 absolute left-3          top-2
        transition-all duration-300 pointer-events-none`}
      >
        {label}
      </label>

      <ChevronDown
        size={18}
        className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer pointer-events-none"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full h-14 px-2  rounded-lg bg-white
          border border-gray-300
          focus:outline-none cursor-pointer
          focus:ring-1 transition-all duration-300 focus:ring-blue-600 focus:border-blue-600
          text-gray-900
          pt-6 scrollbar-thin appearance-none
          ${selectClassName}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option className="cursor-pointer" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
