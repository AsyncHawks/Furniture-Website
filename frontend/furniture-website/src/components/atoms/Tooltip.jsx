import { useState } from 'react';

const Tooltip = ({ text, children, direction = 'bottom' }) => {
  const [isHovered, setIsHovered] = useState(false);

  let tooltipClasses = '';
  let translateClass = '';

  switch (direction) {
    case 'top':
      tooltipClasses = 'bottom-full mb-2 left-1/2';
      translateClass = '-translate-x-1/2 translate-y-1';
      break;
    case 'bottom':
      tooltipClasses = 'top-full mt-2 left-1/2';
      translateClass = '-translate-x-1/2 -translate-y-1';
      break;
    case 'left':
      tooltipClasses = 'right-full mr-2 top-1/2';
      translateClass = 'translate-x-1 -translate-y-1/2';
      break;
    case 'right':
      tooltipClasses = 'left-full ml-2 top-1/2';
      translateClass = '-translate-x-1 -translate-y-1/2';
      break;
    default:
      tooltipClasses = 'bottom-full mb-2 left-1/2';
      translateClass = '-translate-x-1/2 translate-y-1';
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <span
          className={`absolute ${tooltipClasses} ${translateClass} w-max max-w-xs bg-gray-700 text-white text-sm rounded px-2 py-1 whitespace-nowrap z-50 tooltip-fade-in`}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Tooltip;
