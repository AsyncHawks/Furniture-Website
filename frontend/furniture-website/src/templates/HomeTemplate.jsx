import {
  InspirationCard,
  BadgesSection,
  BrowseSection,
  HeroContentBlock,
  InfoSection,
  InstructionSection,
} from '@components';

const HomeTemplate = () => {
  return (
    <>
      <section className="relative h-150 md:160 lg:h-150 2xl:h-185 bg-[url(/images/MaskGroup.jpg)] object-cover bg-center flex justify-center items-center p-2">
        <HeroContentBlock />
      </section>
      <section className="w-full bg-(--color-surface-100)">
        <BadgesSection />
      </section>
      <InspirationCard
        title="Inspiration Collection"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        imgSrc="/images/Insp.png"
        imgAlt="Inspiration Collection"
      />
      <section className="w-full bg-(--color-surface-100) flex justify-center">
        <InfoSection />
      </section>
      <BrowseSection
        title="Browse The Range"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <InstructionSection
        title="How It Works"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </>
  );
};

export default HomeTemplate;
