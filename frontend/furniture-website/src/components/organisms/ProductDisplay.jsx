import { ProductPageImages, ProductDisplayDetails } from '@components';

const ProductDisplay = ({ product, loading, selectedProduct, onVariantChange }) => {
  return (
    <section className="relative flex flex-col md:flex-row gap-8 md:gap-4 lg:gap-16 justify-between">
      <ProductPageImages loading={loading} images={product?.images} />
      <ProductDisplayDetails
        loading={loading}
        product={product}
        onVariantChange={onVariantChange}
        selectedProduct={selectedProduct}
      />
    </section>
  );
};

export default ProductDisplay;
