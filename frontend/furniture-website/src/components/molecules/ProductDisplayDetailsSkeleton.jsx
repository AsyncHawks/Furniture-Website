const ProductDisplayDetailsSkeleton = () => {
  return (
    <div className="w-full md:w-2/5 relative md:sticky top-0 md:top-20 flex flex-col gap-4 lg:gap-6 px-4 lg:px-0 animate-pulse">
      <div className="h-4 w-32 bg-gray-300 rounded" />

      <div className="flex flex-col gap-4">
        <div className="h-8 w-3/4 bg-gray-300 rounded" />
        <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 items-start lg:items-center">
          <div className="h-6 w-20 bg-gray-300 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded text-xs hidden lg:block" />{' '}
        </div>
        <div className="h-5 w-20 bg-gray-200 rounded px-1 py-0.5">#ID</div>
      </div>

      <div className="h-px w-full bg-gray-200 my-2" />

      <div className="flex flex-col gap-2">
        <div className="h-16 w-full bg-gray-300 rounded" />
        <div className="space-y-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-4 w-32 bg-gray-300 rounded cursor-pointer mt-2" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-4 w-40 bg-gray-300 rounded" />
        <div className="flex flex-wrap gap-2 mt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="w-full lg:w-2/5 h-10 bg-gray-200 rounded" />
        <div className="w-full h-10 bg-gray-300 rounded" />
      </div>

      <div className="w-full h-10 bg-gray-300 rounded" />

      <div className="flex flex-col gap-2 mt-2">
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ProductDisplayDetailsSkeleton;
