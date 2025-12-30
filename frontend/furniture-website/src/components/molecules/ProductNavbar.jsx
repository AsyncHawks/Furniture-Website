import { slugify } from '@utils';
import { Breadcrumb, ProductNavbarSkeleton } from '@components';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ProductNavbar = ({ loading, category, productName }) => {
  const categorySlug = slugify(category);

  if (loading) return <ProductNavbarSkeleton />;

  return (
    <div className="absolute top-4 sm:top-0 z-20 sm:relative flex items-center gap-12">
      <Link
        to={`/collections/${categorySlug}`}
        className="flex gap-2 items-center p-1 pr-2 text-black opacity-100 sm:opacity-60 sm:hover:opacity-100 transition-opacity duration-300 bg-gray-200/80 rounded"
      >
        <ChevronLeft size={14} className="" />{' '}
        <span className="text-xs whitespace-nowrap">GO BACK</span>
      </Link>
      <div className="hidden md:block">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: `${category}`, href: `/collections/${categorySlug}` },
            { label: `${productName}` },
          ]}
        />
      </div>
    </div>
  );
};

export default ProductNavbar;
