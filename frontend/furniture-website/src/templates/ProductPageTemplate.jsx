import { useEffect, useRef, useState } from 'react';
import {
  ProductNavbar,
  ProductDisplay,
  ProductDetails,
  ProductsCarousal,
  ProductHeaderOnScroll,
} from '@components';

const ProductPageTemplate = ({ product, loading }) => {
  const detailsRef = useRef(null);
  const [showHeader, setShowHeader] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState({
    productId: null,
    variantId: null,
    title: '',
    variantTitle: null,
    price: 0,
    image: '',
    freeShipping: true,
  });

  useEffect(() => {
    if (product) {
      const firstVariant = product.variants?.[0] || null;
      setSelectedProduct({
        productId: product.id,
        variantId: firstVariant?.id || null,
        title: product.title,
        variantTitle: firstVariant?.title || null,
        price: firstVariant?.price || product.price,
        image: firstVariant?.image || product.images?.[0] || '',
        freeShipping: product?.freeShipping,
      });
    }
  }, [product]);

  useEffect(() => {
    if (!detailsRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    observer.observe(detailsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex flex-col w-full bg-(--color-surface-300) items-center">
      <div
        className={`
          w-full fixed z-40 transition-all duration-300 ease-out
          ${showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}
        `}
      >
        <ProductHeaderOnScroll product={selectedProduct} />
      </div>
      <div className="max-w-480 w-full py-4 px-2 lg:px-8 flex flex-col gap-4 relative">
        <ProductNavbar
          loading={loading}
          category={product?.generalCategory}
          productName={product?.title}
        />
        <ProductDisplay
          loading={loading}
          product={product}
          onVariantChange={setSelectedProduct}
          selectedProduct={selectedProduct}
        />

        <div ref={detailsRef}>
          <div className="mt-12">
            <ProductDetails product={product} />
          </div>
          <ProductsCarousal title="You may also like" products={product?.relatedProducts} />
        </div>
      </div>
    </main>
  );
};

export default ProductPageTemplate;
