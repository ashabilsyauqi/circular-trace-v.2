import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminHeader } from './admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { currentUser } = useCoffee();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col lg:flex-row font-sans antialiased">
      {/* 1. Cruip Collapsible & Mobile Drawer Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentTab={activeSubTab}
        onSelectTab={setActiveSubTab}
      />

      {/* 2. Main Admin Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Cruip Top Header with Quick Search, Popover & Verified Badge */}
        <AdminHeader
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title={currentUser.organization}
          subtitle={currentUser.name}
        />

        {/* Dynamic Admin Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
