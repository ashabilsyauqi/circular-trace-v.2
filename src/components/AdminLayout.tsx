import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { AdminHeader } from './admin/AdminHeader';
import { SuperAdminDashboardLayout } from './admin/SuperAdminDashboardLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

import { UserRole } from '../types/coffee';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser, route, users } = useCoffee();

  if (!currentUser) return null;

  const targetService = (route.view === 'dashboard' && route.service) ? route.service.toLowerCase() : currentUser.role;
  const effectiveRole: UserRole = targetService === 'admin' ? 'superadmin' : (targetService as UserRole);

  // Super Admin Novizar gets the dedicated standard Admin Panel Dashboard with left sidebar
  if (effectiveRole === 'superadmin') {
    return <SuperAdminDashboardLayout>{children}</SuperAdminDashboardLayout>;
  }

  const activeStationUser = (currentUser.role === effectiveRole)
    ? currentUser
    : (users.find(u => u.role === effectiveRole) || currentUser);

  // Operational roles (Petani, Pengolah, Gudang, Roaster, Cafe, Verifikator) keep their compact AdminHeader
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#18110D] flex flex-col font-sans antialiased">
      <AdminHeader title={activeStationUser.organization} subtitle={activeStationUser.name} />
      <main className="o_form_sheet_bg flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
