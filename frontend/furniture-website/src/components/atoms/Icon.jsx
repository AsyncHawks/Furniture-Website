import PropTypes from 'prop-types';

const Icon = ({ src, alt, className = '' }) => {
  return <img src={src} alt={alt} className={className} />;
};

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Icon;
