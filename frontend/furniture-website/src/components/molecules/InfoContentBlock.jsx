import { Button, Heading, Paragraph } from '@components';

const InfoContentBlock = () => {
  return (
    <div className="flex flex-col gap-10 w-full lg:w-1/2">
      <Heading variant="secondary" className="text-(--color-text-secondary)">
        Beautify Your Space
      </Heading>
      <Paragraph variant="C" className="text-(--color-text-tertiary)">
        Do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris.
      </Paragraph>
      <Button rounded className="text-white">
        LEARN MORE
      </Button>
    </div>
  );
};

export default InfoContentBlock;
