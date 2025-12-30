import { Heading, Image } from '@components';

const InstagramGallery = () => {
  return (
    <div className="flex flex-col gap-6">
      <Heading level={4} variant="tertiary">
        Instagram Shop
      </Heading>

      <div className="flex gap-4 flex-wrap">
        {[1, 2, 3, 4].map((num) => (
          <Image
            key={num}
            src={`/images/IG-${num}.jpg`}
            alt={`instagram-${num}`}
            className="w-2/3 sm:w-37 xl:w-43"
          />
        ))}
      </div>
    </div>
  );
};

export default InstagramGallery;
