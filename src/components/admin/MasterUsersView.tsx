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
} from 'lucide-react';
import { ACTIVE_OPERATIONAL_SERVICES, KELOMPOK_TANI_SERVICES, ROLE_DETAILS } from '../../constants/roles';

export const MasterUsersView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useCoffee();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<
    'all' | OperationalService | 'ict' | 'verifikator' | 'admin_kelompok_tani'
  >('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    organization: string;
    location: string;
    assignedService: OperationalService | 'ict' | 'verifikator' | 'admin_kelompok_tani';
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    organization: 'Gapoktan Kopi Mandiri Nusantara',
    location: 'Pangalengan, Jawa Barat',
    assignedService: 'petani',
    status: 'active',
  });

  // Scope Kelompok Tani: HANYA membawahi Petani, Pengolah, dan Petugas ICS
  const kelompokTaniUsers = users.filter((u) => {
    const roleOrSrv = u.assignedService || u.role;
    return (
      u.role === 'admin_kelompok_tani' ||
      roleOrSrv === 'petani' ||
      roleOrSrv === 'pengolah' ||
      roleOrSrv === 'ict'
    );
  });

  // Filtered users list
  const filteredUsers = kelompokTaniUsers
    .filter((u) => {
      if (selectedServiceFilter === 'all') return true;
      if (selectedServiceFilter === 'ict') return u.role === 'ict' || (u.assignedService as unknown) === 'ict';
      const effectiveService = u.assignedService || (u.role as OperationalService);
      return effectiveService === selectedServiceFilter;
    })
    .filter((u) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        (u.organization && u.organization.toLowerCase().includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q)) ||
        u.id.toLowerCase().includes(q)
      );
    });

  const getServiceBadge = (user: AppUser) => {
    if (user.role === 'admin_kelompok_tani') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Admin Kelompok Tani</span>
        </span>
      );
    }

    if (user.role === 'ict' || (user.assignedService as unknown) === 'ict') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-blue-700" />
          <span>Petugas ICS (Internal)</span>
        </span>
      );
    }

    if (user.role === 'verifikator') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Verifikator Mutu &amp; SCA</span>
        </span>
      );
    }

    const service = (user.assignedService || user.role) as OperationalService;
    const meta = ROLE_DETAILS[service];
    if (!meta) return null;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${meta.badgeClass}`}>
        {meta.icon}
        <span>{meta.label}</span>
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
      organization: 'Gapoktan Kopi Mandiri Nusantara',
      location: 'Pangalengan, Jawa Barat',
      assignedService: 'petani',
      status: 'active',
    });
    setShowPassword(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AppUser) => {
    setEditingUserId(user.id);
    const assigned = (
      user.role === 'ict' || (user.assignedService as unknown) === 'ict'
        ? 'ict'
        : user.role === 'verifikator'
        ? 'verifikator'
        : user.role === 'admin_kelompok_tani'
        ? 'admin_kelompok_tani'
        : user.assignedService || user.role
    ) as OperationalService | 'ict' | 'verifikator' | 'admin_kelompok_tani';

    setFormData({
      name: user.name,
      email: user.email || '',
      password: user.password || 'password123',
      phone: user.phone || '',
      organization: user.organization || 'Gapoktan Kopi Mandiri Nusantara',
      location: user.location || 'Pangalengan, Jawa Barat',
      assignedService: assigned || 'petani',
      status: user.status || 'active',
    });
    setShowPassword(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Nama lengkap pengguna wajib diisi.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email / Username pengguna wajib diisi.');
      return;
    }

    const isAdmin = formData.assignedService === 'admin_kelompok_tani';
    const isIct = formData.assignedService === 'ict';
    const isVerifikator = formData.assignedService === 'verifikator';

    let finalRole: UserRole;
    let finalAssignedService: OperationalService | undefined;

    if (isAdmin) {
      finalRole = 'admin_kelompok_tani';
      finalAssignedService = undefined;
    } else if (isIct) {
      finalRole = 'ict';
      finalAssignedService = undefined;
    } else if (isVerifikator) {
      finalRole = 'verifikator';
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
        password: formData.password.trim() || undefined,
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        location: formData.location.trim(),
        role: finalRole,
        assignedService: finalAssignedService,
        status: formData.status,
      });
      showToast(`Data pengguna "${formData.name.trim()}" berhasil diperbarui.`);
    } else {
      // Create new user
      const defaultAvatar = isIct
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : isVerifikator
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim() || 'password123',
        phone: formData.phone.trim() || '0812-0000-0000',
        organization: formData.organization.trim() || 'Gapoktan Kopi Mandiri Nusantara',
        location: formData.location.trim() || 'Pangalengan, Jawa Barat',
        role: finalRole,
        assignedService: finalAssignedService,
        status: formData.status,
        balance: 0,
        avatar: defaultAvatar,
      });
      showToast(`Akun pengguna baru "${formData.name.trim()}" berhasil ditambahkan.`);
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
      showToast('Akun Induk Admin Kelompok Tani dilindungi dan tidak dapat dihapus.', 'error');
      setDeletingUser(null);
      return;
    }

    const targetName = deletingUser.name;
    deleteUser(deletingUser.id);
    showToast(`Akun pengguna "${targetName}" berhasil dihapus.`);
    setDeletingUser(null);
  };

  if (!currentUser || currentUser.role !== 'super_admin') {
    return (
      <div className="bg-white rounded-lg border border-amber-300 p-6 shadow-sm text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
        <h3 className="text-lg font-bold text-stone-900">Akses Terbatas: Khusus Super Admin CircularTrace</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          Manajemen master users dan akun ekosistem hanya dapat diakses secara eksklusif oleh Super Admin CircularTrace.
        </p>
        <Link
          to="/admin/overview"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold transition-colors"
        >
          <span>Kembali ke Dashboard Utama</span>
        </Link>
      </div>
    );
  }

  const activeCount = users.filter((u) => u.status !== 'inactive').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;

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

      {/* 1. Top Header Bar (AdminLTE Card Style) */}
      <div className="bg-white rounded-lg p-5 border border-stone-200 border-t-4 border-t-amber-600 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/overview')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              ← Kembali ke Control Tower
            </button>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-700" />
            <span>Master Users &amp; Penugasan Layanan</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Atur penugasan eksklusif staf/anggota kelompok tani: <strong>1 Akun hanya dapat ditugaskan ke tepat 1 Layanan Operasional</strong>.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-md bg-[#343a40] hover:bg-stone-900 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* 2. Filter & Search Controls (AdminLTE Card Style) */}
      <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, email, no HP, wilayah, atau organisasi..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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

        {/* Filter Tabs by Service */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-stone-400 font-bold shrink-0 mr-1 flex items-center gap-1 text-[11px]">
            <Filter className="w-3.5 h-3.5" /> Filter Layanan:
          </span>

          <button
            onClick={() => setSelectedServiceFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              selectedServiceFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua ({kelompokTaniUsers.length})
          </button>

          {KELOMPOK_TANI_SERVICES.map((srv) => {
            const count = kelompokTaniUsers.filter((u) => (u.assignedService || u.role) === srv).length;
            const meta = ROLE_DETAILS[srv];
            const isSelected = selectedServiceFilter === srv;

            return (
              <button
                key={srv}
                onClick={() => setSelectedServiceFilter(srv)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? srv === 'ict'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{meta.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-black/25 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick status bar */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
          <div>
            Menampilkan <strong className="text-stone-800">{filteredUsers.length}</strong> dari <strong>{users.length}</strong> pengguna terdaftar
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

      {/* 3. Table of Users (AdminLTE Card Style with Sticky Action Column) */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[950px]">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-4 whitespace-nowrap">Pengguna</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Kontak</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Layanan Ditugaskan (1-to-1)</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Organisasi &amp; Wilayah</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap sticky right-0 bg-stone-50/95 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10 font-bold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">Tidak ada data pengguna yang sesuai pencarian atau filter.</p>
                    {(searchQuery || selectedServiceFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedServiceFilter('all');
                        }}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Filter &amp; Pencarian</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-amber-50/30 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <strong className="text-stone-900 font-bold block truncate text-xs sm:text-sm">
                            {user.name}
                          </strong>
                          <span className="text-[11px] text-stone-400 block truncate">
                            ID: {user.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{user.email || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                        <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{user.phone || '-'}</span>
                      </div>
                    </td>

                    {/* Assigned Service Badge */}
                    <td className="py-3.5 px-4">
                      {getServiceBadge(user)}
                    </td>

                    {/* Organization / Location */}
                    <td className="py-3.5 px-4 text-stone-700">
                      <div className="font-medium truncate max-w-[200px]">{user.organization || '-'}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-[200px] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0" /> {user.location || '-'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {user.status === 'inactive' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-300 whitespace-nowrap shrink-0">
                          <XCircle className="w-3 h-3 shrink-0" /> Nonaktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> Aktif
                        </span>
                      )}
                    </td>

                    {/* Actions (Sticky Right Column) */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-amber-50/40 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] z-10">
                      <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap shrink-0">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                          title="Edit data dan peran pengguna"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button / Protected Badge */}
                        {user.role === 'admin_kelompok_tani' ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-stone-100 text-stone-400 border border-stone-200 select-none cursor-default"
                            title="Akun Induk dilindungi dari penghapusan"
                          >
                            <Shield className="w-3 h-3 text-stone-400" />
                            <span>Induk</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeletingUser(user)}
                            disabled={currentUser?.id === user.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-2xs ${
                              currentUser?.id === user.id
                                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 cursor-pointer hover:shadow-xs active:scale-95'
                            }`}
                            title={currentUser?.id === user.id ? 'Tidak dapat menghapus akun Anda sendiri' : 'Hapus akun pengguna'}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Tambah / Edit Pengguna */}
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
                    {editingUserId ? 'Edit Data Pengguna & Penugasan' : 'Tambah Pengguna Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {editingUserId
                      ? `ID Pengguna: ${editingUserId}`
                      : 'Daftarkan anggota/staf baru ke dalam sistem kelompok tani'}
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
              {/* Row 1: Name */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Lengkap Anggota / Staf <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Email / Username Login <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="budi@petani.id"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
                      placeholder="0812-3456-7890"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Password & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Password Akun <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Password login akun"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Wilayah / Lokasi Operasional</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Pangalengan, Jawa Barat"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Organization */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">Organisasi / Lembaga / Unit Usaha</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Gapoktan Kopi Mandiri Nusantara"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* SERVICE ASSIGNMENT (STRICT 1-TO-1 RADIO / BUTTON PICKER) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black text-stone-900 block">
                    Penugasan Layanan Operasional / Peran <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Wajib Pilih Tepat 1 Layanan
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-2.5">
                  Setiap akun difokuskan pada satu stasiun kerja di dalam rantai pasok terpadu.
                </p>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {/* Kelompok Tani Services: HANYA Petani, Pengolah, & Petugas ICS */}
                  {KELOMPOK_TANI_SERVICES.map((srv) => {
                    const meta = ROLE_DETAILS[srv];
                    const isSelected = formData.assignedService === srv;
                    const isIct = srv === 'ict';

                    return (
                      <div
                        key={srv}
                        onClick={() => setFormData({ ...formData, assignedService: srv })}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? isIct
                              ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                              : 'border-amber-600 bg-amber-50/70 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${meta.badgeClass}`}>
                            {meta.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 text-xs">
                              {meta.label}
                            </div>
                            <div className="text-[10px] text-stone-500 truncate">
                              {meta.description}
                            </div>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isIct
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-amber-600 bg-amber-600 text-white'
                            : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}

                  {/* Option: Admin Kelompok Tani (Only shown if editing admin) */}
                  {formData.assignedService === 'admin_kelompok_tani' && (
                    <div
                      className="p-2.5 rounded-xl border-2 border-amber-600 bg-amber-50/70 shadow-xs flex items-center justify-between gap-3 cursor-default"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 text-xs">
                            Admin Kelompok Tani (Akun Induk)
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">
                            Control Tower pengelola ekosistem terpadu &amp; penugasan akun anggota
                          </div>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <span className="font-bold text-stone-700">Status Akun Pengguna</span>
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
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
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
                  {editingUserId ? 'Simpan Perubahan' : 'Buat & Daftarkan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Konfirmasi Hapus Pengguna */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">Konfirmasi Hapus Pengguna</h3>
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
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Organisasi:</span>
                <span className="font-semibold text-stone-700 truncate max-w-[180px]">{deletingUser.organization}</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun <strong className="text-stone-900">"{deletingUser.name}"</strong>? Akun ini tidak akan dapat lagi masuk ke sistem atau mengelola transaksi kopi.
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
    </div>
  );
};
