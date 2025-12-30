import { InfoContentBlock, InfoImageBlock } from '@components';

const InfoSection = () => {
  return (
    <section className="min-h-218 mx-auto p-4 sm:p-14 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 max-w-480">
      <InfoContentBlock />
      <InfoImageBlock />
    </section>
  );
};

export default InfoSection;
