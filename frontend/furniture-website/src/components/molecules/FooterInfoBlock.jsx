import { Heading, Paragraph } from '@components';

const FooterInfoBlock = () => {
  return (
    <div className="flex flex-col w-full lg:w-1/3">
      <Heading level={4} variant="tertiary">
        Beauty Care
      </Heading>

      <Paragraph variant="F" className="text-(--color-text-inverse) mt-8 mb-4">
        Do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris.
      </Paragraph>

      <Heading level={4} variant="tertiary">
        Follow Us
      </Heading>
    </div>
  );
};

export default FooterInfoBlock;
