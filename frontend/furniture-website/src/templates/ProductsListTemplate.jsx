import { ProductsFilter, ProductCard, Heading, ProductCardSkeleton, Pagination } from '@components';
import PropTypes from 'prop-types';

const ProductsListTemplate = ({ pagination, setParams, products, loading, filters, params }) => {
  return (
    <>
      <ProductsFilter filters={filters} setParams={setParams} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-14">
          {Array.from({ length: 16 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-14">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Heading level={5} variant="tertiary" className="w-full text-center">
          No Products Available
        </Heading>
      )}

      {pagination && (
        <Pagination
          pagination={pagination}
          currentPage={filters.page}
          onPageChange={(page) => {
            const newParams = new URLSearchParams(params);
            newParams.set('page', page);
            setParams(newParams);
          }}
        />
      )}
    </>
  );
};

ProductsListTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired,
};

export default ProductsListTemplate;
