import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { AdminHeader } from './admin/AdminHeader';
import { SuperAdminDashboardLayout } from './admin/SuperAdminDashboardLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser } = useCoffee();

  if (!currentUser) return null;

  // Super Admin Novizar gets the dedicated standard Admin Panel Dashboard with left sidebar
  if (currentUser.role === 'superadmin') {
    return <SuperAdminDashboardLayout>{children}</SuperAdminDashboardLayout>;
  }

  // Operational roles (Petani, Pengolah, Gudang, Roaster, Cafe, Verifikator) keep their compact AdminHeader
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#18110D] flex flex-col font-sans antialiased">
      <AdminHeader title={currentUser.organization} subtitle={currentUser.name} />
      <main className="o_form_sheet_bg flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
