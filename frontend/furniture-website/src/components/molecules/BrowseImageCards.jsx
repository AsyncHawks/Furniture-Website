import PropTypes from 'prop-types';
import { ImageCard } from '@components';

const BrowseImageCards = ({ cards }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-4 mt-8">
      {cards.map((card, i) => (
        <ImageCard key={i} src={card.src} title={card.title} desc={card?.desc} index={i} />
      ))}
    </div>
  );
};

BrowseImageCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      title: PropTypes.string,
      desc: PropTypes.string,
    })
  ).isRequired,
  showNum: PropTypes.bool,
};

export default BrowseImageCards;
