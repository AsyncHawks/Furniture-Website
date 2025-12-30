import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const SideBarOverlay = ({ isOpen, onClose, side = 'left', children }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-60 transition-all duration-300
        ${isOpen ? 'bg-black/40 pointer-events-auto' : 'bg-transparent pointer-events-none'}
      `}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed top-0 p-2 md:p-5 h-full bg-(--color-surface-300) shadow-xl transition-transform duration-300 w-11/12 min-w-64 max-w-150
          ${side === 'left' ? 'left-0' : 'right-0'}
          ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
        `}
      >
        <div className="flex justify-end">
          <X className="cursor-pointer text-gray-600" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

SideBarOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  side: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node.isRequired,
};

export default SideBarOverlay;
