import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { AdminHeader } from './admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// No sidebar: the sticky AdminHeader (App Launcher + role module tabs + Profile menu) is the
// only navigation surface for the admin panel, so it stays visible at a fixed height on scroll
// no matter how long the page content underneath gets.
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser } = useCoffee();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      <AdminHeader title={currentUser.organization} subtitle={currentUser.name} />

      <main className="o_form_sheet_bg flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
