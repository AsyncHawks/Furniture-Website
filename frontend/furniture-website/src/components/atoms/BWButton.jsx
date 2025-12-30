const variants = {
  text: 'h-11 w-full',
  icon: `w-11 h-11 p-1 sm:p-2 
         bg-gray-950 text-white cursor-pointer opacity-0 pointer-events-none rounded
         group-hover:opacity-80 group-hover:pointer-events-auto hover:opacity-100
         transition-opacity duration-300 flex justify-center items-center`,
};

const BWButton = ({
  text = 'Button',
  icon,
  className = '',
  onClick = () => {},
  variant = 'black',
  type = 'text',
  buttonType = 'button',
  disabled = false,
  ...props
}) => {
  const variantClasses =
    variant === 'black'
      ? 'text-white border border-black hover:bg-white hover:text-black bg-black'
      : 'text-black border border-black hover:bg-black hover:text-white bg-white';

  return (
    <button
      {...props}
      onClick={onClick}
      type={buttonType}
      disabled={disabled}
      className={`
        ${variantClasses}
        cursor-pointer font-normal text-[12px] transition-colors duration-300 select-none
        ${type === 'icon' ? variants.icon : variants.text}
        ${className}
      `}
    >
      {type === 'text' ? text : icon}
    </button>
  );
};

export default BWButton;
