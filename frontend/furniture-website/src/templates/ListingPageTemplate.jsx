import { Heading, Divider } from '@components';
import PropTypes from 'prop-types';

const ListingPageTemplate = ({ children, title }) => {
  return (
    <div className="mx-auto flex flex-col items-center bg-(--color-surface-400)">
      <Heading level={2} variant="secondary" className="my-4 text-center!">
        {title}
      </Heading>
      <div className="w-full bg-(--color-surface-300)">
        <div className="max-w-390 mx-auto px-2 sm:px-8 py-12 flex flex-col gap-6 sm:gap-8">
          {children}
        </div>
        <Divider />
      </div>
    </div>
  );
};

ListingPageTemplate.PropTypes = {
  title: PropTypes.string.isRequired,
};

export default ListingPageTemplate;
