const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse w-full aspect-3/4 flex flex-col gap-3">
      <div className="flex-1 bg-gray-400 rounded" />

      <div className="flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-gray-400 rounded" />
        <div className="h-4 w-1/2 bg-gray-400 rounded" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
