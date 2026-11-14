import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  CoffeeFarm,
  FarmWeatherData,
  FarmPatok,
  PhysicalPatokType,
  PatokCondition,
} from '../../types/coffee';
import {
  TreePine,
  ArrowLeft,
  MapPin,
  Mountain,
  Compass,
  CheckCircle2,
  Trash2,
  Plus,
  Navigation,
  RefreshCw,
  AlertCircle,
  Thermometer,
  Cloud,
  Droplets,
  Layers,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';
import {
  FarmLocationMap,
  PHYSICAL_PATOK_TYPES,
  PATOK_CONDITIONS,
  INDONESIAN_COFFEE_ORIGINS,
} from '../../components/shared/FarmLocationMap';

export const MasterKebunFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { farmId } = useParams<{ farmId?: string }>();
  const [searchParams] = useSearchParams();
  const preselectedFarmerId = searchParams.get('farmerId');

  const { users, coffeeFarms, addCoffeeFarm, updateCoffeeFarm } = useCoffee();

  const isEditMode = Boolean(farmId);
  const existingFarm = isEditMode ? coffeeFarms.find((f) => f.id === farmId) : null;

  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    farmerId: preselectedFarmerId || (allFarmers.length > 0 ? allFarmers[0].id : ''),
    farmName: '',
    location: 'Desa Margamukti, Kec. Pangalengan, Kab. Bandung',
    province: 'Jawa Barat',
    altitudeMeters: 1550,
    altitudeDisplay: '1.550 mdpl',
    landAreaHectares: 2.5,
    totalTreesCount: 3200,
    primaryVarieties: 'Sigarar Utang, Typica, Kartika',
    soilType: 'Andosol Vulkanik' as CoffeeFarm['soilType'],
    shadeTrees: 'Pohon Lamtoro, Sengon, Alpukat',
    organicStatus: 'Organik Bersertifikat (SNI / USDA)' as CoffeeFarm['organicStatus'],
    latitude: -7.1824,
    longitude: 107.5612,
    establishedYear: 2017,
    photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
    temperatureCelsius: 19.5,
    humidityPercent: 78,
    annualRainfallMm: 2200,
    microclimateNote: 'Zona sejuk berangin lereng selatan dengan kabut harian optimal untuk pematangan ceri lambat.',
    notes: 'Lahan kebun kopi anggota terdaftar resmi dengan pemetaan koordinat polygon EUDR Deforestation-Free.',
  });

  // Dynamic Corner Patoks (Patok Sudut BPN)
  const [patokList, setPatokList] = useState<FarmPatok[]>([
    {
      id: 'PTK-01',
      name: 'Patok 1 (Sudut Utara - Batas Hutan Lindung)',
      latitude: -7.1818,
      longitude: 107.5608,
      elevationMeters: 1555,
      physicalType: 'Patok Beton BPN',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Dekat pohon beringin tua, 10m dari mata air',
    },
    {
      id: 'PTK-02',
      name: 'Patok 2 (Sudut Timur - Terasering Batu)',
      latitude: -7.1821,
      longitude: 107.5622,
      elevationMeters: 1550,
      physicalType: 'Batu Alam / Terasering',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Batas pematang terasering batu kali',
    },
    {
      id: 'PTK-03',
      name: 'Patok 3 (Sudut Selatan - Jalan Tani Desa)',
      latitude: -7.1832,
      longitude: 107.5619,
      elevationMeters: 1545,
      physicalType: 'Pipa Besi Cor',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Tepi saluran drainase jalan setapak',
    },
    {
      id: 'PTK-04',
      name: 'Patok 4 (Sudut Barat - Kebun Warga)',
      latitude: -7.1828,
      longitude: 107.5604,
      elevationMeters: 1548,
      physicalType: 'Pohon Batas Alami',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Pohon lamtoro bercabang dua penanda batas',
    },
  ]);

  // Pre-fill if Edit Mode
  useEffect(() => {
    if (existingFarm) {
      setFormData({
        farmerId: existingFarm.farmerId || (allFarmers.length > 0 ? allFarmers[0].id : ''),
        farmName: existingFarm.farmName || '',
        location: existingFarm.location || '',
        province: existingFarm.province || 'Jawa Barat',
        altitudeMeters: existingFarm.altitudeMeters || 1550,
        altitudeDisplay: existingFarm.altitudeDisplay || `${existingFarm.altitudeMeters || 1550} mdpl`,
        landAreaHectares: existingFarm.landAreaHectares || 2.5,
        totalTreesCount: existingFarm.totalTreesCount || 3200,
        primaryVarieties: Array.isArray(existingFarm.primaryVarieties)
          ? existingFarm.primaryVarieties.join(', ')
          : existingFarm.primaryVarieties || '',
        soilType: existingFarm.soilType || 'Andosol Vulkanik',
        shadeTrees: Array.isArray(existingFarm.shadeTrees)
          ? existingFarm.shadeTrees.join(', ')
          : existingFarm.shadeTrees || '',
        organicStatus: existingFarm.organicStatus || 'Organik Bersertifikat (SNI / USDA)',
        latitude: existingFarm.coordinates?.latitude || -7.1824,
        longitude: existingFarm.coordinates?.longitude || 107.5612,
        establishedYear: existingFarm.establishedYear || 2017,
        photoUrl: existingFarm.photoUrl || '',
        temperatureCelsius: existingFarm.weatherData?.temperatureCelsius || 19.5,
        humidityPercent: existingFarm.weatherData?.humidityPercent || 78,
        annualRainfallMm: existingFarm.weatherData?.annualRainfallMm || 2200,
        microclimateNote: existingFarm.weatherData?.microclimateNote || '',
        notes: existingFarm.notes || '',
      });

      if (existingFarm.patokList && existingFarm.patokList.length > 0) {
        setPatokList(existingFarm.patokList);
      }
    }
  }, [existingFarm, isEditMode]);

  // Apply Origin Preset
  const handleSelectOriginPreset = (origin: (typeof INDONESIAN_COFFEE_ORIGINS)[0]) => {
    const numAlt = parseInt(origin.alt.replace(/\D/g, '')) || 1550;
    setFormData((prev) => ({
      ...prev,
      latitude: origin.lat,
      longitude: origin.lng,
      altitudeMeters: numAlt,
      altitudeDisplay: origin.alt,
      location: origin.name,
      landAreaHectares: origin.area,
    }));

    // Auto update patok center
    setPatokList([
      {
        id: 'PTK-01',
        name: `Patok 1 (Sudut Utara - ${origin.name})`,
        latitude: origin.lat + 0.0006,
        longitude: origin.lng - 0.0004,
        elevationMeters: numAlt + 5,
        physicalType: 'Patok Beton BPN',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas utara area kebun',
      },
      {
        id: 'PTK-02',
        name: `Patok 2 (Sudut Timur - ${origin.name})`,
        latitude: origin.lat + 0.0003,
        longitude: origin.lng + 0.001,
        elevationMeters: numAlt,
        physicalType: 'Batu Alam / Terasering',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas timur lereng',
      },
      {
        id: 'PTK-03',
        name: `Patok 3 (Sudut Selatan - ${origin.name})`,
        latitude: origin.lat - 0.0008,
        longitude: origin.lng + 0.0007,
        elevationMeters: numAlt - 5,
        physicalType: 'Pipa Besi Cor',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas jalan tani desa',
      },
      {
        id: 'PTK-04',
        name: `Patok 4 (Sudut Barat - ${origin.name})`,
        latitude: origin.lat - 0.0004,
        longitude: origin.lng - 0.0008,
        elevationMeters: numAlt - 2,
        physicalType: 'Pohon Batas Alami',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Pohon naungan penanda barat',
      },
    ]);
  };

  // Add Patok Row
  const handleAddPatokRow = () => {
    const nextIndex = patokList.length + 1;
    const newPatok: FarmPatok = {
      id: `PTK-0${nextIndex}`,
      name: `Patok ${nextIndex} (Sudut Baru)`,
      latitude: formData.latitude + (Math.random() - 0.5) * 0.001,
      longitude: formData.longitude + (Math.random() - 0.5) * 0.001,
      elevationMeters: formData.altitudeMeters,
      physicalType: 'Patok Beton BPN',
      condition: 'Titik Baru',
      landmarkNote: 'Penanda patok koordinat tambahan',
    };
    setPatokList([...patokList, newPatok]);
  };

  // Remove Patok Row
  const handleRemovePatokRow = (index: number) => {
    if (patokList.length <= 3) {
      alert('Minimal dibutuhkan 3 patok koordinat untuk membentuk poligon lahan.');
      return;
    }
    const updated = patokList.filter((_, i) => i !== index);
    setPatokList(updated);
  };

  // Update Patok Field
  const handleUpdatePatokField = (
    index: number,
    field: keyof FarmPatok,
    value: string | number | undefined
  ) => {
    const updated = [...patokList];
    updated[index] = { ...updated[index], [field]: value };
    setPatokList(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmName.trim()) {
      setFormError('Nama lahan / blok kebun wajib diisi.');
      return;
    }
    if (!formData.farmerId) {
      setFormError('Pilih petani pemilik lahan.');
      return;
    }

    const selectedFarmer = allFarmers.find((f) => f.id === formData.farmerId);

    const farmPayload = {
      farmerId: formData.farmerId,
      farmerName: selectedFarmer?.name || 'Petani Anggota',
      farmName: formData.farmName,
      location: formData.location,
      province: formData.province,
      coordinates: {
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      },
      altitudeMeters: Number(formData.altitudeMeters),
      altitudeDisplay: `${formData.altitudeMeters.toLocaleString()} mdpl`,
      landAreaHectares: Number(formData.landAreaHectares),
      totalTreesCount: Number(formData.totalTreesCount),
      primaryVarieties: formData.primaryVarieties
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      soilType: formData.soilType,
      shadeTrees: formData.shadeTrees
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      organicStatus: formData.organicStatus,
      eudrCompliant: true,
      patokList: patokList,
      weatherData: {
        currentCondition: 'Berkabut Tebal' as FarmWeatherData['currentCondition'],
        temperatureCelsius: Number(formData.temperatureCelsius),
        humidityPercent: Number(formData.humidityPercent),
        annualRainfallMm: Number(formData.annualRainfallMm),
        sunshineHoursPerDay: 6.5,
        windSpeedKph: 11,
        microclimateNote: formData.microclimateNote,
      },
      photoUrl: formData.photoUrl,
      establishedYear: Number(formData.establishedYear),
      notes: formData.notes,
    };

    if (isEditMode && existingFarm) {
      updateCoffeeFarm({ ...existingFarm, ...farmPayload });
    } else {
      addCoffeeFarm(farmPayload);
    }

    navigate('/admin/kebun');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header & Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/kebun"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-700 bg-white px-3 py-2 rounded-md border border-[#d2d6de] shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Lahan Kebun</span>
        </Link>

        <span className="text-xs text-stone-400 font-medium">
          {isEditMode ? `ID: ${existingFarm?.id}` : 'Registrasi Blok Lahan Baru'}
        </span>
      </div>

      {/* 2. Main Form Card */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        {/* Card Header (AdminLTE Header with Amber Accent) */}
        <div className="p-4 sm:p-5 border-b border-[#e3e6f0] bg-gradient-to-r from-amber-800 to-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-white shrink-0">
              <TreePine className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditMode ? 'Edit Data Lahan Kebun Kopi' : 'Pendaftaran Lahan Kebun Baru (Peta GPS & Patokan Sudut)'}
              </h2>
              <p className="text-xs text-amber-200">
                Mendukung verifikasi poligon EUDR Deforestation-Free & pemetaan koordinat sudut multi-patok BPN.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-7 text-xs text-stone-800">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* SECTION 1: PETANI PEMILIK & IDENTITAS LAHAN BLOK */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <span>1. Petani Pemilik & Identitas Lahan Blok</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Petani Pemilik / Penggarap Lahan *
                </label>
                <select
                  required
                  value={formData.farmerId}
                  onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-semibold text-stone-900"
                >
                  <option value="">-- Pilih Petani Anggota --</option>
                  {allFarmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.id}) - {f.village || f.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nama Lahan / Blok Kebun *
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Kebun Blok Pasir Kunci (Lereng Gn. Tilu)"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-semibold text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Lokasi Desa / Kecamatan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Desa Margamukti, Kec. Pangalengan, Kab. Bandung"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="Jawa Barat"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tahun Buka Kebun
                </label>
                <input
                  type="number"
                  min="1970"
                  max="2030"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) || 2017 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PETA GEOLOCATION MAPS & TITIK KOORDINAT ACTUAL */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>2. Peta Geolocation Maps & Titik Koordinat Actual</span>
              </h3>
              <span className="text-[11px] text-stone-500">
                Pilih preset asal kopi atau tentukan titik koordinat GPS
              </span>
            </div>

            {/* Interactive Farm Location Map Component */}
            <div className="rounded-xl overflow-hidden border border-stone-300 shadow-xs">
              <FarmLocationMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                altitude={formData.altitudeDisplay}
                farmName={formData.farmName || 'Kebun Kopi Anggota'}
                locationName={formData.location}
                patokList={patokList}
                allowEdit={true}
                onCoordinatesChange={(lat, lng) =>
                  setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                }
              />
            </div>

            {/* Quick Origin Preset Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 block uppercase">
                Pilih Titik Lokasi Perkebunan Kopi Nusantara:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {INDONESIAN_COFFEE_ORIGINS.map((origin) => (
                  <button
                    key={origin.name}
                    type="button"
                    onClick={() => handleSelectOriginPreset(origin)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 rounded-md text-[11px] font-medium border border-stone-200 transition-colors flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{origin.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Coordinates & Elevation Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Titik GPS Latitude Actual *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Titik GPS Longitude Actual *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Elevasi Ketinggian (mdpl) *
                </label>
                <input
                  type="number"
                  min="500"
                  max="3000"
                  required
                  value={formData.altitudeMeters}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      altitudeMeters: parseInt(e.target.value) || 1550,
                      altitudeDisplay: `${e.target.value} mdpl`,
                    })
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PATOKAN SUDUT POLIGON LAHAN (MULTI-PATOK BPN) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
              <div>
                <h3 className="font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>3. Patokan Sudut Poligon Lahan ({patokList.length} Patok Batas)</span>
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Batas fisik sertifikat BPN / girik tanah yang diverifikasi untuk kepatuhan regulasi EUDR Deforestation-Free.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPatokRow}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baris Patok</span>
              </button>
            </div>

            {/* Patok Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 font-bold text-[11px] border-b border-stone-200 uppercase">
                    <th className="py-2.5 px-3 whitespace-nowrap">Kode &amp; Nama Patok</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Tipe Patok Fisik</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Latitude</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Longitude</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Kondisi Fisik</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Catatan Landmark</th>
                    <th className="py-2.5 px-2 text-center w-10 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {patokList.map((patok, index) => (
                    <tr key={index} className="hover:bg-amber-50/30">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={patok.name}
                          onChange={(e) => handleUpdatePatokField(index, 'name', e.target.value)}
                          placeholder="e.g. Patok 1 (Batas Utara)"
                          className="w-full border border-stone-300 rounded px-2 py-1 text-xs font-semibold text-stone-800"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={patok.physicalType || 'Patok Beton BPN'}
                          onChange={(e) =>
                            handleUpdatePatokField(index, 'physicalType', e.target.value as PhysicalPatokType)
                          }
                          className="w-full border border-stone-300 rounded px-2 py-1 text-xs"
                        >
                          {PHYSICAL_PATOK_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.000001"
                          value={patok.latitude}
                          onChange={(e) =>
                            handleUpdatePatokField(index, 'latitude', parseFloat(e.target.value) || 0)
                          }
                          className="w-28 border border-stone-300 rounded px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.000001"
                          value={patok.longitude}
                          onChange={(e) =>
                            handleUpdatePatokField(index, 'longitude', parseFloat(e.target.value) || 0)
                          }
                          className="w-28 border border-stone-300 rounded px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={patok.condition || 'Kondisi Baik & Kokoh'}
                          onChange={(e) =>
                            handleUpdatePatokField(index, 'condition', e.target.value as PatokCondition)
                          }
                          className="w-full border border-stone-300 rounded px-2 py-1 text-xs"
                        >
                          {PATOK_CONDITIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={patok.landmarkNote || ''}
                          onChange={(e) =>
                            handleUpdatePatokField(index, 'landmarkNote', e.target.value)
                          }
                          placeholder="Dekat pohon beringin..."
                          className="w-full border border-stone-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePatokRow(index)}
                          title="Hapus Baris Patok"
                          className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 4: DATA AGRONOMI & LINGKUNGAN KEBUN */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <TreePine className="w-4 h-4 text-amber-600" />
              <span>4. Data Agronomi, Varietas & Naungan Kebun</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Luas Lahan Blok (Ha) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.landAreaHectares}
                  onChange={(e) => setFormData({ ...formData, landAreaHectares: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Estimasi Jumlah Pohon *
                </label>
                <input
                  type="number"
                  min="100"
                  required
                  value={formData.totalTreesCount}
                  onChange={(e) => setFormData({ ...formData, totalTreesCount: parseInt(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Jenis Tanah
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value as CoffeeFarm['soilType'] })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-semibold"
                >
                  <option value="Andosol Vulkanik">Andosol Vulkanik (Subur)</option>
                  <option value="Latosol Humus">Latosol Humus</option>
                  <option value="Regosol Pegunungan">Regosol Pegunungan</option>
                  <option value="Humus Aluvial">Humus Aluvial</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Sertifikasi Organik
                </label>
                <select
                  value={formData.organicStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, organicStatus: e.target.value as CoffeeFarm['organicStatus'] })
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-semibold"
                >
                  <option value="Organik Bersertifikat (SNI / USDA)">Organik Bersertifikat (SNI / USDA)</option>
                  <option value="Transisi Menuju Organik">Transisi Menuju Organik</option>
                  <option value="GAP (Good Agricultural Practices)">GAP (Good Agricultural Practices)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Varietas Kopi Utama (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.primaryVarieties}
                  onChange={(e) => setFormData({ ...formData, primaryVarieties: e.target.value })}
                  placeholder="Sigarar Utang, Typica, Kartika, Ateng Super"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pohon Naungan / Shade Trees
                </label>
                <input
                  type="text"
                  value={formData.shadeTrees}
                  onChange={(e) => setFormData({ ...formData, shadeTrees: e.target.value })}
                  placeholder="Pohon Lamtoro, Sengon, Alpukat, Jeruk"
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: IKLIM MIKRO & CATATAN */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-2 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-amber-600" />
              <span>5. Pemantauan Iklim Mikro & Catatan Lahan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Suhu Rata-rata (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperatureCelsius}
                  onChange={(e) => setFormData({ ...formData, temperatureCelsius: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kelembapan Udara (% RH)</label>
                <input
                  type="number"
                  value={formData.humidityPercent}
                  onChange={(e) => setFormData({ ...formData, humidityPercent: parseInt(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Curah Hujan (mm/tahun)</label>
                <input
                  type="number"
                  value={formData.annualRainfallMm}
                  onChange={(e) => setFormData({ ...formData, annualRainfallMm: parseInt(e.target.value) || 0 })}
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Foto URL / Banner Lahan</label>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Catatan Lahan Kebun</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-stone-300 rounded-md p-3 text-xs"
              />
            </div>
          </div>

          {/* Form Actions (Save & Cancel) */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <Link
              to="/admin/kebun"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md font-bold transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditMode ? 'Simpan Perubahan Lahan' : 'Daftarkan Lahan Kebun Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterKebunFormPage;
