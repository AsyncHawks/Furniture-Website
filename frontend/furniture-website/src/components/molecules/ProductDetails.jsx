import { Heading, Divider, ProductCard, Expandable, Paragraph } from '@components';

const ProductDetails = ({ product }) => {
  if (!product) return;
  const { description, features, buyTogether } = product;

  return (
    <section className="flex flex-col md:flex-row gap-10 md:gap-30 items-center">
      <div className="w-full md:w-1/2 h-full flex flex-col gap-2">
        <Heading level={3} variant="secondaryBold" className="my-4">
          Complete The Set
        </Heading>
        <Divider className="mb-4 md:mb-12" />
        <Expandable title="Description" className="px-2">
          <div className="flex flex-col gap-2">
            <Paragraph variant="H">{description}</Paragraph>
            {features && (
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
        </Expandable>
        <Divider />
      </div>
      <div className="w-full md:w-1/2 grid grid-cols-2 gap-2 md:gap-8">
        {buyTogether?.map((prod, i) => (
          <ProductCard key={i} product={prod} />
        ))}
      </div>
    </section>
  );
};

export default ProductDetails;
