import React from 'react';

export const AdminLTEFooter: React.FC = () => {
  return (
    <footer className="h-12 bg-white border-t border-stone-200 px-4 sm:px-6 flex items-center justify-between text-xs text-stone-500 shrink-0">
      <div>
        <strong>Copyright &copy; 2026 <span className="text-amber-800 font-bold">CircularCoffee</span>.</strong>{' '}
        Platform Rantai Pasok Kopi Kelompok Tani Nusantara.
      </div>
      <div className="hidden sm:block text-[11px] text-stone-500">
        <b>CircularCoffee OS</b> v2.4 Enterprise
      </div>
    </footer>
  );
};
