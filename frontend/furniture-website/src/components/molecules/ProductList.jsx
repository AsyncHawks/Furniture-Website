import { Heading, CheckoutProductCard } from '@components';

const ProductList = ({ products }) => (
  <div>
    <Heading variant="medium">Products</Heading>
    <div className="w-full flex flex-col gap-4 max-h-64 py-4 overflow-y-auto scrollbar-thin">
      {products?.map((item, i) => (
        <CheckoutProductCard key={item.productId} item={item} />
      ))}
    </div>
  </div>
);

export default ProductList;
