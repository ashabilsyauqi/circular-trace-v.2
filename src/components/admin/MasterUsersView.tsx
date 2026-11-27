import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { AppUser, OperationalService, UserRole } from '../../types/coffee';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Building2,
  AlertCircle,
  AlertTriangle,
  Key,
  Eye,
  EyeOff,
  Check,
  X,
  RefreshCw,
  Printer,
  Copy,
  Share2,
  Download,
  Sprout,
  Factory,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { ACTIVE_OPERATIONAL_SERVICES, KELOMPOK_TANI_SERVICES, ROLE_DETAILS } from '../../constants/roles';
import {
  MemberCredentialCardModal,
  formatWhatsAppCredentialMessage,
} from './MemberCredentialCardModal';

export const MasterUsersView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useCoffee();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<
    'all' | 'petani' | 'pengolah' | 'ict' | 'admin_kelompok_tani'
  >('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Table row password reveal state
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Credential slip modal state
  const [selectedCredentialUser, setSelectedCredentialUser] = useState<AppUser | null>(null);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);

  // Delete modal state
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const togglePasswordVisibility = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Form states
  const defaultOrg = currentUser?.organization || currentUser?.kelompokTaniName || 'Kelompok Tani Mandiri (Ashabil)';
  const defaultLoc = currentUser?.location || 'Desa Awan, Kintamani, Bangli, Bali';

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    nik: string;
    organization: string;
    location: string;
    assignedService: 'petani' | 'pengolah' | 'ict' | 'admin_kelompok_tani';
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    nik: '',
    organization: defaultOrg,
    location: defaultLoc,
    assignedService: 'petani',
    status: 'active',
  });

  // Access Control: Allow admin_kelompok_tani and super_admin
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdminKelompok = currentUser?.role === 'admin_kelompok_tani';

  if (!currentUser || (!isSuperAdmin && !isAdminKelompok)) {
    return (
      <div className="bg-white rounded-xl border border-amber-300 p-8 shadow-sm text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
        <h3 className="text-lg font-black text-stone-900">Akses Terbatas: Khusus Pengelola Kelompok Tani</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Modul Master Anggota &amp; Akun hanya dapat diakses oleh Admin Kelompok Tani atau Super Admin CircularTrace.
        </p>
        <Link
          to="/admin/overview"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <span>Kembali ke Dashboard Utama</span>
        </Link>
      </div>
    );
  }

  // Tenant Scoping: Get users belonging to Kelompok Tani scope
  const userKtId = (currentUser.kelompokTaniId || currentUser.id || '').trim().toLowerCase();
  const userOrg = (currentUser.organization || currentUser.kelompokTaniName || '').trim().toLowerCase();

  const allPoktanUsers = users.filter((u) => {
    const roleOrSrv = u.assignedService || u.role;
    return (
      u.role === 'admin_kelompok_tani' ||
      roleOrSrv === 'petani' ||
      roleOrSrv === 'pengolah' ||
      roleOrSrv === 'ict'
    );
  });

  const tenantFilteredUsers = isSuperAdmin
    ? allPoktanUsers
    : allPoktanUsers.filter((u) => {
        if (u.id === currentUser.id) return true;
        const uKtId = (u.kelompokTaniId || '').trim().toLowerCase();
        const uOrg = (u.organization || u.kelompokTaniName || '').trim().toLowerCase();

        const isSameKtId = Boolean(
          (userKtId && uKtId && (userKtId === uKtId || userKtId === u.id?.toLowerCase() || uKtId === currentUser.id?.toLowerCase())) ||
          (currentUser.kelompokTaniId && u.kelompokTaniId === currentUser.kelompokTaniId)
        );

        const isSameOrg = Boolean(
          userOrg && uOrg && (
            uOrg === userOrg ||
            (userOrg.length > 5 && uOrg.includes(userOrg)) ||
            (uOrg.length > 5 && userOrg.includes(uOrg))
          )
        );

        return isSameKtId || isSameOrg;
      });

  // Base active user pool: fallback to all Poktan users if tenant filter has fewer than 2 to avoid blank screens
  const baseUsers = tenantFilteredUsers.length > 1 ? tenantFilteredUsers : allPoktanUsers;

  // Counts by role
  const petaniUsers = baseUsers.filter((u) => (u.assignedService || u.role) === 'petani');
  const pengolahUsers = baseUsers.filter((u) => (u.assignedService || u.role) === 'pengolah');
  const ictUsers = baseUsers.filter((u) => (u.assignedService || u.role) === 'ict');
  const adminUsers = baseUsers.filter((u) => u.role === 'admin_kelompok_tani');

  const activeCount = baseUsers.filter((u) => u.status !== 'inactive').length;
  const inactiveCount = baseUsers.filter((u) => u.status === 'inactive').length;

  // Filtered list
  const filteredUsers = baseUsers
    .filter((u) => {
      if (selectedRoleFilter === 'all') return true;
      if (selectedRoleFilter === 'admin_kelompok_tani') return u.role === 'admin_kelompok_tani';
      if (selectedRoleFilter === 'ict') return u.role === 'ict' || (u.assignedService as unknown) === 'ict';
      const effectiveRole = u.assignedService || u.role;
      return effectiveRole === selectedRoleFilter;
    })
    .filter((u) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.nik && u.nik.includes(q)) ||
        (u.organization && u.organization.toLowerCase().includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q)
      );
    });

  const getServiceBadge = (user: AppUser) => {
    if (user.role === 'admin_kelompok_tani') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-purple-700" />
          <span>Pengurus Poktan</span>
        </span>
      );
    }

    if (user.role === 'ict' || (user.assignedService as unknown) === 'ict') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Petugas Lapangan (ICS)</span>
        </span>
      );
    }

    if (user.role === 'pengolah' || user.assignedService === 'pengolah') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs">
          <Factory className="w-3.5 h-3.5 text-amber-700" />
          <span>Operator Pengolah (Mill)</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
        <Sprout className="w-3.5 h-3.5 text-emerald-700" />
        <span>Petani Kopi (Hulu)</span>
      </span>
    );
  };

  const handleOpenAddModal = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      password: 'password123',
      phone: '',
      nik: '',
      organization: defaultOrg,
      location: defaultLoc,
      assignedService: 'petani',
      status: 'active',
    });
    setShowFormPassword(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AppUser) => {
    setEditingUserId(user.id);
    const assigned = (
      user.role === 'ict' || (user.assignedService as unknown) === 'ict'
        ? 'ict'
        : user.role === 'admin_kelompok_tani'
        ? 'admin_kelompok_tani'
        : user.assignedService || user.role
    ) as 'petani' | 'pengolah' | 'ict' | 'admin_kelompok_tani';

    setFormData({
      name: user.name,
      email: user.email || `${user.id}@petani.id`,
      password: user.password || 'password123',
      phone: user.phone || '',
      nik: user.nik || '',
      organization: user.organization || defaultOrg,
      location: user.location || defaultLoc,
      assignedService: assigned || 'petani',
      status: user.status || 'active',
    });
    setShowFormPassword(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCopyWaCredential = (user: AppUser) => {
    const text = formatWhatsAppCredentialMessage(user);
    navigator.clipboard.writeText(text);
    showToast(`Kredensial WhatsApp untuk "${user.name}" berhasil disalin! Siap dikirim ke WhatsApp anggota.`);
  };

  const handleOpenCredentialSlip = (user: AppUser) => {
    setSelectedCredentialUser(user);
    setIsCredentialModalOpen(true);
  };

  const handleExportCredentialsCsv = () => {
    const headers = [
      'No',
      'ID Anggota',
      'Nama Lengkap',
      'Posisi / Peran',
      'NIK',
      'No. KTA',
      'Email Login',
      'Password Login',
      'No. WhatsApp',
      'Wilayah / Lokasi',
      'Status Akun',
    ];

    const rows = baseUsers.map((u, i) => [
      i + 1,
      u.id,
      `"${u.name}"`,
      u.role === 'admin_kelompok_tani' ? 'Admin Kelompok Tani' : (u.assignedService || u.role),
      u.nik ? `="${u.nik}"` : '-',
      u.farmerCardNumber || '-',
      u.email || `${u.id}@petani.id`,
      u.password || 'password123',
      u.phone || '-',
      `"${u.location || '-'}"`,
      u.status || 'active',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const poktanSlug = (currentUser?.kelompokTaniName || defaultOrg).replace(/\s+/g, '_');
    link.setAttribute('download', `Rekap_Kredensial_Akun_${poktanSlug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File rekap CSV akun anggota berhasil diunduh!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama lengkap anggota / staf wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email login anggota wajib diisi (contoh: nama@petani.id).');
      return;
    }

    const isAdmin = formData.assignedService === 'admin_kelompok_tani';
    const isIct = formData.assignedService === 'ict';

    let finalRole: UserRole;
    let finalAssignedService: OperationalService | undefined;

    if (isAdmin) {
      finalRole = 'admin_kelompok_tani';
      finalAssignedService = undefined;
    } else if (isIct) {
      finalRole = 'ict';
      finalAssignedService = undefined;
    } else {
      finalRole = formData.assignedService as OperationalService;
      finalAssignedService = formData.assignedService as OperationalService;
    }

    if (editingUserId) {
      // Edit existing user
      updateUser(editingUserId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || 'password123',
        phone: formData.phone.trim(),
        nik: formData.nik.trim() || undefined,
        organization: formData.organization.trim(),
        location: formData.location.trim(),
        role: finalRole,
        assignedService: finalAssignedService,
        status: formData.status,
      });
      showToast(`Data dan akun anggota "${formData.name.trim()}" berhasil diperbarui.`);
    } else {
      // Create new user
      const defaultAvatar = isIct
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : formData.assignedService === 'pengolah'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || 'password123',
        phone: formData.phone.trim() || '0812-0000-0000',
        nik: formData.nik.trim() || undefined,
        organization: formData.organization.trim() || defaultOrg,
        kelompokTaniName: formData.organization.trim() || defaultOrg,
        kelompokTaniId: currentUser?.kelompokTaniId || 'POKTAN-ASHABIL-001',
        location: formData.location.trim() || defaultLoc,
        role: finalRole,
        assignedService: finalAssignedService,
        status: formData.status,
        balance: 0,
        avatar: defaultAvatar,
        registeredAt: new Date().toISOString().split('T')[0],
      });
      showToast(`Akun anggota baru "${formData.name.trim()}" berhasil ditambahkan dan siap digunakan.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;

    if (currentUser && deletingUser.id === currentUser.id) {
      showToast('Tidak dapat menghapus akun Anda sendiri yang sedang aktif login.', 'error');
      setDeletingUser(null);
      return;
    }

    if (deletingUser.role === 'admin_kelompok_tani') {
      showToast('Akun Pengurus / Admin Kelompok Tani dilindungi dari penghapusan.', 'error');
      setDeletingUser(null);
      return;
    }

    const targetName = deletingUser.name;
    deleteUser(deletingUser.id);
    showToast(`Akun anggota "${targetName}" berhasil dihapus dari sistem.`);
    setDeletingUser(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-xs font-bold transition-all animate-in slide-in-from-bottom-2 ${
            toastMessage.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Top Header Bar (AdminLTE Style) */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 border-t-4 border-t-amber-600 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate('/admin/overview')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              ← Pusat Kendali
            </button>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {currentUser?.kelompokTaniName || defaultOrg}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-700" />
            <span>Master Anggota &amp; Akun Kelompok Tani</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Satu pintu registrasi anggota, penugasan stasiun kerja, dan pembagian kredensial login (Email &amp; Password) via <strong>WhatsApp (1 Klik)</strong> atau <strong>Cetak Kartu Fisik</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleExportCredentialsCsv}
            className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-200"
            title="Unduh seluruh daftar akun anggota ke format Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Unduh CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Tambah Anggota Baru</span>
          </button>
        </div>
      </div>

      {/* 2. AdminLTE Metric Infoboxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Anggota */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Anggota Poktan
            </span>
            <span className="text-2xl font-black text-stone-900 mt-0.5 block">
              {baseUsers.length}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">
              {activeCount} akun aktif login
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Petani Kopi */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Petani Kopi (Hulu)
            </span>
            <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
              {petaniUsers.length}
            </span>
            <span className="text-[10px] text-stone-500 font-medium">
              Mitra kebun terdaftar
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        {/* Pengolah (Wet Mill) */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Operator Pengolah
            </span>
            <span className="text-2xl font-black text-amber-700 mt-0.5 block">
              {pengolahUsers.length}
            </span>
            <span className="text-[10px] text-stone-500 font-medium">
              Stasiun Wet Mill &amp; Dry
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Factory className="w-5 h-5" />
          </div>
        </div>

        {/* Petugas ICS */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Petugas Lapangan ICS
            </span>
            <span className="text-2xl font-black text-blue-700 mt-0.5 block">
              {ictUsers.length}
            </span>
            <span className="text-[10px] text-stone-500 font-medium">
              Audit EUDR &amp; Mutu 4C
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama anggota, NIK, email login, nomor WhatsApp, atau dusun/desa..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
              title="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs by Role */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-bold shrink-0 mr-1 flex items-center gap-1 text-[11px]">
            <Filter className="w-3.5 h-3.5" /> Posisi / Peran:
          </span>

          <button
            onClick={() => setSelectedRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              selectedRoleFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Anggota ({baseUsers.length})
          </button>

          <button
            onClick={() => setSelectedRoleFilter('petani')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedRoleFilter === 'petani'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Petani Kopi</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedRoleFilter === 'petani' ? 'bg-black/25 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {petaniUsers.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedRoleFilter('pengolah')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedRoleFilter === 'pengolah'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Operator Pengolah</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedRoleFilter === 'pengolah' ? 'bg-black/25 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {pengolahUsers.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedRoleFilter('ict')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedRoleFilter === 'ict'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Petugas ICS</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedRoleFilter === 'ict' ? 'bg-black/25 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {ictUsers.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedRoleFilter('admin_kelompok_tani')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedRoleFilter === 'admin_kelompok_tani'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Pengurus Poktan</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedRoleFilter === 'admin_kelompok_tani' ? 'bg-black/25 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {adminUsers.length}
            </span>
          </button>
        </div>

        {/* Quick Summary Status Line */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-100">
          <div>
            Menampilkan <strong className="text-stone-800">{filteredUsers.length}</strong> anggota dari total <strong>{baseUsers.length}</strong> anggota terdata
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Aktif: <strong>{activeCount}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" /> Nonaktif: <strong>{inactiveCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Users & Credentials Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[1020px]">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Anggota / Pengguna</th>
                <th className="py-3 px-4">Posisi &amp; Tugas</th>
                <th className="py-3 px-4">Kredensial Login Resmi (Email &amp; Pass)</th>
                <th className="py-3 px-4">Kontak WhatsApp &amp; Domisili</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center sticky right-0 bg-stone-50/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10 font-bold">
                  Bagikan Kredensial &amp; Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">Tidak ada data anggota yang sesuai pencarian atau filter peran.</p>
                    {(searchQuery || selectedRoleFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedRoleFilter('all');
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Pencarian</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const email = user.email || `${user.id}@petani.id`;
                  const password = user.password || 'password123';
                  const isPasswordRevealed = Boolean(revealedPasswords[user.id]);

                  return (
                    <tr key={user.id} className="group hover:bg-amber-50/25 transition-colors">
                      {/* No */}
                      <td className="py-3.5 px-4 text-center text-stone-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Anggota Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-2xs shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <strong className="text-stone-900 font-bold block truncate text-xs sm:text-sm">
                              {user.name}
                            </strong>
                            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 flex-wrap">
                              {user.nik && (
                                <span className="font-mono text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded text-[10px]">
                                  NIK: {user.nik}
                                </span>
                              )}
                              <span className="font-mono text-[10px]">ID: {user.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Posisi & Tugas */}
                      <td className="py-3.5 px-4">
                        <div>{getServiceBadge(user)}</div>
                        <div className="text-[10px] text-stone-400 mt-1 truncate max-w-[160px]">
                          {user.kelompokTaniName || user.organization || '-'}
                        </div>
                      </td>

                      {/* Kredensial Login Resmi */}
                      <td className="py-3.5 px-4">
                        <div className="bg-stone-50 group-hover:bg-white p-2 rounded-xl border border-stone-200 space-y-1 max-w-[240px] transition-colors">
                          {/* Email */}
                          <div className="flex items-center justify-between gap-1 text-[11px]">
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="font-mono font-semibold text-stone-900 truncate" title={email}>
                                {email}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(email);
                                showToast(`Email login "${email}" disalin!`);
                              }}
                              className="text-stone-400 hover:text-amber-800 p-0.5 cursor-pointer shrink-0"
                              title="Salin Email Login"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Password */}
                          <div className="flex items-center justify-between gap-1 text-[11px] pt-0.5 border-t border-stone-200/60">
                            <div className="flex items-center gap-1.5">
                              <Key className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="font-mono text-amber-900 font-bold">
                                {isPasswordRevealed ? password : '••••••••'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                                title={isPasswordRevealed ? 'Sembunyikan Password' : 'Lihat Password'}
                              >
                                {isPasswordRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(password);
                                  showToast(`Password untuk "${user.name}" disalin!`);
                                }}
                                className="text-stone-400 hover:text-amber-800 p-0.5 cursor-pointer"
                                title="Salin Password"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kontak WhatsApp & Lokasi */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="font-mono">{user.phone || '-'}</span>
                          {user.phone && user.phone.startsWith('08') && (
                            <a
                              href={`https://wa.me/62${user.phone.slice(1).replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-600 hover:underline inline-flex items-center gap-0.5"
                              title="Buka Chat WhatsApp"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1 truncate max-w-[180px]">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{user.location || user.village || 'Kintamani, Bangli'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {user.status === 'inactive' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                            <XCircle className="w-3 h-3 shrink-0" /> Nonaktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Aktif
                          </span>
                        )}
                      </td>

                      {/* Actions: Salin WA, Cetak Slip, Edit, Hapus */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-amber-50/40 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10">
                        <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap shrink-0">
                          {/* 1-Click WhatsApp Credential Share */}
                          <button
                            type="button"
                            onClick={() => handleCopyWaCredential(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold border border-emerald-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                            title="Salin format pesan WhatsApp akun siap kirim (1 Klik)"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Salin WA</span>
                          </button>

                          {/* Cetak Slip / Kartu Kredensial */}
                          <button
                            type="button"
                            onClick={() => handleOpenCredentialSlip(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-800 hover:text-white text-stone-800 text-xs font-bold border border-stone-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                            title="Cetak slip atau kartu identitas resmi dengan QR barcode login"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-600" />
                            <span>Cetak Slip</span>
                          </button>

                          {/* Edit User */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(user)}
                            className="inline-flex items-center p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all cursor-pointer shadow-2xs active:scale-95"
                            title="Edit data anggota"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                          </button>

                          {/* Delete User */}
                          {user.role === 'admin_kelompok_tani' ? (
                            <span
                              className="p-1.5 rounded-lg text-stone-300 border border-stone-200 select-none cursor-default"
                              title="Akun Pengurus Poktan dilindungi dari penghapusan"
                            >
                              <Shield className="w-3.5 h-3.5 text-stone-400" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingUser(user)}
                              disabled={currentUser?.id === user.id}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
                                currentUser?.id === user.id
                                  ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed opacity-40'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 cursor-pointer active:scale-95'
                              }`}
                              title={currentUser?.id === user.id ? 'Tidak dapat menghapus akun Anda sendiri' : 'Hapus anggota'}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Tambah / Edit Pengguna */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  {editingUserId ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    {editingUserId ? 'Edit Data & Akun Anggota' : 'Tambah Anggota & Buat Akun Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {editingUserId
                      ? `ID Anggota: ${editingUserId}`
                      : 'Daftarkan anggota baru ke dalam ekosistem kelompok tani'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Role / Posisi Picker (Kelompok Tani Scope) */}
              <div>
                <label className="block font-black text-stone-900 mb-1.5">
                  Posisi / Stasiun Kerja Anggota <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Petani */}
                  <div
                    onClick={() => setFormData({ ...formData, assignedService: 'petani' })}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
                      formData.assignedService === 'petani'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <Sprout className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="block text-[11px]">Petani Kopi</span>
                  </div>

                  {/* Pengolah */}
                  <div
                    onClick={() => setFormData({ ...formData, assignedService: 'pengolah' })}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
                      formData.assignedService === 'pengolah'
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <Factory className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                    <span className="block text-[11px]">Operator Mill</span>
                  </div>

                  {/* Petugas ICS */}
                  <div
                    onClick={() => setFormData({ ...formData, assignedService: 'ict' })}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
                      formData.assignedService === 'ict'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="block text-[11px]">Petugas ICS</span>
                  </div>

                  {/* Pengurus Poktan */}
                  <div
                    onClick={() => setFormData({ ...formData, assignedService: 'admin_kelompok_tani' })}
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer text-center ${
                      formData.assignedService === 'admin_kelompok_tani'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="block text-[11px]">Pengurus Poktan</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Name & NIK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: I Kadek Arnata"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="Contoh: 5106042505860004"
                    maxLength={16}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Email Login & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Email Akun Login <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="petani.tegalsari1@petani.id"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp / HP</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081237014476"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Password & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      Password Login <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: 'password123' })}
                      className="text-[10px] text-amber-700 hover:underline cursor-pointer font-semibold"
                    >
                      Reset Default: password123
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Password login akun"
                      className="w-full pl-9 pr-10 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      title={showFormPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dusun / Desa / Lokasi</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Desa Awan, Kintamani, Bangli"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Organization */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Kelompok Tani / Organisasi</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Kelompok Tani Mandiri (Ashabil)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Status toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <span className="font-bold text-stone-700">Status Akun Login</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'active'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'inactive' })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'inactive'
                        ? 'bg-stone-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Nonaktif
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer shadow-sm"
                >
                  {editingUserId ? 'Simpan Perubahan' : 'Daftarkan Anggota & Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Konfirmasi Hapus Anggota */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">Konfirmasi Hapus Anggota</h3>
                <p className="text-xs text-stone-500">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={deletingUser.avatar}
                  alt={deletingUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-stone-900 text-sm truncate">{deletingUser.name}</div>
                  <div className="text-xs text-stone-500 truncate">{deletingUser.email || '-'}</div>
                  <div className="text-[11px] text-stone-400">ID: {deletingUser.id}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Peran:</span>
                <div>{getServiceBadge(deletingUser)}</div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong className="text-stone-900">"{deletingUser.name}"</strong>? Anggota ini tidak akan dapat login lagi ke portal.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Cetak Slip Kredensial & Kartu Anggota */}
      <MemberCredentialCardModal
        isOpen={isCredentialModalOpen}
        onClose={() => {
          setIsCredentialModalOpen(false);
          setSelectedCredentialUser(null);
        }}
        user={selectedCredentialUser}
        onCopySuccess={(name) => {
          showToast(`Kredensial WhatsApp untuk "${name}" berhasil disalin!`);
        }}
      />
    </div>
  );
};
