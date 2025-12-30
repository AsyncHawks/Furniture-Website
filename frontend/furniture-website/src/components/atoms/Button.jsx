import PropTypes from 'prop-types';

const Button = ({
  children,
  className = '',
  rounded = false,
  type = 'button',
  secondary = false,
  disable = false,
  ...props
}) => {
  return (
    <button
      disabled={disable}
      type={type}
      className={`cursor-pointer px-12 ${rounded ? 'rounded-full' : 'rounded-lg'}
      ${
        secondary
          ? 'text-base font-normal max-w-none bg-(--color-brand-secondary) min-h-11'
          : 'text-lg font-semibold bg-(--color-brand-primary) max-w-fit min-h-16 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500 transition-colors duration-300'
      } text-white 
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  rounded: PropTypes.bool,
};

export default Button;
