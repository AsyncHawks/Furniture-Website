const CollectionCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="overflow-hidden rounded">
        <div className="w-full aspect-square bg-gray-400" />
      </div>

      <div className="flex justify-center mt-5">
        <div className="h-4 w-1/2 bg-gray-400 rounded" />
      </div>
    </div>
  );
};

export default CollectionCardSkeleton;
