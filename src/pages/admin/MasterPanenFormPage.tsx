import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { FarmerHarvestLot } from '../../types/coffee';
import {
  Package,
  ArrowLeft,
  Users,
  TreePine,
  Scale,
  Sparkles,
  Store,
  Warehouse,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Mountain,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const MasterPanenFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedFarmId = searchParams.get('farmId');
  const preselectedFarmerId = searchParams.get('farmerId');

  const { users, coffeeFarms, addFarmerHarvest } = useCoffee();

  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  const [formError, setFormError] = useState<string | null>(null);

  // 3-Step Wizard
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Form State
  const initialFarmer =
    preselectedFarmerId ||
    (preselectedFarmId
      ? coffeeFarms.find((f) => f.id === preselectedFarmId)?.farmerId || ''
      : allFarmers.length > 0
      ? allFarmers[0].id
      : '');

  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(initialFarmer);

  const farmsOfSelectedFarmer = coffeeFarms.filter((f) => f.farmerId === selectedFarmerId);

  const [selectedFarmId, setSelectedFarmId] = useState<string>(
    preselectedFarmId || (farmsOfSelectedFarmer.length > 0 ? farmsOfSelectedFarmer[0].id : '')
  );

  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalWeightKg, setTotalWeightKg] = useState<number>(500);
  const [brix, setBrix] = useState<number>(22.0);
  const [pickingMethod, setPickingMethod] = useState<FarmerHarvestLot['pickingMethod']>(
    'Petik Merah Optimal (95%+)'
  );
  const [pricePerKg, setPricePerKg] = useState<number>(15000);

  // EXACTLY 2 OPTIONS FOR DISTRIBUTION TARGET:
  // 'marketplace' (Rilis Langsung ke Marketplace) vs 'inventory' (Keep ke Gudang Petani)
  const [distributionTarget, setDistributionTarget] = useState<'marketplace' | 'inventory'>('marketplace');
  const [notes, setNotes] = useState('');

  // Handle farmer change
  const handleFarmerChange = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    const relatedFarms = coffeeFarms.filter((f) => f.farmerId === farmerId);
    setSelectedFarmId(relatedFarms.length > 0 ? relatedFarms[0].id : '');
  };

  const selectedFarmer = allFarmers.find((f) => f.id === selectedFarmerId);
  const selectedFarm = coffeeFarms.find((f) => f.id === selectedFarmId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmerId) {
      setFormError('Pilih petani pemilik panen pada Langkah 1.');
      setWizardStep(1);
      return;
    }
    if (!totalWeightKg || totalWeightKg <= 0) {
      setFormError('Berat total panen harus lebih dari 0 kg.');
      setWizardStep(3);
      return;
    }

    const isReleased = distributionTarget === 'marketplace';

    addFarmerHarvest({
      farmerId: selectedFarmerId,
      farmerName: selectedFarmer?.name || 'Petani Anggota',
      farmId: selectedFarm?.id,
      farmName: selectedFarm?.farmName,
      farmLocation: selectedFarm?.location || selectedFarmer?.location || 'Pangalengan, Jawa Barat',
      altitude: selectedFarm?.altitudeDisplay || `${selectedFarm?.altitudeMeters || 1550} mdpl`,
      variety: Array.isArray(selectedFarm?.primaryVarieties)
        ? selectedFarm.primaryVarieties.join(', ')
        : selectedFarm?.primaryVarieties || 'Sigarar Utang, Typica',
      weatherSnapshot: selectedFarm?.weatherData,
      soilType: selectedFarm?.soilType,
      shadeTrees: selectedFarm?.shadeTrees,
      harvestDate,
      pickingMethod,
      brix: Number(brix),
      totalWeightKg: Number(totalWeightKg),
      pricePerKg: Number(pricePerKg),
      isReleasedToMarketplace: isReleased,
      marketplacePricePerKg: isReleased ? Number(pricePerKg) : undefined,
      notes:
        notes ||
        `Hasil panen ceri segar pilihan dari ${selectedFarm?.farmName || 'kebun anggota'} (${
          isReleased ? 'Dirilis langsung ke Marketplace' : 'Disimpan ke Gudang Petani'
        }).`,
      photoUrl:
        selectedFarm?.photoUrl ||
        'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
    });

    navigate('/admin/panen');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header & Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/panen"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-emerald-700 bg-white px-3 py-2 rounded-md border border-[#d2d6de] shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Hasil Panen</span>
        </Link>

        <span className="text-xs text-stone-400 font-medium">Wizard 3 Langkah</span>
      </div>

      {/* 2. Main Wizard Card */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        {/* Card Header (AdminLTE Header with Emerald Accent) */}
        <div className="p-4 sm:p-5 border-b border-[#e3e6f0] bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
              <Package className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pencatatan Lot Hasil Panen Ceri Baru</h2>
              <p className="text-xs text-emerald-200">
                Pilih petani pemilik, kaitkan dengan lahan terdaftar, dan tentukan apakah langsung dirilis ke marketplace atau disimpan ke gudang.
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Stepper Header */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
          {[
            { step: 1, label: '1. Petani Pemilik', icon: Users },
            { step: 2, label: '2. Blok Lahan Kebun', icon: TreePine },
            { step: 3, label: '3. Timbangan & Distribusi', icon: Scale },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = wizardStep === item.step;
            const isCompleted = wizardStep > item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setWizardStep(item.step as 1 | 2 | 3)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                  isActive
                    ? 'text-emerald-700'
                    : isCompleted
                    ? 'text-stone-700 hover:text-emerald-600'
                    : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? '✓' : item.step}
                </div>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Wizard Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs text-stone-800">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: PETANI PEMILIK */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Langkah 1: Pilih Petani Pemilik Hasil Panen</h3>
                <p className="text-stone-500 mt-0.5">
                  Tentukan anggota kelompok tani yang menyetor hasil panen buah ceri kopi segar ini.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {allFarmers.map((farmer) => {
                  const isSelected = selectedFarmerId === farmer.id;
                  const farmsCount = coffeeFarms.filter((f) => f.farmerId === farmer.id).length;

                  return (
                    <div
                      key={farmer.id}
                      onClick={() => handleFarmerChange(farmer.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                          : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                      }`}
                    >
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-11 h-11 rounded-full object-cover border border-stone-300 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-stone-900 text-xs truncate">{farmer.name}</div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {farmer.village || farmer.location}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          {farmsCount} Lahan Terdaftar • KTA: {farmer.farmerCardNumber || 'KTA-KTN'}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <span>Lanjut: Pilih Blok Lahan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BLOK LAHAN KEBUN */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Langkah 2: Pilih Blok Lahan Kebun Asal Panen
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Petani:{' '}
                  <strong className="text-stone-900">
                    {selectedFarmer?.name || 'Petani Anggota'}
                  </strong>
                  . Lot panen akan mewarisi koordinat GPS, ketinggian, dan sertifikasi EUDR dari blok lahan ini.
                </p>
              </div>

              {farmsOfSelectedFarmer.length === 0 ? (
                <div className="p-6 bg-amber-50 rounded-lg border border-amber-200 text-center space-y-2">
                  <TreePine className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="text-xs text-amber-800 font-semibold">
                    Petani ini belum memiliki data blok lahan kebun terdaftar.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Anda dapat mendaftarkan lahan baru terlebih dahulu atau tetap melanjutkan dengan profil default.
                  </p>
                  <Link
                    to={`/admin/kebun/tambah?farmerId=${selectedFarmerId}`}
                    className="inline-block mt-2 px-3 py-1.5 bg-amber-600 text-white rounded font-bold text-xs"
                  >
                    + Daftarkan Lahan Baru untuk Petani Ini
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {farmsOfSelectedFarmer.map((farm) => {
                    const isSelected = selectedFarmId === farm.id;

                    return (
                      <div
                        key={farm.id}
                        onClick={() => setSelectedFarmId(farm.id)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                            : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={farm.photoUrl}
                          alt={farm.farmName}
                          className="w-14 h-14 rounded-md object-cover border border-stone-300 shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="font-bold text-stone-900 text-xs truncate">
                            {farm.farmName}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate">{farm.location}</div>
                          <div className="text-[10px] text-stone-600 font-mono">
                            {farm.altitudeDisplay || `${farm.altitudeMeters} mdpl`} • {farm.landAreaHectares} Ha
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold truncate">
                            Varietas:{' '}
                            {Array.isArray(farm.primaryVarieties)
                              ? farm.primaryVarieties.join(', ')
                              : farm.primaryVarieties}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-md flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <span>Lanjut: Data Timbangan & Distribusi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TIMBANGAN, BRIX & DISTRIBUSI */}
          {wizardStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Langkah 3: Timbangan, Kualitas Ceri & Opsi Distribusi
                </h3>
                <p className="text-stone-500 mt-0.5">
                  Isi bobot panen, hasil refractometer brix, dan pilih apakah ceri akan langsung dipasarkan atau disimpan di gudang.
                </p>
              </div>

              {/* Timbangan & Brix Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Tanggal Panen *
                  </label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Total Berat Panen (kg) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalWeightKg}
                    onChange={(e) => setTotalWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Uji Brix Refractometer (°Bx) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="35"
                    required
                    value={brix}
                    onChange={(e) => setBrix(parseFloat(e.target.value) || 0)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono font-bold text-amber-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Metode Petik Ceri
                  </label>
                  <select
                    value={pickingMethod}
                    onChange={(e) =>
                      setPickingMethod(e.target.value as FarmerHarvestLot['pickingMethod'])
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Petik Merah Optimal (95%+)">Petik Merah Optimal (95%+ Kematangan)</option>
                    <option value="Petik Campur (Merah & Kuning)">Petik Campur (Merah & Kuning)</option>
                    <option value="Petik Rata">Petik Rata (Sortasi Standar)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Harga Patokan Beli Kelompok (Rp / kg)
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="5000"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(parseInt(e.target.value) || 15000)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* ======================================================== */}
              {/* EXACTLY 2 OPTIONS FOR DISTRIBUTION TARGET               */}
              {/* ======================================================== */}
              <div className="space-y-2 pt-2">
                <label className="block font-bold text-stone-900 text-xs">
                  Pilih Target Distribusi Lot Panen (Opsi Kelompok Tani) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Rilis Langsung ke Marketplace */}
                  <div
                    onClick={() => setDistributionTarget('marketplace')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      distributionTarget === 'marketplace'
                        ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                          <Store className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-stone-900 text-xs">
                          🛒 Rilis Langsung ke Marketplace
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="distributionTarget"
                        checked={distributionTarget === 'marketplace'}
                        onChange={() => setDistributionTarget('marketplace')}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 pl-10 leading-relaxed">
                      Lot ceri langsung diterbitkan ke marketplace kelompok tani sehingga dapat segera dipesan dan dibeli oleh pengolah / pembeli eksternal.
                    </p>
                  </div>

                  {/* Option 2: Keep ke Gudang Petani (Inventory) */}
                  <div
                    onClick={() => setDistributionTarget('inventory')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      distributionTarget === 'inventory'
                        ? 'border-stone-800 bg-stone-100 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-stone-700 text-white flex items-center justify-center font-bold">
                          <Warehouse className="w-4 h-4" />
                        </div>
                        <span className="font-extrabold text-stone-900 text-xs">
                          📦 Keep ke Gudang Petani (Inventory)
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="distributionTarget"
                        checked={distributionTarget === 'inventory'}
                        onChange={() => setDistributionTarget('inventory')}
                        className="w-4 h-4 text-stone-800 focus:ring-stone-700"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 pl-10 leading-relaxed">
                      Lot disimpan terlebih dahulu di gudang kelompok tani sebagai inventaris stok cadangan. Dapat dirilis ke marketplace kapan saja dengan 1 klik.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Catatan Panen / Kualitas Lapangan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan mengenai cuaca saat panen, sortasi petik..."
                  className="w-full border border-stone-300 rounded-md p-3 text-xs"
                />
              </div>

              {/* Wizard Footer Controls */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-md flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Terbitkan Lot Panen</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MasterPanenFormPage;
