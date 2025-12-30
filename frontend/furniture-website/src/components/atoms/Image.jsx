import { useState } from 'react';

const Image = ({ src, alt = 'alt text', className = '', ...props }) => {
  const [fallback, setFallback] = useState(false);

  return (
    <img
      {...props}
      src={fallback || !src ? '/images/placeholder.jpg' : src}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setFallback(true)}
    />
  );
};

export default Image;
