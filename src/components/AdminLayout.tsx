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
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased">
      <AdminHeader title={currentUser.organization} subtitle={currentUser.name} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
