import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '@components';

const HeaderAuthBtn = () => {
  return (
    <Link to="/login" className="flex">
      <Tooltip text="Login">
        <LogIn size={28} />
      </Tooltip>
    </Link>
  );
};

export default HeaderAuthBtn;
