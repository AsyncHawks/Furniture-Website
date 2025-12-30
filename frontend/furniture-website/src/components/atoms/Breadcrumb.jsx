import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="w-full">
      <ol className="flex items-center gap-1 text-xs text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-gray-800 transition-colors font-medium underline underline-offset-2"
                >
                  {item.label.toUpperCase()}
                </Link>
              ) : (
                <span className="text-gray-800 font-semibold">{item.label.toUpperCase()}</span>
              )}

              {!isLast && <span className=" mx-1 text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumb;
