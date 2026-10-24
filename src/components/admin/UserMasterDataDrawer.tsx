import React from 'react';
import { AppUser } from '../../types/coffee';
import { UserMasterDataDetailPage } from './UserMasterDataDetailPage';

export interface UserMasterDataDrawerProps {
  user: AppUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserMasterDataDrawer: React.FC<UserMasterDataDrawerProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center">
      <div className="bg-white rounded-3xl w-full max-w-7xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        <div className="p-4 sm:p-6">
          <UserMasterDataDetailPage user={user} onBack={onClose} />
        </div>
      </div>
    </div>
  );
};

export default UserMasterDataDrawer;
