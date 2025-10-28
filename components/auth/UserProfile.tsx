'use client';

import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { logoutUser } from '@/lib/store/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function UserProfile() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{user.firstname} {user.lastname}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 capitalize">
            {user.role} • {user.status}
          </p>
        </div>
      </div>
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="ml-auto"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
