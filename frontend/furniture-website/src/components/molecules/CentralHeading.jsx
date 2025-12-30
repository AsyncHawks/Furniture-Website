import PropTypes from 'prop-types';
import { Heading, Paragraph } from '@components';

const CentralHeading = ({ title, description }) => {
  return (
    <>
      <Heading level={2} variant="secondary" className="text-(--color-text-secondary)">
        {title}
      </Heading>
      <Paragraph variant="B" className="text-(--color-text-tertiary)">
        {description}
      </Paragraph>
    </>
  );
};

CentralHeading.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CentralHeading;
