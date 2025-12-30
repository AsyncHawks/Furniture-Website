import { Image, Paragraph, Heading, Price } from '@components';
import { Link } from 'react-router-dom';
import { slugify } from '@utils';

const CheckoutProductCard = ({ item }) => {
  return (
    <div className="flex h-16">
      <div className="relative h-16 w-16 rounded-lg border-3 shadow-[0_0_0.2rem_rgba(0,0,0,0.4)] border-gray-100 flex items-center">
        <div className="absolute top-0 right-0 px-2 py-1 text-xs rounded-md translate-x-1/2 -translate-y-1/2 bg-gray-950 text-white flex justify-center items-center shadow-[0_0_0.2rem_rgba(0,0,0,0.4)] border-3 border-gray-100">
          {item?.quantity || `?`}
        </div>
        <Link to={`/product/${item.productId}/${slugify(item?.title)}`} className="h-full w-full">
          <Image src={item?.image} alt={item?.title} className="h-full w-9/12 mx-auto" />
        </Link>
      </div>
      <div className="flex-1 flex justify-between items-center pr-2 pl-4">
        <div className="flex h-full flex-col justify-center">
          <Heading level={3} variant="title" maxChars={38}>
            {item?.title}
          </Heading>
          <Paragraph variant="H" className="text-gray-500">
            {item?.variantTitle}
          </Paragraph>
        </div>
        <Price className="text-end" amount={item?.price} />
      </div>
    </div>
  );
};

export default CheckoutProductCard;
