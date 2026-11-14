import React, { useState } from 'react';
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
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Mountain,
  Compass,
  CheckCircle2,
  Trash2,
  Edit2,
  Eye,
  Layers,
  ShieldCheck,
  Building2,
  Users,
  Sprout,
  X,
  AlertCircle,
  Thermometer,
  Cloud,
  Droplets,
  Maximize2,
  Plus,
  RefreshCw,
  Navigation,
  ArrowLeft,
  Check,
} from 'lucide-react';
import {
  FarmLocationMap,
  PHYSICAL_PATOK_TYPES,
  PATOK_CONDITIONS,
  INDONESIAN_COFFEE_ORIGINS,
} from '../shared/FarmLocationMap';

interface MasterKebunTabProps {
  initialFarmerIdFilter?: string;
  onSelectFarmForHarvest?: (farmId: string) => void;
}

export const MasterKebunTab: React.FC<MasterKebunTabProps> = ({
  initialFarmerIdFilter,
  onSelectFarmForHarvest,
}) => {
  const { users, coffeeFarms, addCoffeeFarm, updateCoffeeFarm, deleteCoffeeFarm } = useCoffee();

  // All registered farmers in the cooperative
  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerFilter, setSelectedFarmerFilter] = useState<string>(
    initialFarmerIdFilter || 'all'
  );

  // In-Page View State: 'list' (tabel & kartu), 'form' (halaman pendaftaran/edit), 'map' (halaman peta poligon)
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'map'>('list');
  const [selectedFarmForMap, setSelectedFarmForMap] = useState<CoffeeFarm | null>(null);
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Kebun Form Data
  const [formData, setFormData] = useState<{
    farmerId: string;
    farmName: string;
    location: string;
    province: string;
    altitudeMeters: number;
    altitudeDisplay: string;
    landAreaHectares: number;
    totalTreesCount: number;
    primaryVarieties: string;
    soilType: CoffeeFarm['soilType'];
    shadeTrees: string;
    organicStatus: CoffeeFarm['organicStatus'];
    latitude: number;
    longitude: number;
    establishedYear: number;
    photoUrl: string;
    temperatureCelsius: number;
    humidityPercent: number;
    annualRainfallMm: number;
    microclimateNote: string;
    notes: string;
  }>({
    farmerId: allFarmers.length > 0 ? allFarmers[0].id : '',
    farmName: '',
    location: 'Desa Margamukti, Kec. Pangalengan, Kab. Bandung',
    province: 'Jawa Barat',
    altitudeMeters: 1550,
    altitudeDisplay: '1.550 mdpl',
    landAreaHectares: 2.4,
    totalTreesCount: 3200,
    primaryVarieties: 'Sigarar Utang, Typica, Ateng Super',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Pohon Lamtoro, Sengon, Alpukat',
    organicStatus: 'Organik Bersertifikat (SNI / USDA)',
    latitude: -7.1824,
    longitude: 107.5612,
    establishedYear: 2017,
    photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
    temperatureCelsius: 19.5,
    humidityPercent: 78,
    annualRainfallMm: 2200,
    microclimateNote: 'Lereng pegunungan berbukit dengan kabut sejuk pagi hari.',
    notes: 'Lahan terverifikasi bebas deforestasi EUDR Regulation (EU) 2023/1115.',
  });

  // Dynamic Multiple Corner Markers (Patokan Batas Sudut Kebun)
  const [patokList, setPatokList] = useState<FarmPatok[]>([
    {
      id: 'PTK-01',
      name: 'Patok 1 (Sudut Utara - Batas Hutan)',
      latitude: -7.1810,
      longitude: 107.5600,
      elevationMeters: 1575,
      physicalType: 'Patok Beton BPN',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Dekat pohon beringin tua, 10m dari aliran air',
      verifiedDate: '2026-08-15',
    },
    {
      id: 'PTK-02',
      name: 'Patok 2 (Sudut Timur - Batas Kebun Teh)',
      latitude: -7.1812,
      longitude: 107.5628,
      elevationMeters: 1560,
      physicalType: 'Patok Beton BPN',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Tepat di punggung bukit perbatasan perkebunan teh',
      verifiedDate: '2026-08-15',
    },
    {
      id: 'PTK-03',
      name: 'Patok 3 (Sudut Selatan - Batas Jalan Usaha Tani)',
      latitude: -7.1838,
      longitude: 107.5625,
      elevationMeters: 1530,
      physicalType: 'Pipa Besi Cor',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Bersebelahan dengan gardu timbang dan jalan batu',
      verifiedDate: '2026-08-15',
    },
    {
      id: 'PTK-04',
      name: 'Patok 4 (Sudut Barat - Batas Saluran Irigasi)',
      latitude: -7.1835,
      longitude: 107.5598,
      elevationMeters: 1545,
      physicalType: 'Patok Beton BPN',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Dekat plang Gapoktan dan batas terasering',
      verifiedDate: '2026-08-15',
    },
  ]);

  // Helper to generate 4 default corner patoks based on center GPS
  const handleGenerateDefaultPatoks = (centerLat: number, centerLng: number, baseElev: number) => {
    const delta = 0.0016;
    const newPatoks: FarmPatok[] = [
      {
        id: 'PTK-01',
        name: 'Patok Sudut 1 (Utara)',
        latitude: Number((centerLat + delta).toFixed(6)),
        longitude: Number((centerLng - delta).toFixed(6)),
        elevationMeters: baseElev + 15,
        physicalType: 'Patok Beton BPN',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas utara lereng kebun',
        verifiedDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'PTK-02',
        name: 'Patok Sudut 2 (Timur)',
        latitude: Number((centerLat + delta * 0.8).toFixed(6)),
        longitude: Number((centerLng + delta).toFixed(6)),
        elevationMeters: baseElev + 5,
        physicalType: 'Patok Beton BPN',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas timur punggung bukit',
        verifiedDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'PTK-03',
        name: 'Patok Sudut 3 (Selatan)',
        latitude: Number((centerLat - delta).toFixed(6)),
        longitude: Number((centerLng + delta * 0.9).toFixed(6)),
        elevationMeters: baseElev - 15,
        physicalType: 'Pipa Besi Cor',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas selatan jalan usaha tani',
        verifiedDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'PTK-04',
        name: 'Patok Sudut 4 (Barat)',
        latitude: Number((centerLat - delta * 0.7).toFixed(6)),
        longitude: Number((centerLng - delta).toFixed(6)),
        elevationMeters: baseElev - 5,
        physicalType: 'Batu Alam / Terasering',
        condition: 'Kondisi Baik & Kokoh',
        landmarkNote: 'Batas barat saluran air pegunungan',
        verifiedDate: new Date().toISOString().split('T')[0],
      },
    ];
    setPatokList(newPatoks);
  };

  const handleAddPatokRow = () => {
    const newIndex = patokList.length + 1;
    const baseLat = formData.latitude;
    const baseLng = formData.longitude;
    const angle = (newIndex * 60 * Math.PI) / 180;
    const latOffset = 0.0012 * Math.cos(angle);
    const lngOffset = 0.0012 * Math.sin(angle);

    const newPatok: FarmPatok = {
      id: `PTK-${String(newIndex).padStart(2, '0')}`,
      name: `Patok Sudut ${newIndex} (Titik Batas ${String.fromCharCode(64 + newIndex)})`,
      latitude: Number((baseLat + latOffset).toFixed(6)),
      longitude: Number((baseLng + lngOffset).toFixed(6)),
      elevationMeters: formData.altitudeMeters,
      physicalType: 'Patok Beton BPN',
      condition: 'Kondisi Baik & Kokoh',
      landmarkNote: 'Titik patok koordinat batas sudut baru',
      verifiedDate: new Date().toISOString().split('T')[0],
    };

    setPatokList([...patokList, newPatok]);
  };

  const handleUpdatePatokRow = (index: number, updated: Partial<FarmPatok>) => {
    const copy = [...patokList];
    copy[index] = { ...copy[index], ...updated };
    setPatokList(copy);
  };

  const handleDeletePatokRow = (index: number) => {
    if (patokList.length <= 1) {
      alert('Minimal kebun memiliki setidaknya 1 titik patok batas sudut.');
      return;
    }
    const filtered = patokList.filter((_, i) => i !== index);
    setPatokList(filtered);
  };

  // Filtered farms list
  const filteredFarms = coffeeFarms
    .filter((f) => {
      if (selectedFarmerFilter === 'all') return true;
      return f.farmerId === selectedFarmerFilter;
    })
    .filter((f) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.farmName.toLowerCase().includes(q) ||
        f.farmerName.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.primaryVarieties.some((v) => v.toLowerCase().includes(q))
      );
    });

  const totalHectares = coffeeFarms.reduce((acc, f) => acc + (f.landAreaHectares || 0), 0);
  const totalTrees = coffeeFarms.reduce((acc, f) => acc + (f.totalTreesCount || 0), 0);

  const handleOpenAddPage = () => {
    setEditingFarmId(null);
    const initialFarmer = allFarmers.length > 0 ? allFarmers[0].id : '';
    const initialLat = -7.1824;
    const initialLng = 107.5612;
    const initialAlt = 1550;

    setFormData({
      farmerId: initialFarmer,
      farmName: '',
      location: 'Desa Margamukti, Kec. Pangalengan, Kab. Bandung',
      province: 'Jawa Barat',
      altitudeMeters: initialAlt,
      altitudeDisplay: `${initialAlt} mdpl`,
      landAreaHectares: 2.4,
      totalTreesCount: 3200,
      primaryVarieties: 'Sigarar Utang, Typica, Ateng Super',
      soilType: 'Andosol Vulkanik',
      shadeTrees: 'Pohon Lamtoro, Sengon, Alpukat',
      organicStatus: 'Organik Bersertifikat (SNI / USDA)',
      latitude: initialLat,
      longitude: initialLng,
      establishedYear: 2017,
      photoUrl: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
      temperatureCelsius: 19.5,
      humidityPercent: 78,
      annualRainfallMm: 2200,
      microclimateNote: 'Lereng berbukit dengan iklim mikro sejuk pegunungan.',
      notes: 'Lahan terverifikasi bebas deforestasi EUDR Regulation (EU) 2023/1115.',
    });

    handleGenerateDefaultPatoks(initialLat, initialLng, initialAlt);
    setFormError(null);
    setCurrentView('form');
  };

  const handleOpenEditPage = (farm: CoffeeFarm) => {
    setEditingFarmId(farm.id);
    const lat = farm.coordinates?.latitude || -7.1824;
    const lng = farm.coordinates?.longitude || 107.5612;
    const alt = farm.altitudeMeters || 1550;

    setFormData({
      farmerId: farm.farmerId,
      farmName: farm.farmName,
      location: farm.location,
      province: farm.province || 'Jawa Barat',
      altitudeMeters: alt,
      altitudeDisplay: farm.altitudeDisplay || `${alt} mdpl`,
      landAreaHectares: farm.landAreaHectares,
      totalTreesCount: farm.totalTreesCount,
      primaryVarieties: farm.primaryVarieties.join(', '),
      soilType: farm.soilType,
      shadeTrees: farm.shadeTrees.join(', '),
      organicStatus: farm.organicStatus,
      latitude: lat,
      longitude: lng,
      establishedYear: farm.establishedYear,
      photoUrl: farm.photoUrl || 'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80',
      temperatureCelsius: farm.weatherData?.temperatureCelsius || 19.5,
      humidityPercent: farm.weatherData?.humidityPercent || 78,
      annualRainfallMm: farm.weatherData?.annualRainfallMm || 2200,
      microclimateNote: farm.weatherData?.microclimateNote || 'Lereng berbukit pegunungan sejuk.',
      notes: farm.notes || '',
    });

    if (farm.patokList && farm.patokList.length > 0) {
      setPatokList(farm.patokList);
    } else {
      handleGenerateDefaultPatoks(lat, lng, alt);
    }

    setFormError(null);
    setCurrentView('form');
  };

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmName.trim()) {
      setFormError('Nama lahan kebun wajib diisi.');
      return;
    }
    if (patokList.length === 0) {
      setFormError('Minimal harus ada 1 patok sudut koordinat lahan.');
      return;
    }

    const selectedFarmer = allFarmers.find((f) => f.id === formData.farmerId);
    const farmerName = selectedFarmer ? selectedFarmer.name : 'Petani Anggota';

    const varietiesArray = formData.primaryVarieties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const shadeArray = formData.shadeTrees
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const calculatedPerimeter = Math.round(patokList.length * 160);

    const plotBoundary = {
      polygonPoints: patokList.map((p, idx) => ({
        id: p.id || `PT-${idx + 1}`,
        label: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
        elevationMeters: p.elevationMeters,
        physicalType: p.physicalType,
        condition: p.condition,
        landmarkNote: p.landmarkNote,
      })),
      patokList,
      perimeterMeters: calculatedPerimeter,
      geofenceRadiusMeters: 250,
      plotShapeName: `Poligon ${formData.farmName}`,
      calculatedAreaHectares: Number(formData.landAreaHectares),
    };

    const weatherData: FarmWeatherData = {
      currentCondition: 'Berkabut Tebal',
      temperatureCelsius: Number(formData.temperatureCelsius),
      humidityPercent: Number(formData.humidityPercent),
      annualRainfallMm: Number(formData.annualRainfallMm),
      sunshineHoursPerDay: 6.5,
      windSpeedKph: 11,
      microclimateNote: formData.microclimateNote,
    };

    if (editingFarmId) {
      const existing = coffeeFarms.find((f) => f.id === editingFarmId);
      if (existing) {
        updateCoffeeFarm({
          ...existing,
          farmerId: formData.farmerId,
          farmerName,
          farmName: formData.farmName,
          location: formData.location,
          province: formData.province,
          altitudeMeters: Number(formData.altitudeMeters),
          altitudeDisplay: `${formData.altitudeMeters} mdpl`,
          landAreaHectares: Number(formData.landAreaHectares),
          totalTreesCount: Number(formData.totalTreesCount),
          primaryVarieties: varietiesArray,
          soilType: formData.soilType,
          shadeTrees: shadeArray,
          organicStatus: formData.organicStatus,
          coordinates: {
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
          },
          plotBoundary,
          patokList,
          weatherData,
          photoUrl: formData.photoUrl,
          establishedYear: Number(formData.establishedYear),
          notes: formData.notes,
        });
      }
    } else {
      addCoffeeFarm({
        farmerId: formData.farmerId,
        farmerName,
        farmName: formData.farmName,
        location: formData.location,
        province: formData.province,
        altitudeMeters: Number(formData.altitudeMeters),
        altitudeDisplay: `${formData.altitudeMeters} mdpl`,
        landAreaHectares: Number(formData.landAreaHectares),
        totalTreesCount: Number(formData.totalTreesCount),
        primaryVarieties: varietiesArray,
        soilType: formData.soilType,
        shadeTrees: shadeArray,
        organicStatus: formData.organicStatus,
        eudrCompliant: true,
        weatherData,
        photoUrl: formData.photoUrl,
        establishedYear: Number(formData.establishedYear),
        notes: formData.notes,
        coordinates: {
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        plotBoundary,
        patokList,
      });
    }

    setCurrentView('list');
  };

  const handleDeleteFarm = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus lahan kebun "${name}"?`)) {
      deleteCoffeeFarm(id);
    }
  };

  // =========================================================================
  // VIEW MODE 1: FORMULIR DEDIKASI IN-PAGE (BUKAN POP-UP MODAL)
  // =========================================================================
  if (currentView === 'form') {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Kebun</span>
            </button>
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-600" />
                <span>
                  {editingFarmId
                    ? 'Edit Data Detail Lahan Kebun & Patok Sudut'
                    : 'Pendaftaran Lahan Kebun Baru (Peta GPS & Patokan Sudut)'}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Pemetaan koordinat map actual GPS, elevasi ketinggian, dan patokan batas sudut poligon EUDR.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form="farm-form-element"
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingFarmId ? 'Simpan Perubahan Lahan' : 'Daftarkan Lahan & Patok'}</span>
            </button>
          </div>
        </div>

        {/* Dedicated AdminLTE Card Body */}
        <div className="bg-white rounded-lg border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm p-6">
          <form id="farm-form-element" onSubmit={handleSaveFarm} className="space-y-6 text-xs">
            {formError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* SECTION 1: RELASI PETANI & IDENTITAS LAHAN */}
            <div className="space-y-3">
              <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>1. Petani Pemilik &amp; Identitas Lahan Blok</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Petani Pemilik / Penggarap Lahan *
                  </label>
                  <select
                    required
                    value={formData.farmerId}
                    onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white cursor-pointer"
                  >
                    {allFarmers.map((farmer) => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.name} ({farmer.farmerCardNumber || farmer.id}) - {farmer.village || farmer.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Nama Lahan / Blok Kebun *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    placeholder="e.g. Kebun Blok Pasir Kunci (Lereng Gn. Tilu)"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Lokasi Desa / Kecamatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Desa Margamukti, Kec. Pangalengan"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="Jawa Barat"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Tahun Buka Kebun
                  </label>
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) || 2017 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PETA INTERAKTIF OPENSTREETMAP & TITIK KOORDINAT MAP ACTUAL */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>2. Peta Geolocation Maps &amp; Titik Koordinat Actual</span>
                </h5>
                <span className="text-[10px] text-stone-500 font-mono">
                  Drag pin merah atau pilih preset asal kopi di peta
                </span>
              </div>

              {/* Embedded Interactive Map */}
              <div className="rounded-xl border border-stone-300 overflow-hidden shadow-xs">
                <FarmLocationMap
                  key={`form-map-${formData.latitude}-${formData.longitude}`}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  farmName={formData.farmName || 'Kebun Kopi Anggota'}
                  altitude={formData.altitudeDisplay}
                  locationName={formData.location}
                  landAreaHectares={formData.landAreaHectares}
                  totalTreesCount={formData.totalTreesCount}
                  patokList={patokList}
                  height="360px"
                  showPresets={true}
                  showPlotDetailsTable={false}
                  allowEdit={true}
                  onCoordinatesChange={(lat, lng) => {
                    setFormData((prev) => ({
                      ...prev,
                      latitude: Number(lat.toFixed(6)),
                      longitude: Number(lng.toFixed(6)),
                    }));
                  }}
                  onPatokListChange={(newPatoks) => {
                    if (newPatoks && newPatoks.length > 0) {
                      setPatokList(newPatoks);
                    }
                  }}
                />
              </div>

              {/* Actual Coordinates & Altitude Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Titik GPS Latitude Actual *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 font-mono font-bold focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Titik GPS Longitude Actual *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 font-mono font-bold focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Elevasi Ketinggian (mdpl) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.altitudeMeters}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1550;
                      setFormData({
                        ...formData,
                        altitudeMeters: val,
                        altitudeDisplay: `${val} mdpl`,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 font-mono font-bold focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PATOKAN SUDUT (BISA LEBIH DARI 1 PATOK) */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200">
                <div>
                  <h5 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-amber-700" />
                    <span>3. Patokan Sudut Poligon Lahan ({patokList.length} Patok Batas)</span>
                  </h5>
                  <p className="text-[10px] text-amber-800 mt-0.5">
                    Anda dapat memasukkan lebih dari 1 patok sudut untuk membentuk koordinat poligon akurat kepatuhan EUDR.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenerateDefaultPatoks(formData.latitude, formData.longitude, formData.altitudeMeters)}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Hitung ulang 4 sudut poligon otomatis dari titik pusat"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Preset 4 Patok</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddPatokRow}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Patok Sudut</span>
                  </button>
                </div>
              </div>

              {/* Table Dynamic Patok List */}
              <div className="overflow-x-auto bg-white rounded-lg border border-amber-200">
                <table className="w-full text-left border-collapse text-[11px] min-w-[900px]">
                  <thead>
                    <tr className="bg-amber-100/70 border-b border-amber-200 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3 whitespace-nowrap">ID &amp; Nama Patok Batas</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Latitude Actual</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Longitude Actual</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Elevasi (mdpl)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Jenis Fisik Patok</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Kondisi Patok</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">Landmark / Keterangan</th>
                      <th className="py-2.5 px-2 text-center whitespace-nowrap">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {patokList.map((patok, idx) => (
                      <tr key={patok.id || idx} className="hover:bg-amber-50/50">
                        {/* Nama Patok */}
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={patok.name}
                            onChange={(e) => handleUpdatePatokRow(idx, { name: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-stone-200 text-stone-900 font-bold text-[11px] bg-white"
                            placeholder="e.g. Patok 1 (Sudut Utara)"
                          />
                        </td>

                        {/* Latitude */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="0.000001"
                            value={patok.latitude}
                            onChange={(e) =>
                              handleUpdatePatokRow(idx, { latitude: parseFloat(e.target.value) || 0 })
                            }
                            className="w-28 px-2 py-1 rounded border border-stone-200 text-stone-900 font-mono text-[11px] bg-white"
                          />
                        </td>

                        {/* Longitude */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="0.000001"
                            value={patok.longitude}
                            onChange={(e) =>
                              handleUpdatePatokRow(idx, { longitude: parseFloat(e.target.value) || 0 })
                            }
                            className="w-28 px-2 py-1 rounded border border-stone-200 text-stone-900 font-mono text-[11px] bg-white"
                          />
                        </td>

                        {/* Elevation */}
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={patok.elevationMeters || formData.altitudeMeters}
                            onChange={(e) =>
                              handleUpdatePatokRow(idx, { elevationMeters: parseInt(e.target.value) || 0 })
                            }
                            className="w-20 px-2 py-1 rounded border border-stone-200 text-stone-900 font-mono text-[11px] bg-white"
                          />
                        </td>

                        {/* Jenis Fisik */}
                        <td className="py-2 px-3">
                          <select
                            value={patok.physicalType || 'Patok Beton BPN'}
                            onChange={(e) =>
                              handleUpdatePatokRow(idx, { physicalType: e.target.value as PhysicalPatokType })
                            }
                            className="w-36 px-2 py-1 rounded border border-stone-200 text-stone-800 text-[11px] bg-white cursor-pointer"
                          >
                            {PHYSICAL_PATOK_TYPES.map((pt) => (
                              <option key={pt} value={pt}>
                                {pt}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Kondisi */}
                        <td className="py-2 px-3">
                          <select
                            value={patok.condition || 'Kondisi Baik & Kokoh'}
                            onChange={(e) =>
                              handleUpdatePatokRow(idx, { condition: e.target.value as PatokCondition })
                            }
                            className="w-36 px-2 py-1 rounded border border-stone-200 text-stone-800 text-[11px] bg-white cursor-pointer"
                          >
                            {PATOK_CONDITIONS.map((cond) => (
                              <option key={cond} value={cond}>
                                {cond}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Landmark Note */}
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={patok.landmarkNote || ''}
                            onChange={(e) => handleUpdatePatokRow(idx, { landmarkNote: e.target.value })}
                            placeholder="Dekat pohon, batu batas..."
                            className="w-36 px-2 py-1 rounded border border-stone-200 text-stone-800 text-[11px] bg-white"
                          />
                        </td>

                        {/* Delete */}
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeletePatokRow(idx)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Hapus patok sudut ini"
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

            {/* SECTION 4: SPESIFIKASI AGRONOMI, TANAH & TANAMAN */}
            <div className="space-y-3">
              <h5 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>4. Parameter Agronomi, Varietas &amp; Populasi Pohon</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Luas Area Lahan (Hektar) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.landAreaHectares}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        landAreaHectares: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Estimasi Jumlah Populasi Pohon *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.totalTreesCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalTreesCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Varietas Kopi Utama (Pisahkan Koma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryVarieties}
                    onChange={(e) => setFormData({ ...formData, primaryVarieties: e.target.value })}
                    placeholder="e.g. Sigarar Utang, Typica, Ateng Super"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Jenis Tanah Lahan
                  </label>
                  <select
                    value={formData.soilType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soilType: e.target.value as CoffeeFarm['soilType'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="Andosol Vulkanik">Andosol Vulkanik (Subur Pegunungan)</option>
                    <option value="Latosol Humus">Latosol Humus (Kaya Bahan Organik)</option>
                    <option value="Regosol Pegunungan">Regosol Pegunungan (Lereng Berpasir)</option>
                    <option value="Humus Aluvial">Humus Aluvial (Lembah Aliran Air)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Pohon Penaung / Shade Trees (Agroforestry)
                  </label>
                  <input
                    type="text"
                    value={formData.shadeTrees}
                    onChange={(e) => setFormData({ ...formData, shadeTrees: e.target.value })}
                    placeholder="e.g. Pohon Lamtoro, Sengon, Alpukat, Jeruk"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Status Sertifikasi Organik &amp; Kepatuhan
                  </label>
                  <select
                    value={formData.organicStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organicStatus: e.target.value as CoffeeFarm['organicStatus'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
                  >
                    <option value="Organik Bersertifikat (SNI / USDA)">
                      Organik Bersertifikat (SNI / USDA)
                    </option>
                    <option value="Transisi Menuju Organik">Transisi Menuju Organik</option>
                    <option value="GAP (Good Agricultural Practices)">
                      GAP (Good Agricultural Practices)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  URL Foto Lanskap Kebun
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Catatan Agronomi &amp; Iklim Mikro
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan kontur lereng bukit, arah sinar matahari, kebiasaan pemupukan organik, dsb."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{editingFarmId ? 'Simpan Perubahan Lahan & Patok' : 'Daftarkan Lahan & Poligon Patok'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 2: HALAMAN PETA POLIGON EUDR DEDIKASI IN-PAGE
  // =========================================================================
  if (currentView === 'map' && selectedFarmForMap) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Kebun</span>
            </button>
            <div>
              <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                <span>Peta Geolocation &amp; Poligon EUDR: {selectedFarmForMap.farmName}</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                Petani: <strong>{selectedFarmForMap.farmerName}</strong> • {selectedFarmForMap.location} • Elevasi: {selectedFarmForMap.altitudeDisplay}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenEditPage(selectedFarmForMap)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Lahan &amp; Patok Ini</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-5 space-y-4">
          <FarmLocationMap
            latitude={selectedFarmForMap.coordinates?.latitude || -7.1824}
            longitude={selectedFarmForMap.coordinates?.longitude || 107.5612}
            farmName={selectedFarmForMap.farmName}
            altitude={selectedFarmForMap.altitudeDisplay}
            locationName={selectedFarmForMap.location}
            landAreaHectares={selectedFarmForMap.landAreaHectares}
            totalTreesCount={selectedFarmForMap.totalTreesCount}
            patokList={selectedFarmForMap.patokList}
            height="520px"
            allowEdit={false}
            showPlotDetailsTable={true}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE 3: DAFTAR KARTU & TABEL MASTER KEBUN (DEFAULT)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* 1. Header & Summary KPI Small-Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-emerald-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Lahan Terdaftar
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {coffeeFarms.length} <span className="text-xs font-normal text-stone-500">Kebun</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TreePine className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-amber-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Luas Polygon Lahan
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalHectares.toFixed(1)} <span className="text-xs font-normal text-stone-500">Hektar</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-stone-200 border-t-4 border-t-stone-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Populasi Pohon Terdata
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {totalTrees.toLocaleString()} <span className="text-xs font-normal text-stone-500">Pohon</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 2. Controls: Search, Filter per Petani Pemilik, Tombol Tambah Lahan */}
      <div className="bg-white rounded-lg p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kebun, varietas, atau lokasi..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Filter Petani Pemilik */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-bold flex items-center gap-1 text-[11px]">
              <Users className="w-3.5 h-3.5" /> Petani Pemilik:
            </span>
            <select
              value={selectedFarmerFilter}
              onChange={(e) => setSelectedFarmerFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Semua Petani ({allFarmers.length})</option>
              {allFarmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenAddPage}
          className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Daftarkan Lahan Baru (Buka Halaman Form)</span>
        </button>
      </div>

      {/* 3. Daftar Kartu Kebun (Grid View AdminLTE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFarms.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-stone-200 p-12 text-center text-stone-400">
            <TreePine className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-medium text-xs">Belum ada lahan kebun yang terdaftar sesuai filter.</p>
          </div>
        ) : (
          filteredFarms.map((farm) => {
            const farmer = allFarmers.find((u) => u.id === farm.farmerId);
            const patokCount = farm.patokList?.length || farm.plotBoundary?.polygonPoints?.length || 4;

            return (
              <div
                key={farm.id}
                className="bg-white rounded-lg border border-stone-200 border-t-2 border-t-emerald-600 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative h-40 bg-stone-100 overflow-hidden">
                    <img
                      src={farm.photoUrl}
                      alt={farm.farmName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Mountain className="w-3 h-3 text-amber-400" />
                      <span>{farm.altitudeDisplay}</span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-emerald-800/90 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>EUDR Ready</span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                      {patokCount} Patok Sudut Poligon
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px] mb-0.5">
                        <Users className="w-3 h-3 text-emerald-600" />
                        <span className="font-bold text-stone-700">
                          {farm.farmerName || farmer?.name || 'Petani'}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm leading-snug">
                        {farm.farmName}
                      </h4>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{farm.location}</span>
                      </p>
                    </div>

                    {/* Stats Specs */}
                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-stone-100 text-[11px]">
                      <div>
                        <span className="text-stone-400 block">Luas Area Lahan:</span>
                        <strong className="text-stone-900 font-bold">
                          {farm.landAreaHectares} Ha
                        </strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Jumlah Pohon:</span>
                        <strong className="text-stone-900 font-bold">
                          {farm.totalTreesCount.toLocaleString()} Pohon
                        </strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-stone-400 block">Varietas Utama:</span>
                        <span className="text-emerald-800 font-bold truncate block">
                          {farm.primaryVarieties.join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* GPS Coordinates preview */}
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono bg-stone-50 p-2 rounded-md border border-stone-100">
                      <span>GPS: {farm.coordinates?.latitude.toFixed(4)}, {farm.coordinates?.longitude.toFixed(4)}</span>
                      <span className="text-emerald-700 font-bold">BPN Validated</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFarmForMap(farm);
                      setCurrentView('map');
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Buka Peta Polygon</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onSelectFarmForHarvest && (
                      <button
                        type="button"
                        onClick={() => onSelectFarmForHarvest(farm.id)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Catat Panen dari Lahan Ini"
                      >
                        <Sprout className="w-3.5 h-3.5" />
                        <span>Input Panen</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEditPage(farm)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer border border-stone-200"
                      title="Edit Detail Lahan & Patok (Buka Form)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFarm(farm.id, farm.farmName)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer border border-red-200"
                      title="Hapus Lahan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
