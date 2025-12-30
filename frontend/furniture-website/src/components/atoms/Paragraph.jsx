import PropTypes from 'prop-types';
import { Underline } from '@components';

const variants = {
  A: 'font-medium text-base sm:text-lg leading-4xl',
  B: 'font-normal text-lg sm:text-xl leading-[100%] text-center',
  C: 'font-normal text-lg sm:text-xl leading-4xl',
  D: 'font-normal text-base sm:text-lg leading-3xl text-center',
  E: 'font-normal text-lg sm:text-xl leading-4xl text-center',
  F: 'font-normal text-sm sm:text-base leading-3xl',
  G: 'font-normal text-xl sm:text-3xl leading-4xl',
  H: 'font-light text-sm sm:text-base leading-base',
};

const Paragraph = ({ children, className = '', underline, variant = 'A', maxChars, ...props }) => {
  const underlineEnabled = Boolean(underline);
  let text = children;
  if (!text) return;

  if (typeof maxChars === 'number' && text.length > maxChars) {
    text = text.slice(0, maxChars).trimEnd() + '...';
  }

  return (
    <p className={`${variants[variant]} whitespace-pre-line ${className}`} {...props}>
      <span className="relative inline-block group font-">
        {text}
        {underlineEnabled && <Underline direction={underline} />}
      </span>
    </p>
  );
};

Paragraph.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(Object.keys(variants)),
  maxChars: PropTypes.number,
  underline: PropTypes.oneOf(['right', 'center', 'left']),
};

export default Paragraph;
