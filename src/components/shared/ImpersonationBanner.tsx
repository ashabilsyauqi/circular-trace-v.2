import React from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { Crown, ArrowLeft, ShieldAlert, UserCheck } from 'lucide-react';
import { ROLE_DETAILS } from '../../constants/roles';

export const ImpersonationBanner: React.FC = () => {
  const { currentUser, impersonatingFromUser, returnToSuperAdmin } = useCoffee();

  // Show if impersonating, OR if currentUser is not superadmin but localStorage has the impersonation token
  const isImpersonating = Boolean(
    impersonatingFromUser ||
      (typeof window !== 'undefined' && localStorage.getItem('cct_impersonating_superadmin'))
  );

  if (!isImpersonating || !currentUser || currentUser.role === 'superadmin') {
    return null;
  }

  const roleLabel = ROLE_DETAILS[currentUser.role]?.label || currentUser.role;

  return (
    <aside
      aria-label="Mode Inspeksi Super Admin"
      className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 px-3.5 sm:px-6 py-2 sticky top-0 z-[100] flex flex-wrap items-center justify-between gap-3 shadow-lg border-b-2 border-stone-950/20 font-sans"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="p-1.5 rounded-lg bg-stone-950 text-amber-400 shrink-0 shadow-xs">
          <Crown className="w-4 h-4 animate-pulse" />
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-black uppercase tracking-wider bg-stone-950 text-amber-300 px-2 py-0.5 rounded text-[10px]">
            Mode Inspeksi Super Admin
          </span>
          <span className="font-medium text-stone-950">
            Anda sedang mengontrol stasiun: <strong className="font-black underline">{currentUser.name}</strong> ({roleLabel} &bull; {currentUser.organization})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => returnToSuperAdmin()}
          className="px-3.5 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-amber-400 hover:text-white font-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border border-amber-500/40"
          title="Keluar dari akun ini dan kembali ke panel kendali Super Admin Novizar"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Super Admin Novizar</span>
        </button>
      </div>
    </aside>
  );
};
