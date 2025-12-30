import PropTypes from 'prop-types';
import { Icon, Heading, Paragraph } from '@components';

const Badge = ({ icon, title, description }) => {
  return (
    <div className="flex gap-2 items-center justify-between w-full lg:w-fit max-w-96">
      <Icon src={icon} alt={title} className="h-12" />
      <div>
        <Heading level={4} variant="tertiary" className="text-(--color-text-secondary)">
          {title}
        </Heading>
        <Paragraph variant="F" className="text-(--color-text-secondary)">
          {description}
        </Paragraph>
      </div>
    </div>
  );
};

Badge.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Badge;
