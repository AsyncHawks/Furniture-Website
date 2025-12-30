import { Image, Divider, Price, AddToCartButton } from '@components';

const ProductHeaderOnScroll = ({ product }) => {
  const { id, title, price, image } = product || {};

  if (!product) return null;

  return (
    <>
      <div className="w-full py-2 px-2 bg-(--color-surface-300) sm:px-4 max-w-480">
        <div className="mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={image}
              alt={id}
              className="w-12 h-12 object-cover border-2 border-gray-300"
            />

            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base line-clamp-1">{title}</span>

              {price && <Price amount={price} />}
            </div>
          </div>

          <AddToCartButton className="max-w-40" product={product} />
        </div>
      </div>
      <Divider />
    </>
  );
};

export default ProductHeaderOnScroll;
