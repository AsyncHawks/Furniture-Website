import { Heading, Paragraph, FooterForm } from '@components';

const FooterSubscribeSection = () => {
  return (
    <div className="w-full max-w-480 h-80 flex flex-col justify-center items-center text-center px-4">
      <Heading level={4} variant="secondary">
        Join Our Mailing List
      </Heading>

      <Paragraph variant="C" className="text-(--color-text-tertiary) mt-4 mb-10">
        Sign up to receive inspiration, product updates, <br />
        and special offers from our team.
      </Paragraph>

      <FooterForm />
    </div>
  );
};

export default FooterSubscribeSection;
