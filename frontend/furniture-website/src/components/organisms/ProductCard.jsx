import PropTypes from 'prop-types';
import { Paragraph, Heading, Image, Price, AddToCartButton } from '@components';
import { slugify } from '@utils';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductCard = ({ product }) => {
  if (!product?.id) return;
  const { id, title, price, images } = product;

  const [hovered, setHovered] = useState(false);
  const [productForCart, setProductForCart] = useState({});

  const slug = slugify(title);

  useEffect(() => {
    if (product) {
      const firstVariant = product.variants?.[0] || null;
      setProductForCart({
        productId: product.id,
        variantId: firstVariant?.id || null,
        title: product.title,
        variantTitle: firstVariant?.title || null,
        price: firstVariant?.price || product.price,
        image: firstVariant?.image || product.images?.[0] || '',
      });
    }
  }, [product]);

  return (
    <Link
      to={`/product/${id}/${slug}`}
      className="overflow-hidden w-full flex flex-col gap-3 cursor-pointer group rounded "
    >
      <div
        className="relative w-full aspect-3/4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={images[0]}
          alt="product-image-1"
          className={`object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 ${
            hovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {images[1] && (
          <Image
            src={images[1]}
            alt="product-image-2"
            className={`object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <AddToCartButton
          product={productForCart}
          type="icon"
          className="absolute right-2 bottom-2 "
        />
      </div>
      <div className="flex flex-col gap-1">
        <Heading level={3} variant="title" maxChars={38}>
          {title}
        </Heading>
        <Paragraph variant="H">
          <Price amount={price} />
        </Paragraph>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    priceRange: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ProductCard;
