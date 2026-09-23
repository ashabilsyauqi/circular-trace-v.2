import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Sprout,
  PlusCircle,
  Package,
  History,
  TrendingUp,
  MapPin,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Calendar,
  Sparkles,
  Calculator,
  Receipt,
  Scale,
  DollarSign,
  Droplets,
  Mountain,
  FileText,
  ChevronRight,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  TreePine,
  Trash2,
  Eye,
  Globe,
  Compass,
  X,
  Layers,
  Award,
  Save,
  Check,
  AlertTriangle,
  ArrowRight,
  Tag,
  Store,
  Printer,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { FarmerHarvestLot, CoffeeFarm, FarmWeatherData, FarmPatok } from '../types/coffee';
import { FarmerBarcodeModal } from './FarmerBarcodeModal';
import { MetricCard } from './admin/MetricCard';
import { ControlPanel } from './shared/ControlPanel';
import { StatusPipeline, PipelineStage } from './shared/StatusPipeline';
import { StatButton } from './shared/StatButton';
import { ActivityFeed } from './shared/ActivityFeed';
import { RecordBreadcrumb } from './shared/RecordBreadcrumb';
import { FarmLocationMap, INDONESIAN_COFFEE_ORIGINS } from './shared/FarmLocationMap';
import { VerificationStampBadge } from './shared/VerificationStampBadge';

// 6-Stage Pipeline for Farmer Harvest Lot
export const FARMER_LOT_STAGES: PipelineStage[] = [
  { id: 'stage_1_farm', label: '1. Lahan & Cuaca' },
  { id: 'stage_2_harvest', label: '2. Petik & Timbang' },
  { id: 'stage_3_sorting', label: '3. Sortasi & Brix' },
  { id: 'stage_4_labeling', label: '4. Barcode & EUDR' },
  { id: 'stage_5_market', label: '5. Rilis Pasar Ceri' },
  { id: 'stage_6_sold', label: '6. Terjual & Ledger' },
];

// 5-Stage Pipeline for Coffee Farm Registration & Management
export const FARM_MANAGEMENT_STAGES: PipelineStage[] = [
  { id: 'farm_profile', label: '1. Identitas & Elevasi' },
  { id: 'farm_weather', label: '2. Cuaca & Iklim Mikro' },
  { id: 'farm_agronomy', label: '3. Agronomi & Naungan' },
  { id: 'farm_map', label: '4. Peta Geolocation Maps' },
  { id: 'farm_lots', label: '5. Riwayat Lot Panen' },
];

