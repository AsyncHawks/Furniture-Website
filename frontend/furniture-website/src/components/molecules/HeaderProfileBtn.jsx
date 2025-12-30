import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, LogOut } from 'lucide-react';
import { Tooltip } from '@components';
import { logoutThunk } from '@store';

const HeaderProfileBtn = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoggedIn } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutThunk());
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip text="Profile">
        <div
          className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 p-1 cursor-pointer flex items-center justify-center"
          onClick={() => setOpen((prev) => !prev)}
        >
          <User className="w-full h-full" />
        </div>
      </Tooltip>

      {open && isLoggedIn && userInfo && (
        <div className="absolute -right-4 mt-2 min-w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <p className="font-medium text-gray-800">{userInfo.username}</p>
            <p className="text-sm text-gray-500">{userInfo.email}</p>
          </div>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderProfileBtn;
