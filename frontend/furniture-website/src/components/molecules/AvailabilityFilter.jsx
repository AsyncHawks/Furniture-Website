import { useState } from 'react';
import { Expandable } from '@components';

const AvailabilityFilter = ({ filters, setParams }) => {
  const [selected, setSelected] = useState(filters?.available);

  const options = [
    { label: 'In Stock', value: 'in' },
    { label: 'Out of Stock', value: 'out' },
  ];

  const handleSelect = (value) => {
    const newValue = value === selected ? '' : value;
    setSelected(newValue);

    const param = new URLSearchParams();
    if (newValue) param.set('available', newValue);
    setParams(param);
  };

  return (
    <Expandable title="Availability">
      <div className="flex flex-col gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleSelect(opt.value)}
          >
            <div
              className={`p-1
                w-5 h-5 border-2 border-gray-600 flex items-center justify-center 
                transition-all duration-300
                ${opt.value === selected ? 'opacity-100' : 'opacity-40'} group-hover:opacity-100
              `}
            >
              <div
                className={`
                  w-full h-full bg-black transition-opacity duration-300
                  ${selected === opt.value ? 'opacity-100' : 'opacity-0'}
                `}
              />
            </div>

            <span className="text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
    </Expandable>
  );
};

export default AvailabilityFilter;
