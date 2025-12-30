const ProductNavbarSkeleton = () => {
  return (
    <div className="absolute top-4 sm:top-0 z-20 sm:relative flex items-center gap-12 animate-pulse">
      <div className="flex gap-2 items-center p-1 pr-2 bg-gray-200/80 rounded">
        <div className="h-3 w-3 bg-gray-300 rounded" />
        <div className="h-3 w-16 bg-gray-300 rounded" />
      </div>

      <div className="hidden md:flex gap-1">
        <div className="h-3 w-10 bg-gray-300 rounded" />
        <div className="h-3 w-3 bg-gray-200 rounded mx-1 text-gray-400">/</div>

        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="h-3 w-3 bg-gray-200 rounded mx-1 text-gray-400">/</div>

        <div className="h-3 w-20 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default ProductNavbarSkeleton;
