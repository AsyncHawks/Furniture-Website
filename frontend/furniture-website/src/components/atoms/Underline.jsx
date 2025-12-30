import PropTypes from 'prop-types';

const underlineOrigin = {
  left: 'origin-left',
  center: 'origin-center',
  right: 'origin-right',
};

const Underline = ({ direction = 'left', thickness = '1px', className = '' }) => {
  const isInverse = direction.includes('inverse');

  const pureDirection = direction.replace('-inverse', '');

  const base = isInverse
    ? 'scale-x-100 opacity-100'
    : 'scale-x-0 opacity-10 group-hover:opacity-100';
  const hover = isInverse ? 'group-hover:scale-x-[0.2]' : 'group-hover:scale-x-100';

  return (
    <span
      className={`
        absolute left-0 bottom-0 w-full bg-current
        transform transition-all duration-300 ease-out
        ${base}
        ${hover}
        
        ${underlineOrigin[pureDirection]}
        ${className}
      `}
      style={{ height: thickness }}
    />
  );
};

Underline.propTypes = {
  direction: PropTypes.oneOf([
    'left',
    'center',
    'right',
    'left-inverse',
    'center-inverse',
    'right-inverse',
  ]),
  thickness: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
};

export default Underline;
