import PropTypes from 'prop-types';
import { Image, CentralHeading } from '@components';

const InspirationCard = ({ title, description, imgSrc, imgAlt }) => {
  return (
    <div className="flex flex-col items-center text-center gap-4 my-14 px-6 sm:px-14">
      <CentralHeading title={title} description={description} />
      <Image src={imgSrc} alt={imgAlt} className="w-full h-auto rounded-lg mt-10 max-w-480" />
    </div>
  );
};

InspirationCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};

export default InspirationCard;
