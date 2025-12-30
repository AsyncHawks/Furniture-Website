import { Image, ProductPageImagesSkeleton } from '@components';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useState } from 'react';

const ProductPageImages = ({ images, loading }) => {
  if (loading) return <ProductPageImagesSkeleton />;

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="relative md:sticky top-0 md:top-26 h-fit md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-14rem)] w-full md:w-3/5 flex items-center justify-center">
        <div className="text-center w-full h-full">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            No images available
          </div>
        </div>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const [start, setStart] = useState({ x: 0, y: 0 });

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    setPosition({ x: 0, y: 0 });
  };

  const startDrag = (e) => {
    if (!isZoomed) return;
    setDragging(true);
    setHasDragged(false);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const duringDrag = (e) => {
    if (!dragging) return;

    const newX = e.clientX - start.x;
    const newY = e.clientY - start.y;

    if (Math.abs(newX - position.x) > 3 || Math.abs(newY - position.y) > 3) {
      setHasDragged(true);
    }

    const limit = 300;
    const boundedX = Math.max(Math.min(newX, limit), -limit);
    const boundedY = Math.max(Math.min(newY, limit), -limit);

    setPosition({ x: boundedX, y: boundedY });
  };

  const resetZoom = () => {
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
    setStart({ x: 0, y: 0 });
    setDragging(false);
    setHasDragged(false);
  };

  const stopDrag = () => {
    setDragging(false);
  };

  const handleClick = () => {
    if (hasDragged) return;
    toggleZoom();
  };

  const handleImageChange = (i) => {
    if (i === currentIndex) return;
    setCurrentIndex(i);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    resetZoom();
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
    resetZoom();
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
    resetZoom();
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    resetZoom();
  };

  return (
    <>
      <div className="relative md:sticky top-0 md:top-26 h-fit lg:h-[calc(100vh-14rem)] w-full md:w-3/5 flex flex-col-reverse lg:flex-row gap-4">
        <div
          className="
            flex flex-row lg:flex-col gap-4
            overflow-x-auto lg:overflow-y-auto overscroll-none
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
          "
        >
          {images.map((image, i) => (
            <div
              key={i}
              className={`
                cursor-pointer border-2 h-fit w-16 md:w-28 shrink-0
                ${i === currentIndex ? 'border-gray-400' : 'border-transparent'}
              `}
              onClick={() => handleImageChange(i)}
            >
              <Image src={image} className="aspect-37/46 select-none" />
            </div>
          ))}
        </div>

        <div className="flex-1 lg:max-h-none max-h-9/12 relative">
          {currentIndex > 0 && (
            <ChevronLeft
              className="bg-white rounded p-2 w-10 h-10 absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
              size={24}
              onClick={prevImage}
            />
          )}
          {currentIndex < images.length - 1 && (
            <ChevronRight
              className="bg-white rounded p-2 w-10 h-10 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
              size={24}
              onClick={nextImage}
            />
          )}

          <Maximize2
            className="absolute bottom-2 right-2 bg-white p-2 w-10 h-10 rounded cursor-pointer z-10"
            onClick={openFullScreen}
          />

          <div className="h-100 md:h-full">
            <Image src={images[currentIndex]} className="h-full w-full select-none" />
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div
          className="fixed inset-0 bg-(--color-surface-300)/90 z-50 flex items-center justify-center p-1 md:p-4"
          onClick={closeFullScreen}
        >
          <div
            className="relative flex items-center justify-center h-fit sm:h-full w-full sm:w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${isZoomed ? 'cursor-grab' : 'cursor-zoom-in'} h-full flex items-center justify-center `}
              onClick={handleClick}
              onMouseDown={startDrag}
              onMouseMove={duringDrag}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
            >
              <Image
                src={images[currentIndex]}
                className={`
                  select-none h-full
                  ${dragging ? '' : 'transition-transform duration-200'}
                `}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${isZoomed ? 1.5 : 1})`,
                  cursor: isZoomed ? 'grab' : 'zoom-in',
                }}
              />
            </div>
          </div>
          <X
            className="bg-white rounded p-2 w-10 h-10 absolute right-2 top-2 cursor-pointer z-10"
            size={28}
            onClick={closeFullScreen}
          />

          {currentIndex > 0 && (
            <ChevronLeft
              className="bg-white rounded p-2 w-10 h-10 absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
              size={32}
              onClick={prevImage}
            />
          )}

          {currentIndex < images.length - 1 && (
            <ChevronRight
              className="bg-white rounded p-2 w-10 h-10 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
              size={32}
              onClick={nextImage}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ProductPageImages;
