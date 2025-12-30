import { Image } from '@components';

const InfoImageBlock = () => {
  return (
    <div className="w-full sm:w-1/2 max-w-140">
      <div className="relative">
        <Image src="/images/Girl.png" alt="About store" className="relative z-10 w-11/12" />
        <Image
          src="/images/Ellipse.png"
          alt="Ellipse"
          className="h-1/2 absolute top-1/2 -translate-y-1/2 right-0 z-0"
        />
      </div>
    </div>
  );
};

export default InfoImageBlock;
