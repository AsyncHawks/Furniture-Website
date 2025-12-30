import PropTypes from 'prop-types';
import { Heading, Image, Paragraph } from '@components';

const ImageCard = ({ src, title, desc, index, showNum }) => {
  return (
    <div className="flex flex-col gap-6 relative">
      <div className="relative mx-auto">
        <Image src={src} alt={title || 'image'} />

        {showNum && (
          <div
            className="
              absolute left-1/2 bottom-0
              translate-y-1/2
              -translate-x-1/2
              w-3/12 aspect-square
              rounded-full
              bg-white
              flex items-center justify-center
              font-semibold text-white
            "
          >
            <div className="bg-black w-8/12 rounded-full aspect-square flex justify-center items-center">
              {index + 1}.
            </div>
          </div>
        )}
      </div>
      {showNum && <div className="h-2" />}
      {title && (
        <Heading variant="tertiary" className="text-(--color-text-secondary)">
          {title}
        </Heading>
      )}
      {desc && (
        <Paragraph variant="D" className="text-(--color-text-tertiary)">
          {desc}
        </Paragraph>
      )}
    </div>
  );
};

ImageCard.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  desc: PropTypes.string,
  showNum: PropTypes.bool,
  index: PropTypes.number,
};

export default ImageCard;
