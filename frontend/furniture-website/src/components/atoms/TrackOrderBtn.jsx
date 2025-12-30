import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '@components';

const TrackOrderBtn = ({ className = '' }) => {
  return (
    <Tooltip text="Track Order">
      <Link to="/track-order" className="relative cursor-pointer">
        <MapPin size={26} className={`${className}`} />
      </Link>
    </Tooltip>
  );
};

export default TrackOrderBtn;
