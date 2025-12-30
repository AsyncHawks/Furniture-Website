import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productAPI } from '@services';
import { ProductPageTemplate } from '@templates';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();

  useEffect(() => {
    setLoading(true);
    productAPI
      .fetchById(productId)
      .then((res) => {
        setProduct(res?.product);
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  return <ProductPageTemplate product={product} loading={loading} />;
};

export default ProductPage;
