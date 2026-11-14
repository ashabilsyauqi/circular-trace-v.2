import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  WarehouseLot,
  WarehouseGradeTier,
  WarehouseSortingData,
} from '../../../types/coffee';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Award,
  Crown,
  Droplets,
  Thermometer,
  Layers,
  ArrowRight,
  Printer,
  ChevronLeft,
  Warehouse,
  Sparkles,
  ShieldCheck,
  Info,
  DollarSign,
  TrendingUp,
  Tag,
  Building2,
  Rocket,
  Clock,
  Check,
} from 'lucide-react';
import { GRADE_TIERS_CONFIG } from '../../../components/WarehouseView';

export const WarehouseSortingSheetPage: React.FC = () => {
  const { lotId } = useParams<{ lotId?: string }>();
  const navigate = useNavigate();
  const {
    warehouseLots,
    currentUser,
    completeWarehouseSorting,
  } = useCoffee();

  // Find lot from URL param or default to first pending sorting lot
  const activeLot =
    (lotId && warehouseLots.find((l) => l.id === lotId)) ||
    warehouseLots.find((l) => l.sortingStatus === 'pending_sorting') ||
    warehouseLots[0] ||
    null;

  // Selected lot ID if user changes target lot via dropdown
  const [selectedLotId, setSelectedLotId] = useState<string>(activeLot?.id || '');

  useEffect(() => {
    if (activeLot) {
      setSelectedLotId(activeLot.id);
    }
  }, [activeLot?.id]);

  const currentLot = warehouseLots.find((l) => l.id === selectedLotId) || activeLot;

  // --- FAKTOR I: UJI FISIK KADAR AIR, WATER ACTIVITY & DENSITAS ---
  const [moisture, setMoisture] = useState<number>(currentLot?.moistureContentPercent || 11.2);
  const [waterActivity, setWaterActivity] = useState<number>(currentLot?.waterActivityAw || 0.55);
  const [density, setDensity] = useState<number>(715); // grams per liter

  // --- FAKTOR II: ANALISIS AYAKAN UKURAN BIJI (SCREEN SIZE) ---
  const [screen18, setScreen18] = useState<number>(65); // %
  const [screen1617, setScreen1617] = useState<number>(25); // %
  const [screen1415, setScreen1415] = useState<number>(8); // %
  const [underScreen14, setUnderScreen14] = useState<number>(2); // %

  // --- FAKTOR III: PENGHITUNGAN CACAT FISIK PER 350g (SCA & SNI) ---
  // Cacat Primer (Bobot 1.0 poin per cacat)
  const [blackBean, setBlackBean] = useState<number>(0);
  const [sourBean, setSourBean] = useState<number>(0);
  const [dryCherry, setDryCherry] = useState<number>(0);
  const [fungus, setFungus] = useState<number>(0);
  const [foreignMatter, setForeignMatter] = useState<number>(0);
  const [severeInsect, setSevereInsect] = useState<number>(0);

  // Cacat Sekunder (Bobot 0.2 - 0.5 poin)
  const [brokenBean, setBrokenBean] = useState<number>(currentLot ? Math.min(currentLot?.defectCount || 4, 6) : 2);
  const [immatureBean, setImmatureBean] = useState<number>(1);
  const [slightInsect, setSlightInsect] = useState<number>(1);
  const [parchmentHusks, setParchmentHusks] = useState<number>(0);

  // Total Poin Cacat
  const primaryTotal = blackBean + sourBean + dryCherry + fungus + foreignMatter + severeInsect;
  const secondaryTotal = Math.round(brokenBean * 0.5 + immatureBean * 0.5 + slightInsect * 0.2 + parchmentHusks * 0.5);
  const totalDefectPoints = primaryTotal + secondaryTotal;

  // --- FAKTOR IV: PENETAPAN GRADE TIER & HARGA JUAL ---
  // Auto recommend grade based on defect & moisture
  const getRecommendedGrade = (): WarehouseGradeTier => {
    if (primaryTotal === 0 && totalDefectPoints <= 5 && moisture >= 10.0 && moisture <= 12.5) {
      return 'Grade 1 - Super Premium';
    }
    if (totalDefectPoints <= 12) {
      return 'Grade 2 - Premium Grade';
    }
    if (totalDefectPoints <= 25) {
      return 'Grade 3 - Medium Commercial';
    }
    return 'Grade 4 - Basic Commercial';
  };

  const [selectedGrade, setSelectedGrade] = useState<WarehouseGradeTier>(
    currentLot?.gradeTier || getRecommendedGrade()
  );

  // Price Calculation State
  const basePurchasePrice = currentLot?.purchasePricePerKg || 115000;
  const gradeConfig = GRADE_TIERS_CONFIG[selectedGrade];
  const [markupPercent, setMarkupPercent] = useState<number>(gradeConfig.markupPercent);
  const calculatedSellingPrice = Math.round(basePurchasePrice * (1 + markupPercent / 100) / 1000) * 1000;
  const [finalSellingPrice, setFinalSellingPrice] = useState<number>(
    currentLot?.pricePerKg || calculatedSellingPrice
  );

  // Storage Location Assignment
  const [targetSilo, setTargetSilo] = useState<string>(
    currentLot?.storageLocation && !currentLot.storageLocation.includes('Sementara')
      ? currentLot.storageLocation
      : 'Gudang A-03 (Pallet Kayu Pine #12)'
  );

  // Health Certificate Checkbox & Number
  const [issueHealthCert, setIssueHealthCert] = useState<boolean>(currentLot?.hasHealthCertificate || false);
  const [healthCertNumber, setHealthCertNumber] = useState<string>(
    currentLot?.healthCertificateNumber || `HC-EXP-2026-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Sorter / QA Inspector Notes
  const [sorterNotes, setSorterNotes] = useState<string>(
    currentLot?.gradingNotes || 'Biji kopi telah disortir manual dan melalui pengujian kadar air serta analisis ayakan.'
  );

  // FINAL DECISION (HANYA 2 OPSI)
  // 'release_marketplace' = Rilis Langsung ke Marketplace
  // 'keep_in_inventory' = Simpan Sementara di Inventory (Deploy Ready)
  const [finalDecision, setFinalDecision] = useState<'release_marketplace' | 'keep_in_inventory'>('keep_in_inventory');

  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  // Update form defaults when switching lot
  useEffect(() => {
    if (currentLot) {
      setMoisture(currentLot.moistureContentPercent || 11.2);
      setWaterActivity(currentLot.waterActivityAw || 0.55);
      setSelectedGrade(currentLot.gradeTier || getRecommendedGrade());
      setFinalSellingPrice(currentLot.pricePerKg);
      setIssueHealthCert(currentLot.hasHealthCertificate || false);
      if (currentLot.healthCertificateNumber) {
        setHealthCertNumber(currentLot.healthCertificateNumber);
      }
    }
  }, [currentLot?.id]);

  const handleSaveSorting = () => {
    if (!currentLot) return;

    const sortingData: WarehouseSortingData = {
      moistureContentPercent: moisture,
      waterActivityAw: waterActivity,
      bulkDensityGramsPerLiter: density,
      screenSizeDistribution: {
        screen18PlusPercent: screen18,
        screen1617Percent: screen1617,
        screen1415Percent: screen1415,
        underScreen14Percent: underScreen14,
      },
      primaryDefects: {
        blackBean,
        sourBean,
        dryCherry,
        fungus,
        foreignMatter,
        severeInsect,
      },
      secondaryDefects: {
        brokenBean,
        immatureBean,
        slightInsect,
        parchmentHusks,
      },
      totalDefectPoints,
      assignedGradeTier: selectedGrade,
      sorterName: currentUser?.name || 'Hendra Wijaya (Warehouse QA)',
      sortedAt: new Date().toISOString().split('T')[0],
      notes: sorterNotes,
      healthCertificateIssued: issueHealthCert,
      healthCertificateNumber: issueHealthCert ? healthCertNumber : undefined,
      finalDecision,
    };

    const isReleaseNow = finalDecision === 'release_marketplace';

    completeWarehouseSorting(currentLot.id, sortingData, {
      releaseNow: isReleaseNow,
      gradeTier: selectedGrade,
      pricePerKg: finalSellingPrice,
      storageLocation: targetSilo,
      notes: sorterNotes,
    });

    setSubmittedNotice(
      isReleaseNow
        ? `✅ Berhasil! Lot ${currentLot.id} telah disortir dan LANGSUNG DIRILIS ke Marketplace.`
        : `✅ Berhasil! Lot ${currentLot.id} telah disortir dan DISIMPAN di Inventory dengan status "Siap Dikirim ke Marketplace (Deploy Ready)".`
    );

    setTimeout(() => {
      navigate('/admin/gudang/inventory');
    }, 1500);
  };

  if (!currentLot) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-stone-200">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <h3 className="font-bold text-stone-800">Tidak ada lot gudang yang tersedia</h3>
        <p className="text-xs text-stone-500 mt-1">Silakan lakukan pengadaan green bean terlebih dahulu.</p>
        <Link
          to="/admin/gudang/pengadaan"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-amber-600 text-white font-bold text-xs"
        >
          <span>Ke Halaman Pengadaan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-none print:m-0">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Link to="/admin/overview" className="hover:text-amber-600">Pusat Kendali</Link>
            <span>/</span>
            <Link to="/admin/gudang/inventory" className="hover:text-amber-600">Layanan Gudang</Link>
            <span>/</span>
            <span className="font-bold text-stone-800">Lembar Kerja Penyortiran</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <ClipboardCheck className="w-7 h-7 text-amber-600" />
            <span>Lembar Kerja Penyortiran &amp; Penetapan Mutu Green Bean</span>
          </h1>
          <p className="text-xs text-stone-500">
            Standar Pengujian Fisik Laboratorium: <strong>SNI 01-2907-2008</strong> &amp; <strong>SCA Specialty Green Coffee Protocol</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/gudang/inventory"
            className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Stok</span>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-md bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Lembar Kerja A4</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {submittedNotice && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submittedNotice}</span>
        </div>
      )}

      {/* Target Lot Selector Dropdown (Print Hidden) */}
      <div className="bg-white rounded-lg p-3.5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-700">Pilih Lot Target Penyortiran:</span>
          <select
            value={selectedLotId}
            onChange={(e) => {
              setSelectedLotId(e.target.value);
              navigate(`/admin/gudang/sortir/${e.target.value}`);
            }}
            className="text-xs font-bold py-1.5 px-3 rounded-md border border-stone-300 bg-stone-50 focus:outline-none focus:border-amber-500"
          >
            {warehouseLots.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} - {l.variety} ({l.availableWeightKg} kg) [
                {l.sortingStatus === 'pending_sorting' ? 'MENUNGGU SORTIR' : 'SUDAH DISORTIR'}
                ]
              </option>
            ))}
          </select>
        </div>

        {currentLot.sortingStatus === 'pending_sorting' ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Status: Gudang Sementara (Menunggu Sortir)</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Status: Telah Selesai Disortir</span>
          </span>
        )}
      </div>

      {/* 2. Official Document Header Card (Printable) */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-300 overflow-hidden">
        {/* Document Meta Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-black text-base shrink-0">
              <Warehouse className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Dokumen Resmi QA &amp; Gudang Kopi Nusantara
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                LEMBAR KERJA INSPEKSI &amp; SORTASI BIJI HIJAU (GREEN BEAN)
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right text-[11px] text-stone-300">
            <div>Kode Dokumen: <strong className="text-white font-mono">FRM-SORTIR-GB-2026/REV-01</strong></div>
            <div>Tanggal Uji: <strong className="text-white">{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong></div>
            <div>Auditor QA: <strong className="text-amber-300">{currentUser?.name || 'Hendra Wijaya'}</strong></div>
          </div>
        </div>

        {/* Target Lot Identity Grid */}
        <div className="p-5 bg-amber-50/50 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">ID Lot Gudang:</span>
            <span className="font-mono font-bold text-stone-900 text-sm">{currentLot.id}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Komoditas &amp; Varietas:</span>
            <span className="font-bold text-stone-900">{currentLot.variety}</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Asal Pengolah &amp; Terroir:</span>
            <span className="font-bold text-stone-900">{currentLot.sourceProcessorName}</span>
            <span className="text-[11px] text-stone-500 block">{currentLot.origin} ({currentLot.altitude})</span>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Bobot Fisik Inbound:</span>
            <span className="font-black text-amber-800 text-sm">{currentLot.availableWeightKg.toLocaleString()} kg</span>
            <span className="text-[10px] text-stone-500 block">Modal: Rp {currentLot.purchasePricePerKg.toLocaleString()}/kg</span>
          </div>
        </div>

        {/* Body Worksheet: 4 Faktor Multi-Faktor */}
        <div className="p-6 space-y-8">
          {/* FAKTOR I: UJI FISIK KADAR AIR, WATER ACTIVITY & DENSITAS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  I
                </span>
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">
                  Faktor I: Uji Fisik Kadar Air, Water Activity (Aw) &amp; Densitas Biji
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">Standar SNI &amp; ISO 6673</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Parameter 1: Kadar Air */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>Kadar Air (%)</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    moisture >= 10.0 && moisture <= 12.0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {moisture >= 10.0 && moisture <= 12.0 ? 'Optimal (10-12%)' : 'Di Luar Standar'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="8.0"
                    max="16.0"
                    value={moisture}
                    onChange={(e) => setMoisture(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold py-1.5 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-600">%</span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Uji moisture meter optik. Standar aman penyimpanan gudang hermetik adalah 10.0% - 12.0%.
                </p>
              </div>

              {/* Parameter 2: Water Activity (Aw) */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span>Water Activity (aW)</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    waterActivity <= 0.60
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {waterActivity <= 0.60 ? 'Aman (≤ 0.60 Aw)' : 'Bahaya Jamur'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.40"
                    max="0.80"
                    value={waterActivity}
                    onChange={(e) => setWaterActivity(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold py-1.5 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-600">Aw</span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Ambang batas aktivitas air bebas &le; 0.60 Aw untuk mencegah pembentukan mikotoksin jamur.
                </p>
              </div>

              {/* Parameter 3: Bulk Density */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-600" />
                    <span>Densitas Biji Curah</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    High Density (SHB)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="5"
                    min="500"
                    max="900"
                    value={density}
                    onChange={(e) => setDensity(parseInt(e.target.value) || 0)}
                    className="w-full text-base font-bold py-1.5 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs font-bold text-stone-600">g/L</span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Bobot per liter (g/L). Densitas &gt; 700 g/L menunjukkan biji berketinggian tinggi bertekstur padat.
                </p>
              </div>
            </div>
          </div>

          {/* FAKTOR II: ANALISIS AYAKAN UKURAN BIJI (SCREEN SIZE) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  II
                </span>
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">
                  Faktor II: Analisis Ayakan Ukuran Biji (Screen Size Analysis)
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">Standard Sieve Shaker (350g Sampel)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block text-[11px]">Screen 18+ (Super Screen)</span>
                <span className="text-[10px] text-stone-500 block mb-1">Lubang ayakan &ge; 7.14 mm</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={screen18}
                    onChange={(e) => setScreen18(parseInt(e.target.value) || 0)}
                    className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                  />
                  <span className="text-[11px] font-bold text-stone-600">%</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block text-[11px]">Screen 16-17 (Medium Large)</span>
                <span className="text-[10px] text-stone-500 block mb-1">Lubang ayakan 6.35 - 6.75 mm</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={screen1617}
                    onChange={(e) => setScreen1617(parseInt(e.target.value) || 0)}
                    className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                  />
                  <span className="text-[11px] font-bold text-stone-600">%</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block text-[11px]">Screen 14-15 (Small / Peaberry)</span>
                <span className="text-[10px] text-stone-500 block mb-1">Lubang ayakan 5.55 - 5.95 mm</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={screen1415}
                    onChange={(e) => setScreen1415(parseInt(e.target.value) || 0)}
                    className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                  />
                  <span className="text-[11px] font-bold text-stone-600">%</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-800 block text-[11px]">Di Bawah Screen 14 (Lolos)</span>
                <span className="text-[10px] text-stone-500 block mb-1">Lubang ayakan &lt; 5.55 mm</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={underScreen14}
                    onChange={(e) => setUnderScreen14(parseInt(e.target.value) || 0)}
                    className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                  />
                  <span className="text-[11px] font-bold text-stone-600">%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-600 bg-stone-100 p-2.5 rounded">
              <span>Total Persentase Ayakan: <strong>{screen18 + screen1617 + screen1415 + underScreen14}%</strong></span>
              <span>Keseragaman Biji Utama (Screen 16-18+): <strong>{screen18 + screen1617}%</strong> (Standar Specialty: &ge; 85%)</span>
            </div>
          </div>

          {/* FAKTOR III: PENGHITUNGAN CACAT FISIK PER 350g SAMPEL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  III
                </span>
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">
                  Faktor III: Penghitungan Cacat Fisik (Defect Count per 350g Sampel)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Total Nilai Cacat: {totalDefectPoints} Poin
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kategori 1: Cacat Primer (Bobot 1.0 penuh) */}
              <div className="p-4 rounded-lg bg-red-50/60 border border-red-200 space-y-3">
                <div className="flex items-center justify-between border-b border-red-200 pb-2">
                  <span className="font-bold text-xs text-red-950 uppercase tracking-wide">
                    A. Cacat Primer (1.0 Poin / Butir)
                  </span>
                  <span className="text-[10px] font-bold text-red-700">Subtotal: {primaryTotal} Poin</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-600 block">Biji Hitam (Full Black):</label>
                    <input
                      type="number"
                      min="0"
                      value={blackBean}
                      onChange={(e) => setBlackBean(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Biji Asam (Full Sour):</label>
                    <input
                      type="number"
                      min="0"
                      value={sourBean}
                      onChange={(e) => setSourBean(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Gelondong Kering (Pod):</label>
                    <input
                      type="number"
                      min="0"
                      value={dryCherry}
                      onChange={(e) => setDryCherry(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Biji Berjamur (Fungus):</label>
                    <input
                      type="number"
                      min="0"
                      value={fungus}
                      onChange={(e) => setFungus(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Benda Asing (Batu/Besi):</label>
                    <input
                      type="number"
                      min="0"
                      value={foreignMatter}
                      onChange={(e) => setForeignMatter(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Lubang PBKo Parah (&ge;3):</label>
                    <input
                      type="number"
                      min="0"
                      value={severeInsect}
                      onChange={(e) => setSevereInsect(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Kategori 2: Cacat Sekunder (Bobot 0.2 - 0.5) */}
              <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-bold text-xs text-stone-800 uppercase tracking-wide">
                    B. Cacat Sekunder (0.2 - 0.5 Poin)
                  </span>
                  <span className="text-[10px] font-bold text-stone-700">Subtotal: {secondaryTotal} Poin</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-stone-600 block">Biji Pecah (Broken):</label>
                    <input
                      type="number"
                      min="0"
                      value={brokenBean}
                      onChange={(e) => setBrokenBean(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Biji Muda / Keriput:</label>
                    <input
                      type="number"
                      min="0"
                      value={immatureBean}
                      onChange={(e) => setImmatureBean(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Lubang Serangga Ringan (1-2):</label>
                    <input
                      type="number"
                      min="0"
                      value={slightInsect}
                      onChange={(e) => setSlightInsect(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-stone-600 block">Biji Berkulit Tanduk (Husk):</label>
                    <input
                      type="number"
                      min="0"
                      value={parchmentHusks}
                      onChange={(e) => setParchmentHusks(parseInt(e.target.value) || 0)}
                      className="w-full font-bold py-1 px-2 rounded border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAKTOR IV: PENETAPAN GRADE TIER, HARGA JUAL & HEALTH CERTIFICATE */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  IV
                </span>
                <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wide">
                  Faktor IV: Penetapan Grade Tier Mutu, Mark-Up Harga &amp; Sertifikasi
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">Penetapan Nilai Komersial Gudang</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Grade Tier Selector */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  Penetapan Grade Tier Mutu:
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    const grade = e.target.value as WarehouseGradeTier;
                    setSelectedGrade(grade);
                    setMarkupPercent(GRADE_TIERS_CONFIG[grade].markupPercent);
                  }}
                  className="w-full text-xs font-bold py-2 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Grade 1 - Super Premium">Grade 1: Super Premium (0-5 Defect)</option>
                  <option value="Grade 2 - Premium Grade">Grade 2: Premium Grade (6-12 Defect)</option>
                  <option value="Grade 3 - Medium Commercial">Grade 3: Medium Commercial (13-25 Defect)</option>
                  <option value="Grade 4 - Basic Commercial">Grade 4: Basic Commercial (&gt;26 Defect)</option>
                </select>
                <p className="text-[10px] text-stone-500 leading-tight">
                  Rekomendasi sistem berdasarkan {totalDefectPoints} defect: <strong className="text-amber-800">{getRecommendedGrade()}</strong>.
                </p>
              </div>

              {/* 2. Mark-up Margin & Harga Jual */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">Harga Jual per kg:</label>
                  <span className="text-[10px] text-stone-500">Modal: Rp {basePurchasePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    value={finalSellingPrice}
                    onChange={(e) => setFinalSellingPrice(parseInt(e.target.value) || 0)}
                    className="w-full text-base font-black text-emerald-800 py-1.5 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-stone-500">/kg</span>
                </div>
                <div className="text-[10px] text-stone-500 flex justify-between">
                  <span>Margin Mark-up: <strong>+{markupPercent}%</strong></span>
                  <span>Estimasi Laba Kotor: <strong>Rp {(finalSellingPrice - basePurchasePrice).toLocaleString()}/kg</strong></span>
                </div>
              </div>

              {/* 3. Lokasi Penyimpanan Silo Baru */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  Lokasi Silo Penyimpanan Hermetik:
                </label>
                <input
                  type="text"
                  value={targetSilo}
                  onChange={(e) => setTargetSilo(e.target.value)}
                  placeholder="e.g. Gudang A-03 (Pallet Kayu Pine #12)"
                  className="w-full text-xs font-bold py-2 px-3 rounded border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-stone-500">
                  Dipindahkan dari Silo Transit Sementara ke pallet kemasan hermetik GrainPro.
                </p>
              </div>
            </div>

            {/* Health Certificate Option */}
            <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-900 select-none">
                <input
                  type="checkbox"
                  checked={issueHealthCert}
                  onChange={(e) => setIssueHealthCert(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                />
                <span>Terbitkan Sertifikat Kesehatan Karantina Ekspor (Health Certificate)</span>
              </label>

              {issueHealthCert && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-600 font-medium">Nomor HC:</span>
                  <input
                    type="text"
                    value={healthCertNumber}
                    onChange={(e) => setHealthCertNumber(e.target.value)}
                    className="font-mono text-xs font-bold py-1 px-2 rounded border border-emerald-300 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Sorter Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                Catatan Temuan Sortasi Fisik &amp; Karakteristik Biji:
              </label>
              <textarea
                rows={2}
                value={sorterNotes}
                onChange={(e) => setSorterNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-md border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
                placeholder="Catatan kebersihan biji, aroma hijau segar, densitas biji..."
              />
            </div>
          </div>

          {/* SECTION 3: KEPUTUSAN AKHIR (HANYA 2 OPSI TEGAS) */}
          <div className="border-t-2 border-stone-300 pt-6 space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                Tahap Akhir Evaluasi Mutu Gudang
              </span>
              <h3 className="text-base font-black text-stone-900">
                Pilih Keputusan Distribusi &amp; Penempatan Stok (Hanya 2 Opsi)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Pilih apakah biji kopi yang telah disortir langsung dirilis ke etalase publik atau disimpan sementara di inventory dengan status siap rilis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opsi 1: Langsung Rilis ke Marketplace */}
              <div
                onClick={() => setFinalDecision('release_marketplace')}
                className={`cursor-pointer rounded-xl p-5 border-2 transition-all flex flex-col justify-between ${
                  finalDecision === 'release_marketplace'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400'
                    : 'border-stone-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white">
                      <Rocket className="w-3.5 h-3.5" />
                      <span>OPSI A: LANGSUNG RILIS KE MARKETPLACE</span>
                    </span>
                    {finalDecision === 'release_marketplace' && (
                      <Check className="w-5 h-5 text-emerald-700" />
                    )}
                  </div>
                  <h4 className="font-black text-stone-900 text-sm mt-2">
                    Live Tayang di Marketplace Publik
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Stok kopi langsung aktif dipajang di katalog e-commerce ekosistem dan dapat langsung dibeli oleh Roaster atau Cafe dengan harga <strong>Rp {finalSellingPrice.toLocaleString()}/kg</strong>.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Status: Aktif di Marketplace (Langsung B2B)</span>
                </div>
              </div>

              {/* Opsi 2: Simpan Sementara di Inventory (Deploy Ready) */}
              <div
                onClick={() => setFinalDecision('keep_in_inventory')}
                className={`cursor-pointer rounded-xl p-5 border-2 transition-all flex flex-col justify-between ${
                  finalDecision === 'keep_in_inventory'
                    ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-400'
                    : 'border-stone-200 bg-white hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white">
                      <Clock className="w-3.5 h-3.5" />
                      <span>OPSI B: SIMPAN SEMENTARA DI INVENTORY</span>
                    </span>
                    {finalDecision === 'keep_in_inventory' && (
                      <Check className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                  <h4 className="font-black text-stone-900 text-sm mt-2">
                    Simpan di Gudang (Label: Siap Dikirim ke Marketplace)
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Stok kopi telah lulus sortir tetapi <strong>belum dirilis</strong> ke marketplace. Tersimpan rapi di inventory gudang hermetik berlabel <em>Deploy Ready</em>, dan dapat dideploy kapan saja dengan satu klik tombol rilis.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] text-blue-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Status: Deploy Ready (Tersedia Tombol Rilis di Inventory)</span>
                </div>
              </div>
            </div>

            {/* Final Action Button Bar (Print Hidden) */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <div className="text-xs text-stone-500">
                Keputusan terpilih: <strong className="text-stone-900 font-bold uppercase">{finalDecision === 'release_marketplace' ? 'Rilis Langsung ke Marketplace' : 'Simpan di Inventory (Deploy Ready)'}</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/admin/gudang/inventory"
                  className="px-4 py-2.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs text-center flex-1 sm:flex-initial"
                >
                  Batal
                </Link>

                <button
                  type="button"
                  onClick={handleSaveSorting}
                  className="px-6 py-2.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Simpan Hasil Sortir &amp; Terapkan Keputusan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseSortingSheetPage;
