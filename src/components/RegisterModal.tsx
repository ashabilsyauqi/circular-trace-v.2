import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { ROLE_DETAILS, REGISTRABLE_ROLES } from '../constants/roles';
import {
  X,
  UserPlus,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  Check,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Crown,
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  initialRole?: UserRole;
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  petani: <Sprout className="w-4 h-4" />,
  pengolah: <Cog className="w-4 h-4" />,
  gudang: <Warehouse className="w-4 h-4" />,
  roaster: <Flame className="w-4 h-4" />,
  cafe: <Coffee className="w-4 h-4" />,
  verifikator: <Award className="w-4 h-4" />,
  superadmin: <Crown className="w-4 h-4" />,
};

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'petani',
  initialRole,
}) => {
  const { registerUser } = useCoffee();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setIsSubmitted(false);
    setErrorMsg('');
    setName('');
    setEmail('');
    setPassword('');
    setOrganization('');
    setLocation('');
    setPhone('');
    setBio('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password.trim() || !organization.trim() || !location.trim()) {
      setErrorMsg('Mohon lengkapi nama, email, kata sandi, nama usaha/koperasi, dan lokasi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (registerUser) {
      const res = registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: selectedRole,
        organization: organization.trim(),
        location: location.trim(),
        phone: phone.trim() || '0812-0000-0000',
        bio: bio.trim() || `Mitra rantai pasok resmi sebagai ${ROLE_DETAILS[selectedRole].label}`,
      });
      if (res && !res.success) {
        setErrorMsg(res.message);
        return;
      }
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              <span>{isSubmitted ? 'Pendaftaran Berhasil Dikirim' : 'Pendaftaran Mitra Baru'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isSubmitted
                ? 'Menunggu verifikasi & persetujuan Super Admin sangrAI'
                : 'Bergabung ke dalam ekosistem ketertelusuran kopi sirkular sangrAI.'}
            </p>
          </div>
          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Submitted Confirmation View */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8 animate-pulse text-amber-600" />
              </div>
              <h4 className="text-lg font-black text-stone-900 tracking-tight">
                Pendaftaran Sedang Menunggu ACC Super Admin
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Terima kasih, <strong>{name}</strong>! Berkas pendaftaran akun Anda telah tercatat ke dalam sistem dan saat ini sedang menunggu persetujuan resmi dari <strong>Super Admin (Novizar - Owner sangrAI)</strong>.
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-stone-200 space-y-2.5 text-xs text-stone-700">
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
                <span className="text-stone-500">Status Akun:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Menunggu Persetujuan (Pending ACC)</span>
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/70">
                <span className="text-stone-500">Peran Diajukan:</span>
                <span className="font-bold text-stone-900">{ROLE_DETAILS[selectedRole].label}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/70">
                <span className="text-stone-500">Email Login:</span>
                <span className="font-mono font-bold text-stone-900">{email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/70">
                <span className="text-stone-500">Organisasi / Usaha:</span>
                <span className="font-bold text-stone-900">{organization}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Pemberi Persetujuan:</span>
                <span className="font-bold text-amber-800">Novizar (Owner & Super Admin sangrAI)</span>
              </div>
            </div>

            <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Untuk menjaga keaslian sertifikasi dan mencegah manipulasi data rantai pasok kopi, setiap akun mitra harus di-ACC secara manual oleh Super Admin. Setelah disetujui, Anda dapat langsung login menggunakan email dan password Anda.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleModalClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Tutup & Kembali ke Halaman Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Modal Form */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                Pilih Peran Stasiun Rantai Pasok Anda:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REGISTRABLE_ROLES.map((role) => {
                  const detail = ROLE_DETAILS[role];
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      type="button"
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 text-stone-950 shadow-xs ring-1 ring-amber-500'
                          : 'border-stone-200/80 bg-white hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {ROLE_ICONS[role]}
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 font-black" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight text-stone-900">
                          {detail.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Nama Lengkap Penanggung Jawab
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Alamat Email Akun
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@organisasi.id"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Kata Sandi Login
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Nama Usaha / Kebun / Roastery / Kafe
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Contoh: Koperasi Tani Pangalengan"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Lokasi / Daerah Asal Stasiun
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Takengon, Aceh Tengah"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-stone-700">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Deskripsi Singkat Fasilitas & Komoditas Kopi
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan varietas kebun, kapasitas olah harian, atau profil mesin roasting..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Info Notice about Super Admin Approval */}
            <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
              <Crown className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Catatan Otoritas:</strong> Pendaftaran Anda akan diteruskan ke <strong>Super Admin Novizar (Owner sangrAI)</strong> untuk diverifikasi sebelum akun diaktifkan.
              </p>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-lg"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Kirim Pendaftaran Mitra</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
