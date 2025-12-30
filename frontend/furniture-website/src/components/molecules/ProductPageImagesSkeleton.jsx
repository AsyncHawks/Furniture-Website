const ProductPageImagesSkeleton = () => {
  return (
    <div className="relative md:sticky top-0 md:top-30 h-fit md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-14rem)] w-full md:w-3/5 flex flex-col-reverse lg:flex-row gap-4 animate-pulse">
      <div
        className="
          flex flex-row lg:flex-col gap-4
          overflow-x-auto lg:overflow-y-auto overscroll-none
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
        "
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 md:h-28 w-16 md:w-28 bg-gray-300 rounded border-2 border-gray-200 shrink-0"
          />
        ))}
      </div>

      <div className="flex-1 relative w-full lg:max-h-none max-h-[75vh] bg-gray-300 rounded overflow-hidden">
        <div className="h-100 md:h-full w-full bg-gray-300 rounded" />

        <div className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-gray-200 rounded" />

        <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-gray-200 rounded" />

        <div className="absolute bottom-2 right-2 h-10 w-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
export default ProductPageImagesSkeleton;
