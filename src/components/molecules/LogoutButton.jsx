import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden sm:block">
        <span className="text-sm text-secondary-600">Welcome, {user?.firstName || 'User'}</span>
      </div>
      <Button
        onClick={logout}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <ApperIcon name="LogOut" size={16} />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default LogoutButton;