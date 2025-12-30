import { useSelector } from 'react-redux';
import { HeaderProfileBtn, HeaderAuthBtn } from '@components';

const UserHeaderBtn = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  if (!isLoggedIn) return <HeaderAuthBtn />;
  return <HeaderProfileBtn />;
};

export default UserHeaderBtn;
