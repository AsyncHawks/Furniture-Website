import PropTypes from 'prop-types';
import { Underline } from '@components';

const variants = {
  primary: 'text-4xl lg:text-5xl leading-10 lg:leading-16 font-bold',
  secondary: 'text-4xl lg:text-5xl font-normal',
  secondaryBold: 'text-3xl lg:text-4xl font-medium',
  tertiary: 'text-xl md:text-2xl font-semibold',
  medium: 'text-xl font-semibold',
  title: 'text-base font-semibold',
};

const Heading = ({
  children,
  level = 1,
  variant = 'primary',
  className = '',
  underline,
  maxChars,
}) => {
  const Tag = `h${level}`;
  const underlineEnabled = Boolean(underline);

  let text = children;
  if (typeof maxChars === 'number' && typeof text === 'string' && text.length > maxChars) {
    text = text.slice(0, maxChars).trimEnd() + '...';
  }

  return (
    <Tag
      className={`${variants[variant]} ${className} ${underlineEnabled ? 'group inline-block' : ''}`}
    >
      <span className="relative inline-block">
        {text}
        {underlineEnabled && <Underline direction={underline} />}
      </span>
    </Tag>
  );
};

Heading.propTypes = {
  children: PropTypes.node.isRequired,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'title']),
  className: PropTypes.string,
  underline: PropTypes.oneOf(['left', 'center', 'right']),
  maxChars: PropTypes.number,
};

export default Heading;