export const FarmerView: React.FC = () => {
  const {
    currentUser,
    farmerLots,
    addFarmerHarvest,
    updateFarmerHarvestLot,
    seedFarmerLots,
    transactions,
    coffeeFarms,
    addCoffeeFarm,
    updateCoffeeFarm,
    deleteCoffeeFarm,
    seedCoffeeFarms,
    farmerActiveTab,
    setFarmerActiveTab,
  } = useCoffee();

  // Active module tab synced with context
  const activeTab = farmerActiveTab || 'farms';
  const setActiveTab = setFarmerActiveTab;

  // Filter & Search State for Lots
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Lot Worksheet State (Lembar Kerja Panen Per Stage)
  const [selectedLotDetail, setSelectedLotDetail] = useState<FarmerHarvestLot | null>(null);
  const [editedLot, setEditedLot] = useState<FarmerHarvestLot | null>(null);
  const [activeLotStageId, setActiveLotStageId] = useState<string>('stage_1_farm');

  // Farm Tab State (Lembar Kerja Lahan Per Stage)
  const [farmSearchQuery, setFarmSearchQuery] = useState('');
  const [farmViewMode, setFarmViewMode] = useState<'table' | 'kanban'>('kanban');
  const [selectedFarmDetail, setSelectedFarmDetail] = useState<CoffeeFarm | null>(null);
  const [editedFarm, setEditedFarm] = useState<CoffeeFarm | null>(null);
  const [activeFarmStageId, setActiveFarmStageId] = useState<string>('farm_profile');
  const [isRegisterFarmModalOpen, setIsRegisterFarmModalOpen] = useState(false);

  // New Farm Registration Form State
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmLocation, setNewFarmLocation] = useState('');
  const [newFarmProvince, setNewFarmProvince] = useState('Jawa Barat');
  const [newFarmAltitudeMeters, setNewFarmAltitudeMeters] = useState<number>(1550);
  const [newFarmAltitudeDisplay, setNewFarmAltitudeDisplay] = useState('1.500 - 1.620 mdpl');
  const [newFarmAreaHa, setNewFarmAreaHa] = useState<number>(2.5);
  const [newFarmTreesCount, setNewFarmTreesCount] = useState<number>(3200);
  const [newFarmVarieties, setNewFarmVarieties] = useState<string>('Sigarar Utang, Typica, Kartika');
  const [newFarmSoilType, setNewFarmSoilType] = useState<CoffeeFarm['soilType']>('Andosol Vulkanik');
  const [newFarmShadeTrees, setNewFarmShadeTrees] = useState<string>('Pohon Lamtoro, Sengon, Alpukat');
  const [newFarmOrganicStatus, setNewFarmOrganicStatus] = useState<CoffeeFarm['organicStatus']>(
    'Organik Bersertifikat (SNI / USDA)'
  );
  const [newFarmLatitude, setNewFarmLatitude] = useState<number>(-7.1724);
  const [newFarmLongitude, setNewFarmLongitude] = useState<number>(107.5681);
  const [newFarmEstYear, setNewFarmEstYear] = useState<number>(2016);
  const [newFarmPhotoUrl, setNewFarmPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1524350876685-274059332603?w=800&auto=format&fit=crop&q=80'
  );
  const [newFarmNotes, setNewFarmNotes] = useState('');
  const [newFarmPatoks, setNewFarmPatoks] = useState<FarmPatok[]>([]);

  // New Farm Weather State
  const [newFarmWeatherCondition, setNewFarmWeatherCondition] = useState<FarmWeatherData['currentCondition']>(
    'Berkabut Tebal'
  );
  const [newFarmTemp, setNewFarmTemp] = useState<number>(19.5);
  const [newFarmHumidity, setNewFarmHumidity] = useState<number>(78);
  const [newFarmRainfall, setNewFarmRainfall] = useState<number>(2200);
  const [newFarmSunshine, setNewFarmSunshine] = useState<number>(6.5);
  const [newFarmWindSpeed, setNewFarmWindSpeed] = useState<number>(11);
  const [newFarmMicroclimateNote, setNewFarmMicroclimateNote] = useState(
    'Suhu malam sejuk berkabut tebal memperlambat pematangan ceri, memaksimalkan sintesis gula & rasa specialty.'
  );

  // Form State for uploading new harvest lot
  const myFarms = coffeeFarms.filter((f) => f.farmerId === currentUser?.id);
  const myLots = farmerLots.filter((l) => l.farmerId === currentUser?.id);
  const myTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromName === currentUser?.organization ||
      t.toName === currentUser?.organization
  );

  const [selectedFarmIdForHarvest, setSelectedFarmIdForHarvest] = useState<string>(
    myFarms.length > 0 ? myFarms[0].id : ''
  );
  const [variety, setVariety] = useState('Sigarar Utang & Typica');
  const [farmLocation, setFarmLocation] = useState(currentUser?.location || 'Pangalengan, Jawa Barat');
  const [altitude, setAltitude] = useState('1.550 mdpl');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [pickingMethod, setPickingMethod] = useState<FarmerHarvestLot['pickingMethod']>(
    'Petik Merah Optimal (95%+)'
  );
  const [brix, setBrix] = useState<number>(21.5);
  const [totalWeightKg, setTotalWeightKg] = useState<number>(500);
  const [pricePerKg, setPricePerKg] = useState<number>(15000);
  const [pickingCostPerKg, setPickingCostPerKg] = useState<number>(3000); // HPP upah petik
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Barcode Modal State
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<FarmerHarvestLot | null>(null);
  const [isNewUpload, setIsNewUpload] = useState<boolean>(false);

  const totalHarvestedKg = myLots.reduce((acc, curr) => acc + curr.totalWeightKg, 0);
  const availableKg = myLots.reduce((acc, curr) => acc + curr.availableWeightKg, 0);
  const soldKg = totalHarvestedKg - availableKg;
  const totalRevenue = myTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalLandArea = myFarms.reduce((acc, curr) => acc + curr.landAreaHectares, 0);
  const totalTrees = myFarms.reduce((acc, curr) => acc + curr.totalTreesCount, 0);

  // Live valuation calculations for Form
  const estimatedGrossRevenue = totalWeightKg * pricePerKg;
  const estimatedHppCost = totalWeightKg * pickingCostPerKg;
  const estimatedNetProfit = estimatedGrossRevenue - estimatedHppCost;
  const profitMarginPercent = Math.round((estimatedNetProfit / estimatedGrossRevenue) * 100) || 0;

  // Handle opening a Lot in Worksheet mode
  const handleOpenLotWorksheet = (lot: FarmerHarvestLot) => {
    setSelectedLotDetail(lot);
    setEditedLot(JSON.parse(JSON.stringify(lot)));
    setActiveLotStageId(lot.availableWeightKg === 0 ? 'stage_6_sold' : 'stage_1_farm');
  };

  const handleCloseLotWorksheet = () => {
    setSelectedLotDetail(null);
    setEditedLot(null);
  };

  // Save changes to Lot Worksheet
  const handleSaveLotWorksheet = () => {
    if (!editedLot) return;
    updateFarmerHarvestLot(editedLot);
    setSelectedLotDetail(editedLot);
    setSuccessMessage(`Lembar Kerja Lot #${editedLot.id} berhasil disimpan!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Advance lot stage
  const handleAdvanceLotStage = () => {
    if (!editedLot) return;
    const currentIdx = FARMER_LOT_STAGES.findIndex((s) => s.id === activeLotStageId);
    if (currentIdx < FARMER_LOT_STAGES.length - 1) {
      const nextStage = FARMER_LOT_STAGES[currentIdx + 1].id;
      setActiveLotStageId(nextStage);
    }
  };

  // Handle opening a Farm in Worksheet mode
  const handleOpenFarmWorksheet = (farm: CoffeeFarm) => {
    setSelectedFarmDetail(farm);
    setEditedFarm(JSON.parse(JSON.stringify(farm)));
    setActiveFarmStageId('farm_profile');
  };

  const handleCloseFarmWorksheet = () => {
    setSelectedFarmDetail(null);
    setEditedFarm(null);
  };

  // Save changes to Farm Worksheet
  const handleSaveFarmWorksheet = () => {
    if (!editedFarm) return;
    updateCoffeeFarm(editedFarm);
    setSelectedFarmDetail(editedFarm);
    setSuccessMessage(`Data Lembar Kerja Kebun "${editedFarm.farmName}" berhasil diperbarui!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Handle auto-population when selecting farm in harvest upload form
  const handleSelectFarmForHarvest = (farmId: string) => {
    setSelectedFarmIdForHarvest(farmId);
    const targetFarm = myFarms.find((f) => f.id === farmId);
    if (targetFarm) {
      setFarmLocation(`${targetFarm.farmName}, ${targetFarm.location}`);
      setAltitude(targetFarm.altitudeDisplay);
      if (targetFarm.primaryVarieties.length > 0) {
        setVariety(targetFarm.primaryVarieties.join(', '));
      }
    }
  };

  // Handle Farm Registration Submit
  const handleRegisterFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPatoks: FarmPatok[] =
      newFarmPatoks && newFarmPatoks.length >= 3
        ? newFarmPatoks
        : [
            {
              id: 'PTK-01',
              name: 'Patok 1 (Sudut Utara - Batas Hutan)',
              latitude: Number((Number(newFarmLatitude) + 0.00072).toFixed(6)),
              longitude: Number((Number(newFarmLongitude) - 0.00035).toFixed(6)),
              elevationMeters: Number(newFarmAltitudeMeters) + 20,
              physicalType: 'Patok Beton BPN',
              condition: 'Kondisi Baik & Kokoh',
              landmarkNote: 'Batas utara plot kebun',
            },
            {
              id: 'PTK-02',
              name: 'Patok 2 (Sudut Timur Laut - Jalan Tani)',
              latitude: Number((Number(newFarmLatitude) + 0.00045).toFixed(6)),
              longitude: Number((Number(newFarmLongitude) + 0.00085).toFixed(6)),
              elevationMeters: Number(newFarmAltitudeMeters) + 10,
              physicalType: 'Patok Beton BPN',
              condition: 'Kondisi Baik & Kokoh',
              landmarkNote: 'Batas timur laut jalan tani',
            },
            {
              id: 'PTK-03',
              name: 'Patok 3 (Sudut Tenggara - Batas Parit)',
              latitude: Number((Number(newFarmLatitude) - 0.00042).toFixed(6)),
              longitude: Number((Number(newFarmLongitude) + 0.00078).toFixed(6)),
              elevationMeters: Number(newFarmAltitudeMeters) - 10,
              physicalType: 'Pipa Besi Cor',
              condition: 'Kondisi Baik & Kokoh',
              landmarkNote: 'Batas tenggara sempadan parit',
            },
            {
              id: 'PTK-04',
              name: 'Patok 4 (Sudut Barat Daya - Terasering)',
              latitude: Number((Number(newFarmLatitude) - 0.00085).toFixed(6)),
              longitude: Number((Number(newFarmLongitude) - 0.00022).toFixed(6)),
              elevationMeters: Number(newFarmAltitudeMeters) - 20,
              physicalType: 'Batu Alam / Terasering',
              condition: 'Kondisi Baik & Kokoh',
              landmarkNote: 'Batu alam batas terasering',
            },
            {
              id: 'PTK-05',
              name: 'Patok 5 (Sudut Barat - Pohon Alami)',
              latitude: Number((Number(newFarmLatitude) - 0.00015).toFixed(6)),
              longitude: Number((Number(newFarmLongitude) - 0.00095).toFixed(6)),
              elevationMeters: Number(newFarmAltitudeMeters) + 5,
              physicalType: 'Pohon Batas Alami',
              condition: 'Kondisi Baik & Kokoh',
              landmarkNote: 'Pohon batas alami',
            },
          ];

    const createdFarm = addCoffeeFarm({
      farmerId: currentUser?.id || 'USR-PTN-01',
      farmerName: currentUser?.name || 'Asep Supriatna',
      farmName: newFarmName,
      location: newFarmLocation,
      province: newFarmProvince,
      altitudeMeters: Number(newFarmAltitudeMeters),
      altitudeDisplay: newFarmAltitudeDisplay || `${newFarmAltitudeMeters} mdpl`,
      landAreaHectares: Number(newFarmAreaHa),
      totalTreesCount: Number(newFarmTreesCount),
      primaryVarieties: newFarmVarieties.split(',').map((v) => v.trim()).filter(Boolean),
      soilType: newFarmSoilType,
      shadeTrees: newFarmShadeTrees.split(',').map((s) => s.trim()).filter(Boolean),
      organicStatus: newFarmOrganicStatus,
      eudrCompliant: true,
      coordinates: {
        latitude: Number(newFarmLatitude),
        longitude: Number(newFarmLongitude),
      },
      patokList: finalPatoks,
      plotBoundary: {
        calculatedAreaHectares: Number(newFarmAreaHa),
        perimeterMeters: Math.round(Math.sqrt(Number(newFarmAreaHa) * 10000) * 4) || 450,
        geofenceRadiusMeters: Math.round(Math.sqrt(Number(newFarmAreaHa) * 10000) * 1.1) || 220,
        polygonPoints: finalPatoks.map((p) => ({
          id: p.id,
          latitude: p.latitude,
          longitude: p.longitude,
          label: p.name,
          elevationMeters: p.elevationMeters,
          physicalType: p.physicalType,
          condition: p.condition,
        })),
        patokList: finalPatoks,
      },
      weatherData: {
        currentCondition: newFarmWeatherCondition,
        temperatureCelsius: Number(newFarmTemp),
        humidityPercent: Number(newFarmHumidity),
        annualRainfallMm: Number(newFarmRainfall),
        sunshineHoursPerDay: Number(newFarmSunshine),
        windSpeedKph: Number(newFarmWindSpeed),
        microclimateNote: newFarmMicroclimateNote,
      },
      photoUrl: newFarmPhotoUrl,
      establishedYear: Number(newFarmEstYear),
      notes: newFarmNotes || 'Lahan kopi terdaftar resmi dengan pemantauan iklim mikro dan verifikasi EUDR.',
    });

    setIsRegisterFarmModalOpen(false);
    handleSelectFarmForHarvest(createdFarm.id);
    setNewFarmPatoks([]);
    setSuccessMessage(`Berhasil mendaftarkan lahan baru: ${createdFarm.farmName} (${createdFarm.altitudeDisplay})!`);
    setTimeout(() => setSuccessMessage(''), 5000);

    // Reset Form
    setNewFarmName('');
    setNewFarmLocation('');
  };

  // Handle Harvest Upload Submit
  const handleSubmitHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFarm = myFarms.find((f) => f.id === selectedFarmIdForHarvest);

    const newLot = addFarmerHarvest({
      farmId: selectedFarm?.id,
      farmName: selectedFarm?.farmName,
      farmLocation: farmLocation || selectedFarm?.location || currentUser?.location || 'Pangalengan, Jawa Barat',
      altitude: altitude || selectedFarm?.altitudeDisplay || '1.550 mdpl',
      weatherSnapshot: selectedFarm?.weatherData,
      soilType: selectedFarm?.soilType,
      shadeTrees: selectedFarm?.shadeTrees,
      variety,
      harvestDate,
      pickingMethod,
      brix: Number(brix),
      totalWeightKg: Number(totalWeightKg),
      pricePerKg: Number(pricePerKg),
      notes: notes || `Hasil panen ceri merah matang pohon dari ${selectedFarm?.farmName || farmLocation}.`,
      photoUrl:
        selectedFarm?.photoUrl ||
        'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
    });

    setSuccessMessage(`Berhasil mendaftarkan Lot Panen Baru (${totalWeightKg} kg)! Lembar kerja dan barcode telah dibuat.`);
    setActiveTab('catalog');
    setTimeout(() => setSuccessMessage(''), 5000);

    if (newLot) {
      setSelectedBarcodeLot(newLot);
      setIsNewUpload(true);
    }

    setNotes('');
  };

  // Filtered Farms
  const filteredFarms = myFarms.filter((farm) => {
    const q = farmSearchQuery.toLowerCase();
    return (
      farm.farmName.toLowerCase().includes(q) ||
      farm.location.toLowerCase().includes(q) ||
      farm.province.toLowerCase().includes(q) ||
      farm.primaryVarieties.some((v) => v.toLowerCase().includes(q))
    );
  });

  // Filtered Lots
  const filteredLots = myLots.filter((lot) => {
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && lot.availableWeightKg > 0) ||
      (statusFilter === 'sold' && lot.availableWeightKg === 0);
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.farmLocation.toLowerCase().includes(q) ||
      (lot.farmName && lot.farmName.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const getLotStageId = (lot: FarmerHarvestLot) => {
    if (lot.availableWeightKg === 0) return 'stage_6_sold';
    return 'stage_5_market';
  };

  // Weather Condition Icon Helper
  const renderWeatherIcon = (condition: FarmWeatherData['currentCondition'], className = 'w-4 h-4') => {
    switch (condition) {
      case 'Cerah Berawan':
        return <Sun className={`${className} text-amber-500`} />;
      case 'Berkabut Tebal':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'Hujan Ringan':
      case 'Hujan Lebat':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'Sejuk Berangin':
        return <Wind className={`${className} text-teal-500`} />;
      case 'Cerah Terik':
        return <Sun className={`${className} text-orange-500`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="space-y-6">
      {!selectedLotDetail && !selectedFarmDetail && (
        <>
          {/* Top Banner Hero */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-900/60">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30 backdrop-blur-xs">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Farm Tier 1 • Stasiun Hulu Perkebunan &amp; Lembar Kerja Petani</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Manajemen Kebun, Cuaca &amp; Panen Ceri Kopi
              </h1>
              <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
                Kelola data kebun dengan peta interaktif OpenStreetMap, pantau cuaca mikro pegunungan, dan catat lembar kerja panen per stage (Petik, Sortasi Brix, Labeling EUDR, hingga Rilis Pasar).
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-300 pt-1">
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Sertifikasi EUDR: <strong>Lolos Geolocation 100%</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-300" />
                  Elevasi Kebun: <strong className="text-amber-300">1.350 - 1.800 mdpl</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                  <TreePine className="w-3.5 h-3.5 text-emerald-300" />
                  Total Lahan Terdaftar: <strong className="text-emerald-300">{myFarms.length} Blok Kebun</strong>
                </span>
              </div>
            </div>

            <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
              <Sprout className="w-48 h-48" />
            </div>
          </div>

          {/* 4 Cruip-Style Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Lahan &amp; Kebun Aktif"
              value={`${myFarms.length} Blok`}
              subtitle={`${totalLandArea.toFixed(1)} Ha • ${totalTrees.toLocaleString()} Pohon`}
              icon={<TreePine className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              trend={{ value: '100% Terverifikasi', isPositive: true }}
            />

            <MetricCard
              title="Total Panen Dicatat"
              value={`${totalHarvestedKg.toLocaleString()} kg`}
              subtitle="Cherry merah segar"
              icon={<Package className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              trend={{ value: '18.4%', isPositive: true, label: 'vs musim lalu' }}
            />

            <MetricCard
              title="Stok Ceri Tersedia"
              value={`${availableKg.toLocaleString()} kg`}
              subtitle="Siap dibeli Pengolah"
              icon={<Sprout className="w-5 h-5 text-amber-600" />}
              color="amber"
              badge="Siap Jual"
            />

            <MetricCard
              title="Total Penjualan"
              value={`Rp ${totalRevenue.toLocaleString()}`}
              subtitle={`Dari ${myTransactions.length} transaksi selesai`}
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              trend={{ value: '+24.5%', isPositive: true, label: 'MoM' }}
            />
          </div>

          {/* Feedback Message Banner */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Navigation Tabs (ERP Workstation Style) */}
          <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('farms')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'farms'
                  ? 'bg-stone-900 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <TreePine className="w-4 h-4 text-emerald-400" />
              <span>1. Registrasi &amp; Lahan Kebun</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                {myFarms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-stone-900 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>2. Form Panen Baru</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-stone-900 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>3. Katalog Panen Ceri</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                {myLots.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-stone-900 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>4. Buku Kas &amp; Ledger</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
                {myTransactions.length}
              </span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: REGISTRASI & MANAJEMEN LAHAN KEBUN KOPI            */}
          {/* ======================================================== */}
          {activeTab === 'farms' && (
            <div className="space-y-4">
              <ControlPanel
                breadcrumbs={[{ label: 'Daftar Lahan & Kebun Kopi Terdaftar' }]}
                primaryActionLabel="+ Daftarkan Lahan / Kebun Baru"
                onPrimaryAction={() => setIsRegisterFarmModalOpen(true)}
                searchQuery={farmSearchQuery}
                onSearchChange={setFarmSearchQuery}
                activeFilter="all"
                onFilterChange={() => {}}
                filterOptions={[{ id: 'all', label: 'Semua Lahan Kebun' }]}
                viewMode={farmViewMode}
                onViewModeChange={(m) => setFarmViewMode(m as any)}
                recordCount={filteredFarms.length}
              />

              {filteredFarms.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <TreePine className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">Belum ada lahan kebun terdaftar</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Daftarkan blok lahan perkebunan kopi Anda dengan data ketinggian, cuaca mikro, dan peta GPS EUDR.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      onClick={() => setIsRegisterFarmModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Daftarkan Lahan Pertama</span>
                    </button>
                    <button
                      onClick={seedCoffeeFarms}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Muat Data Seeder Kebun (6 Origin)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* VIEW 1: CARDS / KANBAN GRID VIEW */}
                  {farmViewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredFarms.map((farm) => {
                        const farmHarvestCount = myLots.filter(
                          (l) => l.farmId === farm.id || l.farmLocation.includes(farm.farmName)
                        ).length;

                        return (
                          <div
                            key={farm.id}
                            onClick={() => handleOpenFarmWorksheet(farm)}
                            className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between cursor-pointer group"
                          >
                            <div>
                              {/* Header Image with Badges */}
                              <div className="relative h-48 bg-stone-100 overflow-hidden">
                                <img
                                  src={farm.photoUrl}
                                  alt={farm.farmName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                                  {farm.id}
                                </div>
                                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                  {farm.verificationStamp && (
                                    <VerificationStampBadge stamp={farm.verificationStamp} size="sm" />
                                  )}
                                  <span className="bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                                    <Mountain className="w-3 h-3" />
                                    {farm.altitudeDisplay}
                                  </span>
                                </div>

                                {/* Weather Ribbon on Image */}
                                <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white flex items-center justify-between text-xs border border-white/10">
                                  <div className="flex items-center gap-1.5">
                                    {renderWeatherIcon(farm.weatherData.currentCondition, 'w-4 h-4')}
                                    <span className="font-bold text-[11px]">{farm.weatherData.currentCondition}</span>
                                  </div>
                                  <div className="flex items-center gap-2.5 text-[11px] font-mono font-bold text-amber-300">
                                    <span>{farm.weatherData.temperatureCelsius}°C</span>
                                    <span>•</span>
                                    <span>{farm.weatherData.humidityPercent}% RH</span>
                                  </div>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="p-5 space-y-3">
                                <div>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                                      {farm.province}
                                    </span>
                                    <span className="text-[10px] text-stone-400 font-semibold">
                                      Sejak Thn {farm.establishedYear}
                                    </span>
                                  </div>
                                  <h3 className="font-black text-base text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors mt-1.5">
                                    {farm.farmName}
                                  </h3>
                                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                    <span className="truncate">{farm.location}</span>
                                  </p>
                                </div>

                                {/* Agronomy & Scale Grid */}
                                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100 bg-stone-50/50 p-2.5 rounded-xl">
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Luas Lahan:</span>
                                    <span className="font-bold text-stone-800">{farm.landAreaHectares} Ha</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Populasi Pohon:</span>
                                    <span className="font-bold text-stone-800">~{farm.totalTreesCount.toLocaleString()} btg</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Jenis Tanah:</span>
                                    <span className="font-bold text-emerald-800 truncate block">{farm.soilType}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-stone-400 block font-semibold">Peta EUDR:</span>
                                    <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                                      <ShieldCheck className="w-3 h-3" /> GPS Valid
                                    </span>
                                  </div>
                                </div>

                                {/* Varieties Chips */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-stone-400 block font-semibold">Varietas Utama:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {farm.primaryVarieties.map((v, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
                                      >
                                        {v}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Microclimate Quote */}
                                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 italic line-clamp-2">
                                  "{farm.weatherData.microclimateNote}"
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectFarmForHarvest(farm.id);
                                  setActiveTab('upload');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Input Panen</span>
                              </button>

                              <div className="text-right flex items-center gap-1 text-xs font-bold text-stone-700 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all">
                                <span>Buka Lembar Kerja ({farmHarvestCount} Lot)</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* VIEW 2: TABLE VIEW */}
                  {farmViewMode === 'table' && (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="py-3.5 px-4">ID Kebun</th>
                              <th className="py-3.5 px-4">Nama Lahan &amp; Lokasi</th>
                              <th className="py-3.5 px-4">Elevasi mdpl</th>
                              <th className="py-3.5 px-4">Kondisi Cuaca Mikro</th>
                              <th className="py-3.5 px-4">Varietas &amp; Jenis Tanah</th>
                              <th className="py-3.5 px-4">Luas &amp; Populasi</th>
                              <th className="py-3.5 px-4">EUDR Maps</th>
                              <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {filteredFarms.map((farm) => (
                              <tr
                                key={farm.id}
                                onClick={() => handleOpenFarmWorksheet(farm)}
                                className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                              >
                                <td className="py-3 px-4 font-mono font-bold text-stone-900">
                                  {farm.id}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-stone-900">{farm.farmName}</div>
                                  <div className="text-[11px] text-stone-500">{farm.location} • {farm.province}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    {farm.altitudeDisplay}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                                    {renderWeatherIcon(farm.weatherData.currentCondition, 'w-3.5 h-3.5')}
                                    <span>{farm.weatherData.currentCondition}</span>
                                  </div>
                                  <div className="text-[11px] text-stone-500 font-mono">
                                    {farm.weatherData.temperatureCelsius}°C • {farm.weatherData.humidityPercent}% RH
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-medium text-stone-900 truncate max-w-[160px]">
                                    {farm.primaryVarieties.join(', ')}
                                  </div>
                                  <div className="text-[11px] text-stone-500">{farm.soilType}</div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-bold text-stone-900">{farm.landAreaHectares} Ha</span>
                                  <span className="text-stone-400 text-[11px]"> (~{farm.totalTreesCount.toLocaleString()} phn)</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Maps OK
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenFarmWorksheet(farm);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Lembar Kerja</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: FORM PENDAFTARAN PANEN BARU                        */}
          {/* ======================================================== */}
          {activeTab === 'upload' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm max-w-4xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Pendaftaran Komoditas Ceri Kopi dari Lahan Terdaftar
                </div>
                <h2 className="text-xl font-black text-stone-900">
                  Formulir Pendaftaran Hasil Panen Ceri Kopi
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Pilih lahan perkebunan kopi Anda untuk mengisi otomatis elevasi ketinggian, kondisi iklim mikro, dan verifikasi asal-usul sertifikasi EUDR.
                </p>

                <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Protokol Verifikasi Mutu Panen:</strong> Setiap lot ceri kopi yang didaftarkan akan berstatus <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-bold text-[10px]">Menunggu Audit Mutu</span> dan diperiksa langsung oleh Verifikator Mutu Petani (°Brix Refraktometer &amp; Rasio Petik Merah) sebelum diterbitkan sertifikat mutu sah.
                  </div>
                </div>
              </div>

              {/* FARM SELECTOR CARD WITH LIVE MAPS */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-950">
                  Pilih Lahan / Kebun Kopi Terdaftar (Auto-Fill Elevasi &amp; Peta GPS)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={selectedFarmIdForHarvest}
                    onChange={(e) => handleSelectFarmForHarvest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 text-sm font-bold bg-white text-stone-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    {myFarms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.farmName} — {f.altitudeDisplay} ({f.location})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRegisterFarmModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+ Daftarkan Lahan Baru</span>
                    </button>
                  </div>
                </div>

                {/* Selected Farm Live Snapshot Preview & Map */}
                {selectedFarmIdForHarvest && (
                  (() => {
                    const farmObj = myFarms.find((f) => f.id === selectedFarmIdForHarvest);
                    if (!farmObj) return null;
                    return (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                            <span className="text-[10px] text-stone-500 block">Ketinggian Lahan:</span>
                            <span className="font-black text-emerald-800 text-xs">{farmObj.altitudeDisplay}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                            <span className="text-[10px] text-stone-500 block">Cuaca &amp; Suhu:</span>
                            <span className="font-bold text-stone-900 text-xs flex items-center gap-1">
                              {renderWeatherIcon(farmObj.weatherData.currentCondition, 'w-3 h-3')}
                              {farmObj.weatherData.temperatureCelsius}°C ({farmObj.weatherData.currentCondition})
                            </span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                            <span className="text-[10px] text-stone-500 block">Jenis Tanah &amp; Naungan:</span>
                            <span className="font-bold text-stone-900 text-xs truncate block">{farmObj.soilType}</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                            <span className="text-[10px] text-stone-500 block">Sertifikasi EUDR:</span>
                            <span className="font-bold text-emerald-700 text-xs flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Geolocation OK
                            </span>
                          </div>
                        </div>

                        {/* Interactive OpenStreetMap for selected farm */}
                        <FarmLocationMap
                          key={farmObj.id}
                          latitude={farmObj.coordinates?.latitude || -7.1724}
                          longitude={farmObj.coordinates?.longitude || 107.5681}
                          farmName={farmObj.farmName}
                          altitude={farmObj.altitudeDisplay}
                          locationName={farmObj.location}
                          landAreaHectares={farmObj.landAreaHectares}
                          totalTreesCount={farmObj.totalTreesCount}
                          plotBoundary={farmObj.plotBoundary}
                          patokList={farmObj.patokList}
                          height="280px"
                          showPresets={false}
                          allowEdit={false}
                        />
                      </div>
                    );
                  })()
                )}
              </div>

              <form onSubmit={handleSubmitHarvest} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Varietas Kopi
                    </label>
                    <input
                      type="text"
                      required
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      placeholder="Contoh: Typica, Sigarar Utang, Ateng Super"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Lokasi Kebun / Blok Lahan
                    </label>
                    <input
                      type="text"
                      required
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      placeholder="Contoh: Pangalengan Blok Gunung Tilu"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Ketinggian Kebun (mdpl)
                    </label>
                    <input
                      type="text"
                      required
                      value={altitude}
                      onChange={(e) => setAltitude(e.target.value)}
                      placeholder="Contoh: 1.550 mdpl"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Tanggal Panen
                    </label>
                    <input
                      type="date"
                      required
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Metode Petik Ceri
                    </label>
                    <select
                      value={pickingMethod}
                      onChange={(e) =>
                        setPickingMethod(e.target.value as FarmerHarvestLot['pickingMethod'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Petik Merah Optimal (95%+)">
                        Petik Merah Optimal (95%+) - Specialty Standard
                      </option>
                      <option value="Petik Campur (Merah & Kuning)">
                        Petik Campur (Merah &amp; Kuning)
                      </option>
                      <option value="Petik Rata">Petik Rata Komersial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Tingkat Kemanisan Buah (°Brix)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={brix}
                      onChange={(e) => setBrix(Number(e.target.value))}
                      placeholder="Contoh: 21.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-stone-500">Standar cherry specialty matang: 19° - 24° Brix</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Total Berat Panen (kg)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={totalWeightKg}
                      onChange={(e) => setTotalWeightKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Harga Penawaran per kg (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      step="500"
                      value={pricePerKg}
                      onChange={(e) => setPricePerKg(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Interactive Valuation & Profitability Card */}
                <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                      Kalkulator Nilai Lot &amp; Perkiraan Laba Bersih
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <span className="text-[11px] text-stone-500 block">Estimasi Nilai Lot (Gross):</span>
                      <strong className="text-base font-black text-stone-900 block mt-0.5">
                        Rp {estimatedGrossRevenue.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-stone-400">
                        {totalWeightKg} kg × Rp {pricePerKg.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <span className="text-[11px] text-stone-500 block">Estimasi Ongkos Petik (HPP):</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={pickingCostPerKg}
                          onChange={(e) => setPickingCostPerKg(Number(e.target.value))}
                          className="w-20 px-2 py-0.5 text-xs font-bold border rounded bg-stone-50"
                          title="Biaya upah petik per kg"
                        />
                        <span className="text-xs text-stone-500">/kg</span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        Total HPP: Rp {estimatedHppCost.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                      <span className="text-[11px] text-emerald-700 font-bold block">
                        Estimasi Margin Keuntungan:
                      </span>
                      <strong className="text-base font-black text-emerald-700 block mt-0.5">
                        +Rp {estimatedNetProfit.toLocaleString()} ({profitMarginPercent}%)
                      </strong>
                      <span className="text-[10px] text-emerald-600">Laba bersih petani</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Catatan Karakter Kebun, Pohon &amp; Cuaca Saat Petik
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tuliskan catatan khusus, misalnya: Pemupukan organik kascing, naungan pohon lamtoro, petik pagi cerah saat embun kering..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Daftarkan Hasil Panen ke Sistem &amp; Buat Barcode
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: KATALOG PANEN SAYA (List Tabel & Kanban)          */}
          {/* ======================================================== */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <ControlPanel
                breadcrumbs={[{ label: 'Katalog Panen Ceri Petani' }]}
                primaryActionLabel="+ Daftarkan Panen"
                onPrimaryAction={() => setActiveTab('upload')}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={statusFilter}
                onFilterChange={(f) => setStatusFilter(f as any)}
                filterOptions={[
                  { id: 'all', label: 'Semua Status' },
                  { id: 'available', label: 'Tersedia Siap Jual' },
                  { id: 'sold', label: 'Terjual' },
                ]}
                viewMode={viewMode}
                onViewModeChange={(m) => setViewMode(m as any)}
                recordCount={filteredLots.length}
              />

              {filteredLots.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                  <Sprout className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800">Belum ada lot panen di katalog</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                    Katalog panen saat ini kosong. Daftarkan panen baru atau muat data seeder panen petani Nusantara (10 lot).
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Input Panen Baru</span>
                    </button>
                    <button
                      onClick={seedFarmerLots}
                      className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Muat Ulang Seeder Panen (10 Lot)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* VIEW 1: TABLE VIEW (Default ERP List) */}
                  {viewMode === 'table' && (
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="py-3.5 px-4">ID Lot Panen</th>
                              <th className="py-3.5 px-4">Varietas &amp; Kebun Asal</th>
                              <th className="py-3.5 px-4">Tgl Panen</th>
                              <th className="py-3.5 px-4">Ketinggian &amp; Cuaca</th>
                              <th className="py-3.5 px-4">Kemanisan Brix</th>
                              <th className="py-3.5 px-4">Stok Tersedia</th>
                              <th className="py-3.5 px-4">Harga Penawaran</th>
                              <th className="py-3.5 px-4">Tahap Kerja</th>
                              <th className="py-3.5 px-4">Audit Mutu</th>
                              <th className="py-3.5 px-4 text-right">Aksi Lembar Kerja</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {filteredLots.map((lot) => {
                              const isAvailable = lot.availableWeightKg > 0;
                              return (
                                <tr
                                  key={lot.id}
                                  onClick={() => handleOpenLotWorksheet(lot)}
                                  className="hover:bg-emerald-50/40 cursor-pointer transition-colors group"
                                >
                                  <td className="py-3 px-4 font-mono font-bold text-stone-900 group-hover:text-emerald-700">
                                    {lot.id}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-stone-900">{lot.variety}</div>
                                    <div className="text-[11px] text-stone-500">
                                      {lot.farmName ? `${lot.farmName} • ` : ''}{lot.farmLocation}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-stone-700 font-medium">
                                    {lot.harvestDate}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-stone-800">{lot.altitude}</div>
                                    {lot.weatherSnapshot ? (
                                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                                        {renderWeatherIcon(lot.weatherSnapshot.currentCondition, 'w-3 h-3')}
                                        <span>{lot.weatherSnapshot.temperatureCelsius}°C</span>
                                      </div>
                                    ) : (
                                      <span className="text-[11px] text-stone-400">EUDR GPS OK</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="font-black text-emerald-700">{lot.brix}° Brix</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="font-bold text-stone-900">{lot.availableWeightKg}</span>
                                    <span className="text-stone-400 text-[11px]"> / {lot.totalWeightKg} kg</span>
                                  </td>
                                  <td className="py-3 px-4 font-bold text-stone-900">
                                    Rp {lot.pricePerKg.toLocaleString()} / kg
                                  </td>
                                  <td className="py-3 px-4">
                                    {isAvailable ? (
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                        Siap Jual
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                                        Terjual
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <VerificationStampBadge
                                      stamp={lot.verificationStamp}
                                      status={lot.verificationStatus}
                                      size="sm"
                                    />
                                  </td>
                                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedBarcodeLot(lot);
                                          setIsNewUpload(false);
                                        }}
                                        className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <QrCode className="w-3 h-3" />
                                        Barcode
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenLotWorksheet(lot)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <span>Lembar Kerja</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: KANBAN VIEW */}
                  {viewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Column 1: Siap Jual */}
                      <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                              Tersedia Siap Jual
                            </h4>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                            {filteredLots.filter((l) => l.availableWeightKg > 0).length} Lot
                          </span>
                        </div>

                        <div className="space-y-3">
                          {filteredLots
                            .filter((l) => l.availableWeightKg > 0)
                            .map((lot) => (
                              <div
                                key={lot.id}
                                onClick={() => handleOpenLotWorksheet(lot)}
                                className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer space-y-2"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-mono font-bold text-stone-900">{lot.id}</span>
                                  <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <h5 className="font-bold text-sm text-stone-900 leading-tight">{lot.variety}</h5>
                                  <span className="font-black text-emerald-700 text-xs">{lot.brix}° Brix</span>
                                </div>
                                <p className="text-[11px] text-stone-500">{lot.farmLocation} • {lot.altitude}</p>
                                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                                  <span className="font-bold text-stone-700">{lot.availableWeightKg} kg</span>
                                  <span className="font-black text-stone-900">Rp {lot.pricePerKg.toLocaleString()}/kg</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Column 2: Terjual */}
                      <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                            <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                              Terjual &amp; Terdistribusi
                            </h4>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full">
                            {filteredLots.filter((l) => l.availableWeightKg === 0).length} Lot
                          </span>
                        </div>

                        <div className="space-y-3">
                          {filteredLots
                            .filter((l) => l.availableWeightKg === 0)
                            .map((lot) => (
                              <div
                                key={lot.id}
                                onClick={() => handleOpenLotWorksheet(lot)}
                                className="bg-white/80 p-4 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2 opacity-80"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-mono font-bold text-stone-600">{lot.id}</span>
                                  <VerificationStampBadge stamp={lot.verificationStamp} status={lot.verificationStatus} size="sm" />
                                </div>
                                <h5 className="font-bold text-sm text-stone-800">{lot.variety}</h5>
                                <p className="text-[11px] text-stone-500">{lot.farmLocation}</p>
                                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                                  <span className="text-stone-500">{lot.totalWeightKg} kg</span>
                                  <span className="font-bold text-stone-700">Ludes Terjual</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BUKU KAS & RIWAYAT PENJUALAN                       */}
          {/* ======================================================== */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-600" />
                    Catatan Penjualan Ceri Kopi ke Pengolah
                  </h2>
                  <p className="text-xs text-stone-500">
                    Log riwayat transaksi hulu yang tercatat secara permanen di buku besar rantai pasok.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-bold uppercase">Total Penerimaan</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    Rp {totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>

              {myTransactions.length === 0 ? (
                <div className="py-14 text-center">
                  <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">Belum ada transaksi penjualan ceri kopi.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myTransactions.map((trx) => (
                    <div
                      key={trx.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border border-stone-200/90 bg-stone-50/60 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 sm:w-2/5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 truncate">
                            <span className="truncate">Dijual ke</span>
                            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{trx.toName}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 truncate">
                            {trx.itemName} • {trx.date} • <span className="font-mono">{trx.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-1">
                        <div className="text-xs">
                          <span className="text-stone-400">Volume: </span>
                          <span className="font-bold text-emerald-700">{trx.quantity}</span>
                        </div>
                        <div className="text-sm font-black text-stone-900 font-mono">
                          Rp {trx.totalAmount.toLocaleString()}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold whitespace-nowrap">
                          {trx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 1. LEMBAR KERJA INTERAKTIF PER STAGE: LOT PANEN CERI (Farmer Worksheet)  */}
      {/* ========================================================================= */}
      {editedLot && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Breadcrumb Navigation */}
          <RecordBreadcrumb
            listLabel="Katalog Panen Ceri Petani"
            recordLabel={editedLot.id}
            onBack={handleCloseLotWorksheet}
          />

          {/* Odoo Statusbar Header: Actions on Left, Status Chevrons on Right */}
          <div className="o_form_statusbar flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAdvanceLotStage}
                className="btn-odoo-primary"
              >
                <span>Lanjut Tahap Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleSaveLotWorksheet}
                className="btn-odoo-secondary"
              >
                <Save className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simpan Lembar Kerja</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedBarcodeLot(editedLot);
                  setIsNewUpload(false);
                }}
                className="btn-odoo-secondary"
              >
                <QrCode className="w-3.5 h-3.5 text-stone-700" />
                <span>Cetak Barcode Karung</span>
              </button>

              <button
                type="button"
                onClick={handleCloseLotWorksheet}
                className="btn-odoo-secondary text-stone-500"
              >
                <span>Tutup / Kembali</span>
              </button>
            </div>

            {/* Clickable 6-Stage Pipeline Chevrons */}
            <div className="overflow-x-auto">
              <StatusPipeline
                stages={FARMER_LOT_STAGES}
                currentStageId={getLotStageId(editedLot)}
                selectedStageId={activeLotStageId}
                isClickable={true}
                onSelectStage={(stageId) => setActiveLotStageId(stageId)}
              />
            </div>
          </div>

          {/* Odoo Form Sheet Container */}
          <div className="o_form_sheet p-6 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-6">
            {/* Sheet Header Info */}
            <div className="pb-5 border-b border-stone-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                    Lembar Kerja Panen Ceri &bull; 6-Stage
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-stone-100 text-stone-900 border border-stone-300">
                    {editedLot.variety}
                  </span>
                  <VerificationStampBadge stamp={editedLot.verificationStamp} status={editedLot.verificationStatus} size="sm" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tracking-tight">
                  {editedLot.id}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Petani: <strong className="text-stone-800">{editedLot.farmerName}</strong> &bull; Kebun: <strong className="text-stone-800">{editedLot.farmName || editedLot.farmLocation}</strong> ({editedLot.altitude}) &bull; Tgl Panen: <strong>{editedLot.harvestDate}</strong>
                </p>
              </div>

              {/* Right Side Smart Stat Buttons */}
              <div className="flex flex-wrap gap-2">
                <StatButton
                  icon={<Scale className="w-4 h-4" />}
                  value={`${editedLot.availableWeightKg} / ${editedLot.totalWeightKg} kg`}
                  label="Stok Ceri Tersedia"
                  color="emerald"
                />
                <StatButton
                  icon={<Droplets className="w-4 h-4" />}
                  value={`${editedLot.brix}° Brix`}
                  label="Kadar Kemanisan"
                  color="purple"
                />
                <StatButton
                  icon={<Mountain className="w-4 h-4" />}
                  value={editedLot.altitude}
                  label="Ketinggian Lahan"
                  color="blue"
                />
                <StatButton
                  icon={<DollarSign className="w-4 h-4" />}
                  value={`Rp ${editedLot.pricePerKg.toLocaleString()}`}
                  label="Harga / kg"
                  color="amber"
                />
                <StatButton
                  icon={<Receipt className="w-4 h-4" />}
                  value={`Rp ${(editedLot.totalWeightKg * editedLot.pricePerKg).toLocaleString()}`}
                  label="Valuasi Total"
                  color="stone"
                />
              </div>
            </div>

            {/* Verification Certificate Banner if verified or pending */}
            {editedLot.verificationStatus === 'verified' && editedLot.verificationStamp ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-950 text-sm font-black">{editedLot.verificationStamp.title}</strong>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900">
                        {editedLot.verificationStamp.scoreDisplay}
                      </span>
                    </div>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      {editedLot.verificationStamp.notes}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-emerald-700/80 mt-1">
                      <span>Verifikator: <strong>{editedLot.verificationStamp.verifierName}</strong> ({editedLot.verificationStamp.verifierOrg})</span>
                      <span>&bull;</span>
                      <span className="font-mono">Hash: {editedLot.verificationStamp.digitalSignatureHash.substring(0, 16)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Status Verifikasi Mutu: <strong>Menunggu Audit Lapangan</strong> oleh Tim Verifikator Mutu Petani.</span>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">Uji °Brix &amp; Petik Merah</span>
              </div>
            )}

            {/* Stage Banner */}
            {(() => {
              const currentStageMeta = FARMER_LOT_STAGES.find((s) => s.id === activeLotStageId);
              const idx = FARMER_LOT_STAGES.findIndex((s) => s.id === activeLotStageId);
              const prev = idx > 0 ? FARMER_LOT_STAGES[idx - 1] : null;
              const next = idx < FARMER_LOT_STAGES.length - 1 ? FARMER_LOT_STAGES[idx + 1] : null;

              return (
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-emerald-400 font-mono font-bold text-xs">
                      Tahap {idx + 1} / 6
                    </span>
                    <h3 className="text-base font-black text-stone-900">
                      {currentStageMeta?.label}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {prev && (
                      <button
                        type="button"
                        onClick={() => setActiveLotStageId(prev.id)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        ← {prev.label}
                      </button>
                    )}
                    {next && (
                      <button
                        type="button"
                        onClick={() => setActiveLotStageId(next.id)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {next.label} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ------------------------------------------------------------------------- */}
            {/* STAGE 1: LAHAN, CUACA MIKRO & PETA MAPS ACTUAL                           */}
            {/* ------------------------------------------------------------------------- */}
            {activeLotStageId === 'stage_1_farm' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Interactive OpenStreetMap Actual Map */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <Compass className="w-4 h-4 text-emerald-600" /> Peta Koordinat Actual Kebun &amp; EUDR
                    </h4>
                    {(() => {
                      const linkedFarm = myFarms.find((f) => f.id === editedLot.farmId) || myFarms[0];
                      const lat = linkedFarm?.coordinates?.latitude || -7.1724;
                      const lng = linkedFarm?.coordinates?.longitude || 107.5681;

                      return (
                        <FarmLocationMap
                          latitude={lat}
                          longitude={lng}
                          farmName={editedLot.farmName || linkedFarm?.farmName || 'Kebun Kopi Pasir Kunci'}
                          altitude={editedLot.altitude}
                          locationName={editedLot.farmLocation}
                          landAreaHectares={linkedFarm?.landAreaHectares || 2.4}
                          totalTreesCount={linkedFarm?.totalTreesCount || 3200}
                          plotBoundary={linkedFarm?.plotBoundary}
                          patokList={linkedFarm?.patokList}
                          height="360px"
                          showPresets={true}
                          onCoordinatesChange={(newLat, newLng) => {
                            if (linkedFarm) {
                              updateCoffeeFarm({
                                ...linkedFarm,
                                coordinates: { latitude: newLat, longitude: newLng },
                              });
                            }
                          }}
                          onPatokListChange={(newPatoks) => {
                            if (linkedFarm) {
                              updateCoffeeFarm({
                                ...linkedFarm,
                                patokList: newPatoks,
                              });
                            }
                          }}
                        />
                      );
                    })()}
                  </div>

                  {/* Right: Weather Snapshot & Microclimate */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white p-5 rounded-3xl space-y-3 shadow-xs border border-emerald-900">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-xs text-stone-200">
                          Snapshot Iklim Mikro Saat Petik
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {editedLot.weatherSnapshot?.currentCondition || 'Berkabut Tebal'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                        <div className="bg-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-stone-300 block">Suhu Udara</span>
                          <strong className="text-sm font-bold text-amber-300 block">
                            {editedLot.weatherSnapshot?.temperatureCelsius || 19.5} °C
                          </strong>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-stone-300 block">Kelembaban RH</span>
                          <strong className="text-sm font-bold text-teal-300 block">
                            {editedLot.weatherSnapshot?.humidityPercent || 78} %
                          </strong>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-stone-300 block">Curah Hujan</span>
                          <strong className="text-sm font-bold text-blue-300 block">
                            {editedLot.weatherSnapshot?.annualRainfallMm || 2200} mm
                          </strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-300 italic pt-1">
                        "{editedLot.weatherSnapshot?.microclimateNote || 'Suhu sejuk lereng gunung memperlambat pematangan ceri, memaksimalkan sintesis gula.'}"
                      </p>
                    </div>

                    {/* Agronomy & Soil Specs */}
                    <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                      <h5 className="font-bold text-stone-900 uppercase text-[11px] flex items-center gap-1.5">
                        <TreePine className="w-3.5 h-3.5 text-emerald-600" /> Agronomi &amp; Pohon Penaung
                      </h5>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-stone-500 block text-[10px]">Jenis Tanah:</span>
                          <span className="font-bold text-emerald-800">{editedLot.soilType || 'Andosol Vulkanik'}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[10px]">Penaung:</span>
                          <span className="font-bold text-stone-800">{editedLot.shadeTrees?.join(', ') || 'Lamtoro, Alpukat'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* STAGE 2: PETIK & TIMBANG (Harvest & Weighing)                             */}
            {/* ------------------------------------------------------------------------- */}
            {activeLotStageId === 'stage_2_harvest' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                      <Scale className="w-4 h-4 text-emerald-600" /> Parameter Penimbangan Ceri Segar
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Total Berat Panen (kg)</label>
                        <input
                          type="number"
                          value={editedLot.totalWeightKg}
                          onChange={(e) =>
                            setEditedLot({
                              ...editedLot,
                              totalWeightKg: Number(e.target.value),
                              availableWeightKg: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Tanggal Panen</label>
                        <input
                          type="date"
                          value={editedLot.harvestDate}
                          onChange={(e) => setEditedLot({ ...editedLot, harvestDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium bg-white"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block font-bold text-stone-700 uppercase mb-1">Metode Petik Ceri</label>
                        <select
                          value={editedLot.pickingMethod}
                          onChange={(e) =>
                            setEditedLot({
                              ...editedLot,
                              pickingMethod: e.target.value as FarmerHarvestLot['pickingMethod'],
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                        >
                          <option value="Petik Merah Optimal (95%+)">Petik Merah Optimal (95%+) - Specialty Standard</option>
                          <option value="Petik Campur (Merah & Kuning)">Petik Campur (Merah &amp; Kuning)</option>
                          <option value="Petik Rata">Petik Rata Komersial</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block font-bold text-stone-700 uppercase mb-1">Varietas Ceri</label>
                        <input
                          type="text"
                          value={editedLot.variety}
                          onChange={(e) => setEditedLot({ ...editedLot, variety: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                      <Calculator className="w-4 h-4 text-emerald-600" /> Biaya Operasional Upah Petik (HPP)
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Upah Petik per kg (Rp)</label>
                        <input
                          type="number"
                          step="500"
                          value={pickingCostPerKg}
                          onChange={(e) => setPickingCostPerKg(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Total Biaya Upah Petik:</span>
                          <strong className="text-stone-900">Rp {(editedLot.totalWeightKg * pickingCostPerKg).toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Estimasi Jumlah Karung (50 kg):</span>
                          <strong className="text-stone-900">{Math.ceil(editedLot.totalWeightKg / 50)} Karung</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* STAGE 3: SORTASI & UJI KEMANISAN BRIX                                     */}
            {/* ------------------------------------------------------------------------- */}
            {activeLotStageId === 'stage_3_sorting' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3 text-xs">
                    <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                      <Droplets className="w-4 h-4 text-purple-600" />
                      <h4 className="font-bold text-stone-900">Uji Kemanisan Refraktometer (°Brix)</h4>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">Nilai Brix Terukur</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editedLot.brix}
                        onChange={(e) => setEditedLot({ ...editedLot, brix: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-black text-base text-purple-800 bg-white"
                      />
                    </div>

                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900">
                      {editedLot.brix >= 21 ? (
                        <strong>✨ Ultra Sweet Specialty Grade (Brix ≥ 21°)</strong>
                      ) : (
                        <strong>Standar Panen Matang ({editedLot.brix}° Brix)</strong>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3 text-xs">
                    <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-stone-900">Uji Sortasi Rambang Air</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-stone-200">
                        <span className="text-stone-500">Ceri Tenggelam (Padat):</span>
                        <strong className="text-emerald-700 font-mono">96.5%</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200">
                        <span className="text-stone-500">Ceri Terapung (Floater/Hampa):</span>
                        <strong className="text-stone-700 font-mono">3.5% (Dibuang)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3 text-xs">
                    <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-stone-900">Indeks Kematangan Visual</h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-stone-200">
                        <span className="text-stone-500">Merah Marun Matang:</span>
                        <strong className="text-emerald-700 font-mono">95%</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200">
                        <span className="text-stone-500">Jingga / Kuning:</span>
                        <strong className="text-amber-700 font-mono">5%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-xs text-stone-700 uppercase mb-1">Catatan Sortasi Fisik</label>
                  <textarea
                    rows={2}
                    value={editedLot.notes}
                    onChange={(e) => setEditedLot({ ...editedLot, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* STAGE 4: LABELING KARUNG & SERTIFIKASI EUDR                              */}
            {/* ------------------------------------------------------------------------- */}
            {activeLotStageId === 'stage_4_labeling' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                      <QrCode className="w-4 h-4 text-emerald-600" /> Barcode Karung Ketertelusuran
                    </h4>

                    <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center gap-4">
                      <div className="w-16 h-16 bg-stone-900 text-white rounded-xl flex items-center justify-center font-mono text-xl font-bold">
                        <QrCode className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-bold uppercase">Barcode ID Karung</span>
                        <strong className="font-mono text-base text-stone-900">{editedLot.id}</strong>
                        <span className="text-[11px] text-stone-500 block">{editedLot.variety} &bull; {editedLot.altitude}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBarcodeLot(editedLot);
                        setIsNewUpload(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Stiker Label Barcode Karung</span>
                    </button>
                  </div>

                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4 text-xs">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verifikasi EUDR Geolocation
                    </h4>

                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <strong>European Deforestation Regulation (EUDR) Verified</strong>
                          <p className="text-[10px] text-emerald-700">Titik polygon kebun terbukti bebas deforestasi sejak cutoff date 2020.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Standar Kemasan:</span>
                          <strong className="text-stone-800">Karung Goni Bersih + Label Barcode</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Estimasi Masa Simpan Segar:</span>
                          <strong className="text-stone-800">12 - 24 Jam Pasca Petik</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* STAGE 5: RILIS PASAR CERI KE PENGOLAH (Marketplace Release)               */}
            {/* ------------------------------------------------------------------------- */}
            {activeLotStageId === 'stage_5_market' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                      <DollarSign className="w-4 h-4 text-amber-600" /> Penetapan Harga &amp; Ketersediaan Stok
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Harga Penawaran per kg (Rp)</label>
                        <input
                          type="number"
                          step="500"
                          value={editedLot.pricePerKg}
                          onChange={(e) => setEditedLot({ ...editedLot, pricePerKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-base text-stone-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Stok Ceri Tersedia (kg)</label>
                        <input
                          type="number"
                          value={editedLot.availableWeightKg}
                          onChange={(e) => setEditedLot({ ...editedLot, availableWeightKg: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4 text-xs">
                    <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2 border-b border-emerald-200 pb-2">
                      <Calculator className="w-4 h-4 text-emerald-700" /> Rincian Margin &amp; Laba Bersih Petani
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-emerald-200/60">
                        <span className="text-stone-600">Estimasi Pendapatan Kotor (Gross):</span>
                        <strong className="text-stone-900 font-mono">Rp {(editedLot.totalWeightKg * editedLot.pricePerKg).toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-200/60">
                        <span className="text-stone-600">Total Ongkos Upah Petik (HPP):</span>
                        <strong className="text-stone-900 font-mono">Rp {(editedLot.totalWeightKg * pickingCostPerKg).toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-1 pt-2">
                        <span className="font-bold text-emerald-900">Perkiraan Laba Bersih:</span>
                        <strong className="text-emerald-700 font-mono text-sm">
                          +Rp {(editedLot.totalWeightKg * (editedLot.pricePerKg - pickingCostPerKg)).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* STAGE 6: TERJUAL & TRANSKASI LEDGER                                      */}
            {/* ------------------------------------------------------------------------- */}
            {activeLotStageId === 'stage_6_sold' && (
              <div className="space-y-6 text-xs">
                <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Receipt className="w-4 h-4 text-emerald-600" /> Log Penjualan Ceri ke Stasiun Pengolah (Mill)
                  </h4>

                  {editedLot.availableWeightKg === 0 ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold">Lot Panen Telah Ludes Terjual dan Diserap oleh Stasiun Pengolah!</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Hasil panen #{editedLot.id} telah diserahkan dan masuk ke lembar kerja batch pengolahan untuk konversi menjadi Green Bean Specialty.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950">
                      <span>Stok ceri masih tersedia ({editedLot.availableWeightKg} kg) dan siap dibeli oleh stasiun pengolah pada modul Sourcing Pengolah.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Activity Feed / Chatter */}
            <div className="pt-4 border-t border-stone-200">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Log Aktivitas &amp; Silsilah Lembar Kerja Panen
              </h4>
              <ActivityFeed
                documentTitle={`Lot Panen #${editedLot.id}`}
                initialMessages={[
                  {
                    id: 'm1',
                    author: editedLot.farmerName,
                    type: 'note',
                    content: `Hasil panen didaftarkan dengan varietas ${editedLot.variety} (${editedLot.totalWeightKg} kg). Ketinggian terverifikasi ${editedLot.altitude} dengan kadar kemanisan ${editedLot.brix}° Brix.`,
                    timestamp: editedLot.harvestDate,
                  },
                  {
                    id: 'm2',
                    author: 'Stasiun Hulu Rantai Pasok',
                    type: 'system',
                    content: 'Barcode ketertelusuran diterbitkan dan status diverifikasi siap dibeli oleh stasiun pengolah (mill).',
                    timestamp: editedLot.harvestDate,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LEMBAR KERJA INTERAKTIF PER STAGE: LAHAN KEBUN (Farm Worksheet)        */}
      {/* ========================================================================= */}
      {editedFarm && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Breadcrumb Navigation */}
          <RecordBreadcrumb
            listLabel="Daftar Lahan & Kebun Kopi"
            recordLabel={editedFarm.farmName}
            onBack={handleCloseFarmWorksheet}
          />

          {/* Odoo Statusbar Header: Actions on Left, Status Chevrons on Right */}
          <div className="o_form_statusbar flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  handleSelectFarmForHarvest(editedFarm.id);
                  handleCloseFarmWorksheet();
                  setActiveTab('upload');
                }}
                className="btn-odoo-primary"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Input Panen dari Kebun Ini</span>
              </button>

              <button
                type="button"
                onClick={handleSaveFarmWorksheet}
                className="btn-odoo-secondary"
              >
                <Save className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simpan Perubahan Lahan</span>
              </button>

              <button
                type="button"
                onClick={handleCloseFarmWorksheet}
                className="btn-odoo-secondary text-stone-500"
              >
                <span>Tutup / Kembali</span>
              </button>
            </div>

            {/* Clickable 5-Stage Farm Management Pipeline Chevrons */}
            <div className="overflow-x-auto">
              <StatusPipeline
                stages={FARM_MANAGEMENT_STAGES}
                currentStageId={activeFarmStageId}
                selectedStageId={activeFarmStageId}
                isClickable={true}
                onSelectStage={(stageId) => setActiveFarmStageId(stageId)}
              />
            </div>
          </div>

          {/* Odoo Form Sheet Container */}
          <div className="o_form_sheet p-6 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-6">
            {/* Sheet Header Info */}
            <div className="pb-5 border-b border-stone-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                    Lembar Profil Lahan &amp; EUDR
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-stone-100 text-stone-900 border border-stone-300">
                    {editedFarm.province}
                  </span>
                  <VerificationStampBadge stamp={editedFarm.verificationStamp} status={editedFarm.verificationStatus} size="sm" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {editedFarm.farmName}
                </h2>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {editedFarm.location}, {editedFarm.province} &bull; Pengelola: <strong className="text-stone-800">{editedFarm.farmerName}</strong>
                </p>
              </div>

              {/* Right Side Smart Stat Buttons */}
              <div className="flex flex-wrap gap-2">
                <StatButton
                  icon={<TreePine className="w-4 h-4" />}
                  value={`${editedFarm.landAreaHectares} Ha`}
                  label="Luas Area"
                  color="emerald"
                />
                <StatButton
                  icon={<Sprout className="w-4 h-4" />}
                  value={`~${editedFarm.totalTreesCount.toLocaleString()}`}
                  label="Jumlah Pohon"
                  color="stone"
                />
                <StatButton
                  icon={<Mountain className="w-4 h-4" />}
                  value={editedFarm.altitudeDisplay}
                  label="Elevasi MDPL"
                  color="blue"
                />
                <StatButton
                  icon={<Thermometer className="w-4 h-4" />}
                  value={`${editedFarm.weatherData.temperatureCelsius}°C`}
                  label="Suhu Rata-rata"
                  color="amber"
                />
                <StatButton
                  icon={<ShieldCheck className="w-4 h-4" />}
                  value="EUDR 100%"
                  label="Status Geolocation"
                  color="emerald"
                />
              </div>
            </div>

            {/* EUDR Farm Verification Banner */}
            {editedFarm.verificationStatus === 'verified' && editedFarm.verificationStamp ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-950 text-sm font-black">{editedFarm.verificationStamp.title}</strong>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900">
                        {editedFarm.verificationStamp.scoreDisplay}
                      </span>
                    </div>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      {editedFarm.verificationStamp.notes}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-emerald-700/80 mt-1">
                      <span>Auditor: <strong>{editedFarm.verificationStamp.verifierName}</strong> ({editedFarm.verificationStamp.verifierOrg})</span>
                      <span>&bull;</span>
                      <span className="font-mono">Hash: {editedFarm.verificationStamp.digitalSignatureHash.substring(0, 16)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Status Verifikasi Lahan: <strong>Menunggu Audit Lapangan</strong> oleh Auditor EUDR &amp; Geolokasi BPN.</span>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">100% Deforestation-Free Check</span>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* FARM STAGE 1: IDENTITAS & ELEVASI                                         */}
            {/* ------------------------------------------------------------------------- */}
            {activeFarmStageId === 'farm_profile' && (
              <div className="space-y-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <TreePine className="w-4 h-4 text-emerald-600" /> Identitas Kebun &amp; Ketinggian Lahan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Nama Kebun / Blok</label>
                    <input
                      type="text"
                      value={editedFarm.farmName}
                      onChange={(e) => setEditedFarm({ ...editedFarm, farmName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Lokasi Detail</label>
                    <input
                      type="text"
                      value={editedFarm.location}
                      onChange={(e) => setEditedFarm({ ...editedFarm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Ketinggian Rata-rata (mdpl)</label>
                    <input
                      type="number"
                      value={editedFarm.altitudeMeters}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          altitudeMeters: Number(e.target.value),
                          altitudeDisplay: `${e.target.value} mdpl`,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Label Rentang Elevasi</label>
                    <input
                      type="text"
                      value={editedFarm.altitudeDisplay}
                      onChange={(e) => setEditedFarm({ ...editedFarm, altitudeDisplay: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Luas Lahan (Ha)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editedFarm.landAreaHectares}
                      onChange={(e) => setEditedFarm({ ...editedFarm, landAreaHectares: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Populasi Pohon Kopi</label>
                    <input
                      type="number"
                      value={editedFarm.totalTreesCount}
                      onChange={(e) => setEditedFarm({ ...editedFarm, totalTreesCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* FARM STAGE 2: CUACA & IKLIM MIKRO                                         */}
            {/* ------------------------------------------------------------------------- */}
            {activeFarmStageId === 'farm_weather' && (
              <div className="space-y-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Sun className="w-4 h-4 text-amber-600" /> Pemantauan Cuaca &amp; Iklim Mikro Pegunungan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Kondisi Cuaca Umum</label>
                    <select
                      value={editedFarm.weatherData.currentCondition}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          weatherData: {
                            ...editedFarm.weatherData,
                            currentCondition: e.target.value as FarmWeatherData['currentCondition'],
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    >
                      <option value="Berkabut Tebal">Berkabut Tebal (Mountain Mist)</option>
                      <option value="Cerah Berawan">Cerah Berawan (Optimal)</option>
                      <option value="Sejuk Berangin">Sejuk Berangin</option>
                      <option value="Hujan Ringan">Hujan Ringan</option>
                      <option value="Cerah Terik">Cerah Terik</option>
                      <option value="Hujan Lebat">Hujan Lebat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Suhu Udara Rata-rata (°C)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editedFarm.weatherData.temperatureCelsius}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          weatherData: {
                            ...editedFarm.weatherData,
                            temperatureCelsius: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Kelembaban Relatif (% RH)</label>
                    <input
                      type="number"
                      value={editedFarm.weatherData.humidityPercent}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          weatherData: {
                            ...editedFarm.weatherData,
                            humidityPercent: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Curah Hujan (mm/thn)</label>
                    <input
                      type="number"
                      value={editedFarm.weatherData.annualRainfallMm}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          weatherData: {
                            ...editedFarm.weatherData,
                            annualRainfallMm: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Penyinaran (jam/hari)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={editedFarm.weatherData.sunshineHoursPerDay}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          weatherData: {
                            ...editedFarm.weatherData,
                            sunshineHoursPerDay: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Kecepatan Angin (km/j)</label>
                    <input
                      type="number"
                      value={editedFarm.weatherData.windSpeedKph}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          weatherData: {
                            ...editedFarm.weatherData,
                            windSpeedKph: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Catatan Pengaruh Iklim Mikro terhadap Rasa</label>
                  <input
                    type="text"
                    value={editedFarm.weatherData.microclimateNote}
                    onChange={(e) =>
                      setEditedFarm({
                        ...editedFarm,
                        weatherData: {
                          ...editedFarm.weatherData,
                          microclimateNote: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* FARM STAGE 3: AGRONOMI & NAUNGAN                                          */}
            {/* ------------------------------------------------------------------------- */}
            {activeFarmStageId === 'farm_agronomy' && (
              <div className="space-y-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Sprout className="w-4 h-4 text-emerald-600" /> Agronomi, Tanah &amp; Pohon Penaung
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Jenis Tanah</label>
                    <select
                      value={editedFarm.soilType}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          soilType: e.target.value as CoffeeFarm['soilType'],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    >
                      <option value="Andosol Vulkanik">Andosol Vulkanik (Kaya Mineral Vulkanik)</option>
                      <option value="Latosol Humus">Latosol Humus (Kaya Bahan Organik)</option>
                      <option value="Regosol Pegunungan">Regosol Pegunungan</option>
                      <option value="Humus Aluvial">Humus Aluvial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Status Sertifikasi Praktik Tani</label>
                    <select
                      value={editedFarm.organicStatus}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          organicStatus: e.target.value as CoffeeFarm['organicStatus'],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    >
                      <option value="Organik Bersertifikat (SNI / USDA)">Organik Bersertifikat (SNI / USDA)</option>
                      <option value="Transisi Menuju Organik">Transisi Menuju Organik</option>
                      <option value="GAP (Good Agricultural Practices)">GAP (Good Agricultural Practices)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Varietas Utama</label>
                    <input
                      type="text"
                      value={editedFarm.primaryVarieties.join(', ')}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          primaryVarieties: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Pohon Penaung Agroforestry</label>
                    <input
                      type="text"
                      value={editedFarm.shadeTrees.join(', ')}
                      onChange={(e) =>
                        setEditedFarm({
                          ...editedFarm,
                          shadeTrees: e.target.value.split(',').map((s) => s.trim()),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* FARM STAGE 4: PETA GEOLOCATION MAPS ACTUAL                                */}
            {/* ------------------------------------------------------------------------- */}
            {activeFarmStageId === 'farm_map' && (
              <div className="space-y-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Compass className="w-4 h-4 text-emerald-600" /> Peta Koordinat Actual OpenStreetMap &amp; EUDR
                </h4>

                <FarmLocationMap
                  latitude={editedFarm.coordinates?.latitude || -7.1724}
                  longitude={editedFarm.coordinates?.longitude || 107.5681}
                  farmName={editedFarm.farmName}
                  altitude={editedFarm.altitudeDisplay}
                  locationName={editedFarm.location}
                  landAreaHectares={editedFarm.landAreaHectares}
                  totalTreesCount={editedFarm.totalTreesCount}
                  plotBoundary={editedFarm.plotBoundary}
                  patokList={editedFarm.patokList}
                  height="380px"
                  showPresets={true}
                  showPlotDetailsTable={true}
                  allowEdit={true}
                  onCoordinatesChange={(lat, lng) => {
                    setEditedFarm({
                      ...editedFarm,
                      coordinates: { latitude: lat, longitude: lng },
                    });
                  }}
                  onPatokListChange={(newPatoks) => {
                    setEditedFarm({
                      ...editedFarm,
                      patokList: newPatoks,
                    });
                  }}
                />
              </div>
            )}

            {/* ------------------------------------------------------------------------- */}
            {/* FARM STAGE 5: RIWAYAT LOT PANEN                                          */}
            {/* ------------------------------------------------------------------------- */}
            {activeFarmStageId === 'farm_lots' && (
              <div className="space-y-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Package className="w-4 h-4 text-emerald-600" /> Daftar Riwayat Hasil Panen dari Lahan Ini
                </h4>

                {(() => {
                  const farmLots = myLots.filter(
                    (l) => l.farmId === editedFarm.id || l.farmLocation.includes(editedFarm.farmName)
                  );
                  if (farmLots.length === 0) {
                    return (
                      <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                        Belum ada lot panen yang didaftarkan khusus dari kebun ini.
                      </div>
                    );
                  }
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {farmLots.map((lot) => (
                        <div
                          key={lot.id}
                          onClick={() => {
                            handleCloseFarmWorksheet();
                            handleOpenLotWorksheet(lot);
                          }}
                          className="p-3.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-bold text-stone-900 block">{lot.id}</span>
                            <span className="text-[11px] text-stone-600">{lot.variety} • {lot.harvestDate}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-800 block">{lot.brix}° Brix</span>
                            <span className="text-[11px] text-stone-500">{lot.availableWeightKg} kg tersedia</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DAFTARKAN LAHAN / KEBUN KOPI BARU                  */}
      {/* ======================================================== */}
      {isRegisterFarmModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white p-6 relative">
              <button
                onClick={() => setIsRegisterFarmModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
                <TreePine className="w-3.5 h-3.5" />
                Registrasi Lahan &amp; Ketertelusuran EUDR
              </div>
              <h3 className="text-xl sm:text-2xl font-black">Formulir Pendaftaran Lahan / Kebun Kopi</h3>
              <p className="text-xs text-stone-300 mt-1">
                Lengkapi spesifikasi elevasi ketinggian (mdpl), kondisi cuaca mikro, dan titik koordinat GPS kebun Anda.
              </p>
            </div>

            <form onSubmit={handleRegisterFarmSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* SECTION 1: PROFIL LAHAN & LOKASI */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-stone-200 pb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  1. Identitas &amp; Lokasi Kebun
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Nama Kebun / Blok Lahan *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFarmName}
                      onChange={(e) => setNewFarmName(e.target.value)}
                      placeholder="Contoh: Kebun Blok Pasir Kunci (Gunung Tilu)"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Lokasi Desa &amp; Kecamatan *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFarmLocation}
                      onChange={(e) => setNewFarmLocation(e.target.value)}
                      placeholder="Contoh: Desa Margamukti, Kec. Pangalengan, Bandung"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Provinsi *
                    </label>
                    <select
                      value={newFarmProvince}
                      onChange={(e) => setNewFarmProvince(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Aceh">Aceh</option>
                      <option value="Sumatera Utara">Sumatera Utara</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                      <option value="Bali">Bali</option>
                      <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                      <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                      <option value="Papua">Papua</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Ketinggian Rata-rata (mdpl) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newFarmAltitudeMeters}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setNewFarmAltitudeMeters(m);
                        setNewFarmAltitudeDisplay(`${m} mdpl`);
                      }}
                      placeholder="Contoh: 1550"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Label Rentang Elevasi *
                    </label>
                    <input
                      type="text"
                      required
                      value={newFarmAltitudeDisplay}
                      onChange={(e) => setNewFarmAltitudeDisplay(e.target.value)}
                      placeholder="Contoh: 1.500 - 1.620 mdpl"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Luas Lahan (Hektar) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newFarmAreaHa}
                      onChange={(e) => setNewFarmAreaHa(Number(e.target.value))}
                      placeholder="Contoh: 2.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Estimasi Jumlah Pohon Kopi *
                    </label>
                    <input
                      type="number"
                      required
                      value={newFarmTreesCount}
                      onChange={(e) => setNewFarmTreesCount(Number(e.target.value))}
                      placeholder="Contoh: 3200"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: IKLIM MIKRO & KONDISI CUACA */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-stone-200 pb-2 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  2. Kondisi Cuaca &amp; Iklim Mikro Pegunungan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Kondisi Cuaca Umum *
                    </label>
                    <select
                      value={newFarmWeatherCondition}
                      onChange={(e) =>
                        setNewFarmWeatherCondition(e.target.value as FarmWeatherData['currentCondition'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Berkabut Tebal">Berkabut Tebal (Mountain Mist)</option>
                      <option value="Cerah Berawan">Cerah Berawan (Optimal)</option>
                      <option value="Sejuk Berangin">Sejuk Berangin</option>
                      <option value="Hujan Ringan">Hujan Ringan</option>
                      <option value="Cerah Terik">Cerah Terik</option>
                      <option value="Hujan Lebat">Hujan Lebat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Suhu Rata-rata (°C) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newFarmTemp}
                      onChange={(e) => setNewFarmTemp(Number(e.target.value))}
                      placeholder="Contoh: 19.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Kelembaban Relatif (% RH) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newFarmHumidity}
                      onChange={(e) => setNewFarmHumidity(Number(e.target.value))}
                      placeholder="Contoh: 78"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PETA INTERAKTIF OPENSTREETMAP & TITIK GPS */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 border-b border-stone-200 pb-2 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  3. Peta Geolocation Maps &amp; Titik Koordinat GPS
                </h4>

                <FarmLocationMap
                  key="register-farm-modal-map"
                  latitude={newFarmLatitude}
                  longitude={newFarmLongitude}
                  farmName={newFarmName || 'Kebun Baru'}
                  altitude={newFarmAltitudeDisplay}
                  locationName={newFarmLocation}
                  landAreaHectares={newFarmAreaHa}
                  totalTreesCount={newFarmTreesCount}
                  height="300px"
                  showPresets={true}
                  showPlotDetailsTable={false}
                  allowEdit={true}
                  onCoordinatesChange={(lat, lng) => {
                    setNewFarmLatitude(lat);
                    setNewFarmLongitude(lng);
                  }}
                  onPatokListChange={(patoks) => setNewFarmPatoks(patoks)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Koordinat GPS Latitude *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={newFarmLatitude}
                      onChange={(e) => setNewFarmLatitude(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Koordinat GPS Longitude *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={newFarmLongitude}
                      onChange={(e) => setNewFarmLongitude(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterFarmModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Simpan &amp; Daftarkan Lahan Kebun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Barcode Karung */}
      <FarmerBarcodeModal
        isOpen={!!selectedBarcodeLot}
        onClose={() => setSelectedBarcodeLot(null)}
        lot={selectedBarcodeLot}
        isNewUpload={isNewUpload}
      />
    </div>
  );
};
