import { CollectionsPageTemplate, ListingPageTemplate } from '@templates';
import { useEffect, useState } from 'react';
import { collectionsAPI } from '@services';

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    collectionsAPI
      .fetchAll()
      .then((res) => {
        setCollections(res);
      })
      .catch((err) => {
        console.error('Collections API error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ListingPageTemplate title="Collection">
        <CollectionsPageTemplate collections={collections} loading={loading} />
      </ListingPageTemplate>
    </>
  );
};

export default CollectionPage;
