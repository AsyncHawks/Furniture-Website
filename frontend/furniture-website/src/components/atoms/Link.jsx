import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Underline } from '@components';

const Link = ({ to, children, className = '', underline, ...props }) => {
  const underlineEnabled = Boolean(underline);

  return (
    <RouterLink
      to={to}
      className={`font-medium text-sm inline-block ${underlineEnabled ? 'group' : ''} ${className}`}
      {...props}
    >
      <span className="relative inline-block">
        {children}
        {underlineEnabled && <Underline direction={underline} />}
      </span>
    </RouterLink>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  underline: PropTypes.oneOf(['left', 'center', 'right']),
};

export default Link;
