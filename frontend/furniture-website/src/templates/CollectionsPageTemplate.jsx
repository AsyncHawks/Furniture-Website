import { CollectionCardSkeleton, CollectionCard, Heading } from '@components';

const CollectionsPageTemplate = ({ collections = [], loading }) => {
  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-16 w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <CollectionCardSkeleton key={i} />
          ))}
        </div>
      ) : collections?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-16 w-full">
          {collections?.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <Heading level={5} variant="tertiary" className="w-full text-center">
          No Collections Available
        </Heading>
      )}
    </>
  );
};

export default CollectionsPageTemplate;
