import { Heading, Paragraph, Button } from '@components';
import { useNavigate } from 'react-router-dom';

const HeroContentBlock = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-1/2 max-w-160 h-90 sm:h-110 bg-(--color-surface-200) rounded-xl relative md:absolute top-0 md:top-1/2 translate-y-0 md:-translate-y-1/2 left-0 md:left-1/2 flex justify-center items-center px-4 sm:px-8">
      <div className="flex flex-col gap-4">
        <Paragraph variant="A" className="text-(--color-text-secondary)">
          New Arrival
        </Paragraph>
        <Heading variant="primary" className="text-(--color-brand-primary)">
          Discover Our New Collection
        </Heading>
        <Paragraph variant="F" maxChars={140}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
          ullamcorper mattis.
        </Paragraph>
        <Button
          onClick={() => {
            navigate('/collections');
          }}
          className="text-white"
          rounded
        >
          BUY NOW
        </Button>
      </div>
    </div>
  );
};

export default HeroContentBlock;
