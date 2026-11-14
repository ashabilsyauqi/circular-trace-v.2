import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { AppUser, OperationalService, UserRole } from '../../types/coffee';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  Phone,
  Mail,
  MapPin,
  Building2,
  AlertCircle,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { ACTIVE_OPERATIONAL_SERVICES, ROLE_DETAILS } from '../../constants/roles';

export const MasterUsersView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, assignUserService, setAdminKelompokTab, currentUser } = useCoffee();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<'all' | OperationalService | 'ict'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password?: string;
    phone: string;
    organization: string;
    location: string;
    assignedService: OperationalService | 'ict';
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

  const [formError, setFormError] = useState<string | null>(null);

  // Filtered users list (exclude verifikator as requested)
  const filteredUsers = users
    .filter((u) => u.role !== 'verifikator') // Verifikator disembunyikan/nonaktif sementara
    .filter((u) => {
      // Exclude the admin itself from the regular operator list or show at top
      if (selectedServiceFilter === 'all') return true;
      if (selectedServiceFilter === 'ict') return u.role === 'ict';
      const effectiveService = u.assignedService || (u.role as OperationalService);
      return effectiveService === selectedServiceFilter;
    })
    .filter((u) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q)) ||
        u.organization.toLowerCase().includes(q)
      );
    });

  const getServiceBadge = (user: AppUser) => {
    if (user.role === 'admin_kelompok_tani') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
          <Building2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Admin Kelompok Tani</span>
        </span>
      );
    }

    if (user.role === 'ict') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
          <Shield className="w-3.5 h-3.5 text-blue-700" />
          <span>Petugas ICT (Verifikator)</span>
        </span>
      );
    }

    const service = (user.assignedService || user.role) as OperationalService;
    const meta = ROLE_DETAILS[service];
    if (!meta) return null;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeClass}`}>
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
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AppUser) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email || '',
      password: user.password || 'password123',
      phone: user.phone || '',
      organization: user.organization || 'Gapoktan Kopi Mandiri Nusantara',
      location: user.location || 'Pangalengan, Jawa Barat',
      assignedService: user.role === 'ict' ? 'ict' : (user.assignedService || (user.role as OperationalService)) || 'petani',
      status: user.status || 'active',
    });
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

    const isIct = formData.assignedService === 'ict';
    const finalRole: UserRole = isIct ? 'ict' : formData.assignedService;
    const finalAssignedService: OperationalService | undefined = isIct ? undefined : (formData.assignedService as OperationalService);

    if (editingUserId) {
      // Edit existing
      updateUser(editingUserId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        location: formData.location.trim(),
        role: finalRole,
        assignedService: finalAssignedService,
        status: formData.status,
      });
    } else {
      // Create new
      addUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password || 'password123',
        phone: formData.phone.trim() || '0812-0000-0000',
        organization: formData.organization.trim(),
        location: formData.location.trim(),
        role: finalRole,
        assignedService: finalAssignedService,
        status: formData.status,
        balance: 0,
        avatar: isIct
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun "${name}"?`)) {
      deleteUser(id);
    }
  };

  if (currentUser && currentUser.role !== 'admin_kelompok_tani') {
    return (
      <div className="bg-white rounded-lg border border-amber-300 p-6 shadow-sm text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
        <h3 className="text-lg font-bold text-stone-900">Akses Terbatas: Khusus Pengurus Kelompok Tani</h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto">
          Penugasan akun dan manajemen master users hanya dapat diakses oleh Admin Kelompok Tani.
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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
            placeholder="Cari berdasarkan nama, email, no HP, atau organisasi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
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
            Semua ({users.filter((u) => u.role !== 'verifikator').length})
          </button>

          {ACTIVE_OPERATIONAL_SERVICES.map((srv) => {
            const count = users.filter((u) => (u.assignedService || u.role) === srv).length;
            const meta = ROLE_DETAILS[srv];
            const isSelected = selectedServiceFilter === srv;

            return (
              <button
                key={srv}
                onClick={() => setSelectedServiceFilter(srv)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{meta.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-amber-800 text-white' : 'bg-stone-200 text-stone-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Filter Petugas ICT */}
          {(() => {
            const count = users.filter((u) => u.role === 'ict').length;
            const isSelected = selectedServiceFilter === 'ict';
            return (
              <button
                onClick={() => setSelectedServiceFilter('ict')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>Petugas ICT</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-blue-800 text-white' : 'bg-stone-200 text-stone-700'}`}>
                  {count}
                </span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* 3. Table of Users (AdminLTE Card Style) */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[950px]">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3.5 px-4 whitespace-nowrap">Pengguna</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Kontak</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Layanan Ditugaskan (1-to-1)</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Organisasi</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">Tidak ada data pengguna yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
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
                      <div className="flex items-center gap-1.5 text-stone-600">
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
                    <td className="py-3.5 px-4 text-stone-600">
                      <div className="font-medium truncate max-w-[180px]">{user.organization}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-[180px] flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0" /> {user.location}
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

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {user.role === 'admin_kelompok_tani' ? (
                        <span className="text-[11px] text-stone-400 italic">Akun Induk</span>
                      ) : (
                        <div className="inline-flex items-center justify-end gap-1.5 flex-nowrap shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                            title="Edit & Ubah Penugasan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Tambah / Edit Pengguna & Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  {editingUserId ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    {editingUserId ? 'Edit Akun & Layanan' : 'Tambah Pengguna Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">Kelompok Tani: Gapoktan Kopi Mandiri Nusantara</p>
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
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Lengkap Anggota / Staf *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email / Username *</label>
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="budi@sangrai.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Wilayah / Lokasi</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Pangalengan, Jawa Barat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* SERVICE ASSIGNMENT (STRICT 1-TO-1 RADIO / BUTTON PICKER) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black text-stone-900 block">
                    Penugasan Layanan Operasional *
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Wajib Pilih Tepat 1 Layanan
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-2.5">
                  Setiap akun difokuskan pada satu stasiun kerja di bawah naungan kelompok tani.
                </p>

                <div className="space-y-2">
                  {ACTIVE_OPERATIONAL_SERVICES.map((srv) => {
                    const meta = ROLE_DETAILS[srv];
                    const isSelected = formData.assignedService === srv;

                    return (
                      <div
                        key={srv}
                        onClick={() => setFormData({ ...formData, assignedService: srv })}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.badgeClass}`}>
                            {meta.icon}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-xs">
                              {meta.label}
                            </div>
                            <div className="text-[10px] text-stone-500">
                              {meta.description}
                            </div>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}

                  {/* Option: Petugas ICT (Internal Verifier) */}
                  {(() => {
                    const isSelected = formData.assignedService === 'ict';
                    return (
                      <div
                        onClick={() => setFormData({ ...formData, assignedService: 'ict' })}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-blue-100 text-blue-900 border border-blue-300">
                            <Shield className="w-4 h-4 text-blue-700" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-xs">
                              Petugas ICT (Verifikator Internal)
                            </div>
                            <div className="text-[10px] text-stone-500">
                              Verifikasi data NIK/KTA petani, peta poligon EUDR kebun, &amp; hasil panen ceri
                            </div>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-stone-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Status toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <span className="font-bold text-stone-700">Status Akun</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      formData.status === 'active'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600'
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
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    Nonaktif
                  </button>
                </div>
              </div>

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
                  {editingUserId ? 'Simpan Perubahan' : 'Buat Akun & Tugaskan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
