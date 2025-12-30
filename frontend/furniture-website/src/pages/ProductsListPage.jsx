import { ProductsListTemplate, ListingPageTemplate } from '@templates';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '@services';
import { useParams } from 'react-router-dom';

const ProductsListPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useSearchParams();
  const pageSize = 12;

  const filters = {
    category: categoryName,
    available: params.get('available') === 'in',
    price_min: params.get('price_min') || '',
    price_max: params.get('price_max') || '',
    sort: params.get('sort') || 'featured',
    page: Number(params.get('page') || 1),
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    productAPI
      .fetchByCategory(categoryName, filters.page, pageSize, {
        available: filters.available,
        price_min: filters.price_min,
        price_max: filters.price_max,
        sort: filters.sort,
      })
      .then((res) => {
        setProducts(res?.products);
        setPagination(res?.pagination);
      })
      .catch((err) => {
        console.error('Products API error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.toString()]);

  return (
    <ListingPageTemplate
      title={
        categoryName
          ? categoryName
              .split('-')
              .map((word) => word[0].toUpperCase() + word.slice(1, word.length))
              .join(' ') + ' | Furniture'
          : 'Products'
      }
    >
      <ProductsListTemplate
        pagination={pagination}
        setParams={setParams}
        products={products}
        loading={loading}
        filters={filters}
        params={params}
      />
    </ListingPageTemplate>
  );
};

export default ProductsListPage;
