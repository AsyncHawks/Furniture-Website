import {
  Link,
  Heading,
  Price,
  Divider,
  Paragraph,
  AddToCartButton,
  QuantitySelector,
  Button,
  ProductDisplayDetailsSkeleton,
} from '@components';
import { useState } from 'react';

const ProductDisplayDetails = ({ product, loading, onVariantChange, selectedProduct }) => {
  if (loading || !product) return <ProductDisplayDetailsSkeleton />;

  const {
    vendor,
    title,
    price,
    id,
    description,
    features,
    variants,
    freeShipping,
    itemsInStock = 0,
  } = product;

  const [openDetails, setOpenDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleVariantSelect = (variant) => {
    onVariantChange?.({
      productId: product.id,
      variantId: variant?.id || null,
      title: product.title,
      variantTitle: variant?.title || null,
      price: variant?.price || product.price,
      image: product.images?.[0],
      freeShipping: product?.freeShipping,
    });
  };

  return (
    <div className="w-full md:w-2/5 relative md:sticky top-0 md:top-20 flex flex-col gap-4 lg:gap-6">
      <Link to="/collections" underline="center-inverse" className="font-base! w-fit">
        {vendor}
      </Link>

      <div className="flex flex-col gap-4">
        <Heading level={2} variant="medium">
          {title}
        </Heading>
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 items-start lg:items-center">
          <Price amount={selectedProduct?.price || price} />{' '}
          <span className="text-xs">SHIPPING CALCULATED AT CHECKOUT.</span>
        </div>
        <span className="text-xs">
          <span className="text-sm underline">{itemsInStock}</span> items in Stock.
        </span>
        <div className="p-1 px-2 bg-gray-200 w-fit"># {id}</div>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <Paragraph variant="H" maxChars={openDetails ? null : 120}>
          {description}
        </Paragraph>
        {features && (
          <div>
            {openDetails && (
              <div className="mb-2">
                <span className="">Features:</span>{' '}
                <div className="ml-4">
                  {features.map((feat, i) => (
                    <Paragraph key={i} variant="H">
                      - {feat}
                    </Paragraph>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Paragraph
        onClick={() => {
          setOpenDetails(!openDetails);
        }}
        variant="H"
        underline="center-inverse"
        className="cursor-pointer w-fit"
      >
        {!openDetails ? `READ MORE +` : `READ LESS -`}
      </Paragraph>

      {variants?.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>
            <Paragraph variant="H" className="inline">
              SELECTED VARIANT:{' '}
            </Paragraph>{' '}
            <Paragraph variant="H" className="inline font-semibold! ml-2">
              {selectedProduct?.variantTitle || 'N/A'}
            </Paragraph>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {variants.map((variant, i) => (
              <div
                key={i}
                className={`
                p-1 px-2 border cursor-pointer 
                    ${selectedProduct?.variantTitle === variant?.title ? 'border-gray-900' : 'border-gray-300'}`}
                onClick={() => handleVariantSelect(variant)}
              >
                {variant?.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="w-full lg:w-2/5 h-full">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        </div>
        <div className="w-full">
          <AddToCartButton product={selectedProduct} quantity={quantity} />
        </div>
      </div>

      <Button secondary className="font-medium!">
        Chat With Our Interior Consultant
      </Button>

      <div className="flex flex-col gap-2">
        {freeShipping ? (
          <Paragraph variant="H">✓ Free delivery and shipping</Paragraph>
        ) : (
          <Paragraph variant="H">✗ No Free delivery and shipping</Paragraph>
        )}
        <Paragraph variant="H">✓ Secure online payment</Paragraph>
      </div>
    </div>
  );
};

export default ProductDisplayDetails;
