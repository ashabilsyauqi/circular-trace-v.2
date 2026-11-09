import React, { useState } from 'react';
import {
  UserCheck,
  MapPin,
  Trees,
  Users,
  FileBadge,
  Save,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Ct4ciProducerProfile } from '../../types/ct4ci';

interface Ct4ciRegistrationProps {
  profile: Ct4ciProducerProfile;
  onSaveProfile: (profile: Ct4ciProducerProfile) => void;
  onOpenMap?: () => void;
}

export const Ct4ciRegistration: React.FC<Ct4ciRegistrationProps> = ({
  profile,
  onSaveProfile,
  onOpenMap,
}) => {
  const [formData, setFormData] = useState<Ct4ciProducerProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-amber-600" />
            <span>Formulir Registrasi Produsen & Kebun CT-4CI</span>
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Data identitas 4C Unit, kelompok tani, titik koordinat, dan profil ketenagakerjaan kebun.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-pulse">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Data Berhasil Disimpan</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identifikasi 4C Unit */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 flex items-center gap-2">
            <FileBadge className="w-4 h-4" />
            <span>1. Identifikasi 4C Unit & Responden</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                4C Unit ID
              </label>
              <input
                type="text"
                value={formData.unitId4C}
                onChange={(e) => setFormData({ ...formData, unitId4C: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Producer ID (BP Producer)
              </label>
              <input
                type="text"
                value={formData.producerId}
                onChange={(e) => setFormData({ ...formData, producerId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Farm ID (ID Lahan/Plot)
              </label>
              <input
                type="text"
                value={formData.farmId}
                onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Nama Petani / Responden
              </label>
              <input
                type="text"
                value={formData.farmerName}
                onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Kelompok Tani / Koperasi
              </label>
              <input
                type="text"
                value={formData.cooperative}
                onChange={(e) => setFormData({ ...formData, cooperative: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Lokasi Geografis & Lahan */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>2. Lokasi Geografis & Spesifikasi Kebun</span>
            </h3>

            {onOpenMap && (
              <button
                type="button"
                onClick={onOpenMap}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>Buka Peta Polygon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Desa / Kelurahan
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Kecamatan
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Kabupaten / Kota
              </label>
              <input
                type="text"
                value={formData.regency}
                onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Luas Lahan (Hektar)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.farmAreaHa}
                onChange={(e) => setFormData({ ...formData, farmAreaHa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Jenis / Varietas Kopi
              </label>
              <input
                type="text"
                value={formData.coffeeVariety}
                onChange={(e) => setFormData({ ...formData, coffeeVariety: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Tahun Tanam
              </label>
              <input
                type="number"
                value={formData.plantingYear}
                onChange={(e) => setFormData({ ...formData, plantingYear: parseInt(e.target.value) || 2020 })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Koordinat Utama GPS
              </label>
              <input
                type="text"
                value={formData.mainGpsCoordinates}
                onChange={(e) => setFormData({ ...formData, mainGpsCoordinates: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Status Lahan & Ketenagakerjaan */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>3. Status Penguasaan Lahan & Ketenagakerjaan 4C</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Status Penguasaan Lahan
              </label>
              <input
                type="text"
                value={formData.landTenureStatus}
                onChange={(e) => setFormData({ ...formData, landTenureStatus: e.target.value })}
                placeholder="Contoh: Hak Milik (SHM) / Hak Sewa / Adat"
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Kategori Petani (Aturan 4C)
              </label>
              <select
                value={formData.farmerCategory}
                onChange={(e) => setFormData({ ...formData, farmerCategory: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              >
                <option value="Smallholder (< 5 Ha)">Smallholder (Petani Swadaya &lt; 5 Ha)</option>
                <option value="Medium Producer (5 - 50 Ha)">Medium Producer (5 - 50 Ha)</option>
                <option value="Large Estate (> 50 Ha)">Large Estate / Perkebunan Besar (&gt; 50 Ha)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Jumlah Pekerja Tetap / Musiman
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={formData.workerCount.permanent}
                  onChange={(e) => setFormData({
                    ...formData,
                    workerCount: { ...formData.workerCount, permanent: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Tetap"
                  className="px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-center"
                />
                <input
                  type="number"
                  min="0"
                  value={formData.workerCount.seasonal}
                  onChange={(e) => setFormData({
                    ...formData,
                    workerCount: { ...formData.workerCount, seasonal: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Musiman"
                  className="px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Tanggal Kunjungan Lapangan
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Nama Field Enumerator
              </label>
              <input
                type="text"
                value={formData.enumeratorName}
                onChange={(e) => setFormData({ ...formData, enumeratorName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                Nama Verifikator ICS
              </label>
              <input
                type="text"
                value={formData.icsVerifierName}
                onChange={(e) => setFormData({ ...formData, icsVerifierName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Profil Produsen</span>
          </button>
        </div>
      </form>
    </div>
  );
};
