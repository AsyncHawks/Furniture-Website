import PropTypes from 'prop-types';
import { ImageCard } from '@components';

const InstructionImageCards = ({ cards }) => {
  return (
    <div className="flex flex-col md:flex-row gap-14 md:gap-4 mt-8">
      {cards.map((card, i) => (
        <ImageCard key={i} src={card.src} title={card.title} desc={card.desc} index={i} showNum />
      ))}
    </div>
  );
};

InstructionImageCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      title: PropTypes.string,
      desc: PropTypes.string,
    })
  ).isRequired,
  showNum: PropTypes.bool,
};

export default InstructionImageCards;
