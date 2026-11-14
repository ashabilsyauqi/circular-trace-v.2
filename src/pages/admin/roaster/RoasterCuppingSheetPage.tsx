import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { RoastedBeanLot, CuppingEvaluationData } from '../../../types/coffee';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Sliders,
  Flame,
  Coffee,
  Calendar,
  Layers,
  Thermometer,
  ShieldCheck,
  Tag,
  Package,
  QrCode,
  Store,
  Warehouse,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  Rocket,
  Save,
} from 'lucide-react';
import { RoasterBarcodeModal } from '../../../components/roaster/RoasterBarcodeModal';
import { TraceabilityModal } from '../../../components/TraceabilityModal';

// Pre-defined tasting notes categories
const TASTING_NOTES_PRESETS = [
  { category: 'Floral', notes: ['Jasmine', 'Orange Blossom', 'Chamomile', 'Rose'] },
  { category: 'Fruity', notes: ['Peach', 'Wild Berry', 'Citrus', 'Blackcurrant', 'Red Apple', 'Bergamot', 'Mango'] },
  { category: 'Sweet', notes: ['Cane Sugar', 'Honey', 'Caramel', 'Maple Syrup', 'Brown Sugar'] },
  { category: 'Chocolate & Nutty', notes: ['Dark Chocolate', 'Cacao Nibs', 'Almond', 'Roasted Hazelnut'] },
  { category: 'Spicy & Herbal', notes: ['Cinnamon', 'Lemongrass', 'Clove', 'Cardamom'] },
];

export const RoasterCuppingSheetPage: React.FC = () => {
  const { lotId } = useParams<{ lotId?: string }>();
  const navigate = useNavigate();
  const {
    roastedLots,
    currentUser,
    completeRoastCupping,
  } = useCoffee();

  // Find lot from URL or default to first cupping_pending lot, or first available lot
  const [selectedLotId, setSelectedLotId] = useState<string>(
    lotId ||
      roastedLots.find((l) => l.roastStatus === 'cupping_pending')?.id ||
      roastedLots[0]?.id ||
      ''
  );

  useEffect(() => {
    if (lotId) {
      setSelectedLotId(lotId);
    }
  }, [lotId]);

  const currentLot = useMemo(() => {
    return roastedLots.find((l) => l.id === selectedLotId) || roastedLots[0] || null;
  }, [roastedLots, selectedLotId]);

  // Cupper details
  const [cupperName, setCupperName] = useState('Hendra Kurniawan (Licensed Q-Grader #8291)');
  const [cuppingDate, setCuppingDate] = useState(new Date().toISOString().split('T')[0]);
  const [waterTds, setWaterTds] = useState(135);
  const [waterTemp, setWaterTemp] = useState(93.5);

  // 10 SCA Cupping Attributes (Scale 6.00 - 10.00, steps of 0.25)
  const [fragranceAroma, setFragranceAroma] = useState<number>(8.5);
  const [flavor, setFlavor] = useState<number>(8.5);
  const [aftertaste, setAftertaste] = useState<number>(8.25);
  const [acidity, setAcidity] = useState<number>(8.5);
  const [body, setBody] = useState<number>(8.25);
  const [balance, setBalance] = useState<number>(8.5);
  const [overall, setOverall] = useState<number>(8.5);

  // 5-cup checklists for Uniformity, Clean Cup, Sweetness (each checked cup = 2.0 pts)
  const [uniformityCups, setUniformityCups] = useState<boolean[]>([true, true, true, true, true]);
  const [cleanCups, setCleanCups] = useState<boolean[]>([true, true, true, true, true]);
  const [sweetnessCups, setSweetnessCups] = useState<boolean[]>([true, true, true, true, true]);

  // Defects: Taints (-2 per cup), Faults (-4 per cup)
  const [taintCount, setTaintCount] = useState<number>(0);
  const [faultCount, setFaultCount] = useState<number>(0);

  // Flavor Profile / Notes
  const [selectedNotes, setSelectedNotes] = useState<string[]>([
    'Jasmine',
    'Wild Berry',
    'Peach',
    'Cane Sugar',
  ]);
  const [customNoteInput, setCustomNoteInput] = useState('');

  // Physical & Commercial Settings
  const [packageWeightGrams, setPackageWeightGrams] = useState<number>(250);
  const [totalPacks, setTotalPacks] = useState<number>(60);
  const [pricePerPack, setPricePerPack] = useState<number>(95000);
  const [recommendationRestDays, setRecommendationRestDays] = useState<number>(10);
  const [recommendedBrew, setRecommendedBrew] = useState<string[]>([
    'V60 Pour Over',
    'Kalita Wave',
    'Aeropress',
  ]);
  const [evaluatorNotes, setEvaluatorNotes] = useState(
    'Aroma melati semerbak saat blooming. Asam malik buah persik bersih dengan akhir manis tebu panjang.'
  );

  // Modals
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Load existing cupping data if available on selected lot
  useEffect(() => {
    if (currentLot) {
      if (currentLot.cuppingData) {
        const cd = currentLot.cuppingData;
        setFragranceAroma(cd.fragranceAroma || 8.5);
        setFlavor(cd.flavor || 8.5);
        setAftertaste(cd.aftertaste || 8.25);
        setAcidity(cd.acidity || 8.5);
        setBody(cd.body || 8.25);
        setBalance(cd.balance || 8.5);
        setOverall(cd.overall || 8.5);
        setCupperName(cd.evaluatorName || cupperName);
        if (cd.tastingNotes && cd.tastingNotes.length > 0) {
          setSelectedNotes(cd.tastingNotes);
        }
        if (cd.evaluatorNotes) {
          setEvaluatorNotes(cd.evaluatorNotes);
        }
      } else {
        // Fallback from lot properties
        if (currentLot.tastingNotes && currentLot.tastingNotes.length > 0) {
          setSelectedNotes(currentLot.tastingNotes);
        }
        if (currentLot.pricePerPack) setPricePerPack(currentLot.pricePerPack);
        if (currentLot.packageWeightGrams) setPackageWeightGrams(currentLot.packageWeightGrams);
        if (currentLot.totalPacks) setTotalPacks(currentLot.totalPacks);
      }
    }
  }, [currentLot]);

  // Point calculations
  const uniformityScore = useMemo(() => {
    return uniformityCups.filter(Boolean).length * 2.0;
  }, [uniformityCups]);

  const cleanCupScore = useMemo(() => {
    return cleanCups.filter(Boolean).length * 2.0;
  }, [cleanCups]);

  const sweetnessScore = useMemo(() => {
    return sweetnessCups.filter(Boolean).length * 2.0;
  }, [sweetnessCups]);

  const defectDeduction = useMemo(() => {
    return taintCount * 2 + faultCount * 4;
  }, [taintCount, faultCount]);

  const totalScore = useMemo(() => {
    const raw =
      fragranceAroma +
      flavor +
      aftertaste +
      acidity +
      body +
      balance +
      uniformityScore +
      cleanCupScore +
      sweetnessScore +
      overall -
      defectDeduction;
    return Number(Math.max(0, Math.min(100, raw)).toFixed(2));
  }, [
    fragranceAroma,
    flavor,
    aftertaste,
    acidity,
    body,
    balance,
    uniformityScore,
    cleanCupScore,
    sweetnessScore,
    overall,
    defectDeduction,
  ]);

  // Specialty Coffee Tier
  const specialtyGrade = useMemo(() => {
    if (totalScore >= 90.0) return { title: 'Specialty - Outstanding (Presidents Cup)', color: 'bg-amber-500 text-stone-950', border: 'border-amber-400' };
    if (totalScore >= 85.0) return { title: 'Specialty - Excellent (Grade 1)', color: 'bg-emerald-600 text-white', border: 'border-emerald-500' };
    if (totalScore >= 80.0) return { title: 'Specialty - Very Good', color: 'bg-blue-600 text-white', border: 'border-blue-500' };
    return { title: 'Below Specialty / Commercial Grade', color: 'bg-rose-600 text-white', border: 'border-rose-500' };
  }, [totalScore]);

  // Radar Chart coordinates for 10 attributes
  // Max value: 10, center: 150, 150, radius: 100
  const radarAttributes = useMemo(() => [
    { label: 'Aroma', value: fragranceAroma },
    { label: 'Flavor', value: flavor },
    { label: 'Aftertaste', value: aftertaste },
    { label: 'Acidity', value: acidity },
    { label: 'Body', value: body },
    { label: 'Balance', value: balance },
    { label: 'Uniformity', value: uniformityScore },
    { label: 'Clean Cup', value: cleanCupScore },
    { label: 'Sweetness', value: sweetnessScore },
    { label: 'Overall', value: overall },
  ], [
    fragranceAroma,
    flavor,
    aftertaste,
    acidity,
    body,
    balance,
    uniformityScore,
    cleanCupScore,
    sweetnessScore,
    overall,
  ]);

  const radarPoints = useMemo(() => {
    const cx = 150;
    const cy = 150;
    const maxRadius = 100;
    const total = radarAttributes.length;

    return radarAttributes.map((attr, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = (attr.value / 10) * maxRadius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return { x, y, angle, label: attr.label, value: attr.value };
    });
  }, [radarAttributes]);

  const radarPolygonPoints = radarPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Note management
  const toggleNote = (note: string) => {
    if (selectedNotes.includes(note)) {
      setSelectedNotes(selectedNotes.filter((n) => n !== note));
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const addCustomNote = () => {
    if (customNoteInput.trim() && !selectedNotes.includes(customNoteInput.trim())) {
      setSelectedNotes([...selectedNotes, customNoteInput.trim()]);
      setCustomNoteInput('');
    }
  };

  // Toggle Brew Methods
  const toggleBrewMethod = (method: string) => {
    if (recommendedBrew.includes(method)) {
      setRecommendedBrew(recommendedBrew.filter((m) => m !== method));
    } else {
      setRecommendedBrew([...recommendedBrew, method]);
    }
  };

  // FINAL DECISION HANDLER (2 OPTIONS)
  const handleFinalDecision = (releaseToMarketplace: boolean) => {
    if (!currentLot) return;

    const cuppingData: CuppingEvaluationData = {
      evaluatedAt: new Date().toISOString(),
      evaluatorName: cupperName,
      totalScore,
      fragranceAroma,
      flavor,
      aftertaste,
      acidity,
      body,
      balance,
      uniformity: uniformityScore,
      cleanCup: cleanCupScore,
      sweetness: sweetnessScore,
      overall,
      defectDeduction,
      tastingNotes: selectedNotes,
      waterTdsPpm: waterTds,
      waterTempCelsius: waterTemp,
      evaluatorNotes,
      recommendationRestDays,
    };

    completeRoastCupping(currentLot.id, cuppingData, {
      releaseNow: releaseToMarketplace,
      pricePerPack,
      totalPacks,
      notes: evaluatorNotes,
    });

    setSaveSuccess(
      releaseToMarketplace
        ? '🚀 Berhasil! Batch telah resmi dirilis ke Unified Marketplace dan siap dibeli oleh Coffee Shop.'
        : '📦 Berhasil! Batch tersimpan di Inventory Roastery dengan status "Siap Dikirim ke Marketplace" (Deploy Ready).'
    );

    setTimeout(() => {
      navigate('/admin/roaster/inventory');
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Formulir Audit Mutu FRM-CUPPING-SCA-2026
            </span>
            <span className="text-xs text-stone-600 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {cuppingDate}
            </span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-600" />
            Lembar Kerja Uji Sensori Cupping SCA & Pelepasan Mutu
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Standar Specialty Coffee Association (SCA) 10-Atribut dengan kalkulasi skor otomatis & penentuan rilis ke pasar.
          </p>
        </div>

        {/* BREADCRUMB / ACTIONS */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/roaster/inventory"
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Warehouse className="w-4 h-4 text-stone-500" />
            Rak Inventory
          </Link>
          <Link
            to="/admin/roaster/production"
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Jadwal Sangrai
          </Link>
        </div>
      </div>

      {/* SAVE SUCCESS NOTIFICATION */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* LOT SELECTOR & LOT PROFILE SUMMARY */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lot Selector */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
              Pilih Batch Roasted Bean untuk Diuji
            </label>
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {roastedLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.id} - {lot.variety} ({lot.roastLevel}) [{lot.roastStatus === 'cupping_pending' ? '⚠️ Menunggu Cupping' : lot.isReleasedToMarketplace ? '🚀 Live Marketplace' : '📦 Deploy Ready'}]
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsBarcodeOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-all"
              >
                <QrCode className="w-3.5 h-3.5" />
                QR Code & Barcode Lot
              </button>

              <button
                type="button"
                onClick={() => setIsTraceOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-blue-400 text-xs font-bold flex items-center gap-1.5 border border-blue-500/30 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Audit Rantai Pasok
              </button>
            </div>
          </div>

          {/* Lot Details */}
          {currentLot && (
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Varietas & Asal</span>
                <p className="text-sm font-black text-white">{currentLot.variety}</p>
                <p className="text-xs text-amber-300/80">{currentLot.origin}</p>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Mesin Sangrai</span>
                <p className="text-sm font-black text-white">{currentLot.roasterMachine}</p>
                <p className="text-xs text-stone-400">Agtron: #{currentLot.agtronNumber} ({currentLot.roastLevel})</p>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Mitra Petani & Ketinggian</span>
                <p className="text-sm font-black text-white">{currentLot.farmerName}</p>
                <p className="text-xs text-stone-400">{currentLot.altitude} mdpl</p>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">DTR & Tanggal Sangrai</span>
                <p className="text-sm font-black text-amber-400">{currentLot.developmentTimeRatio}% DTR</p>
                <p className="text-xs text-stone-400">{currentLot.roastDate}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN WORKSHEET GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TWO COLUMNS: SCA 10 CRITERIA & CONTROLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* AUDITOR PROFILE & CALIBRATION */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              1. Identitas Auditor & Kalibrasi Seduhan Cupping
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Nama Cupper / Q-Grader
                </label>
                <input
                  type="text"
                  value={cupperName}
                  onChange={(e) => setCupperName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Air Seduh TDS (Target: 75 - 175 ppm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={waterTds}
                    onChange={(e) => setWaterTds(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-stone-600">ppm</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Suhu Air (Target: 92.5 - 94.5°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={waterTemp}
                    onChange={(e) => setWaterTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-bold focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-stone-600">°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* 10 SCA SENSORY ATTRIBUTES EVALUATION */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  2. Penilaian 10 Atribut Sensori SCA (Skala 6.00 - 10.00)
                </h3>
                <p className="text-xs text-stone-600">Geser slider atau masukkan angka kelipatan 0.25 poin sesuai panduan evaluasi meja.</p>
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Total Komponen: 10 Parameter
              </span>
            </div>

            {/* SLIDERS FOR THE 7 CONTINUOUS ATTRIBUTES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Fragrance / Aroma */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-stone-800">1. Fragrance / Aroma (Dry & Crust)</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-stone-200">{fragranceAroma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={fragranceAroma}
                  onChange={(e) => setFragranceAroma(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00 (Good)</span>
                  <span>7.00 (Very Good)</span>
                  <span>8.00 (Excellent)</span>
                  <span>9.00+ (Outstanding)</span>
                </div>
              </div>

              {/* 2. Flavor */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-stone-800">2. Flavor (Intensitas & Kompleksitas)</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-stone-200">{flavor.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={flavor}
                  onChange={(e) => setFlavor(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00</span>
                  <span>9.00+</span>
                </div>
              </div>

              {/* 3. Aftertaste */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-stone-800">3. Aftertaste (Panjang & Kebersihan)</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-stone-200">{aftertaste.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={aftertaste}
                  onChange={(e) => setAftertaste(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00</span>
                  <span>9.00+</span>
                </div>
              </div>

              {/* 4. Acidity */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-stone-800">4. Acidity (Kecerahan Asam Buah)</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-stone-200">{acidity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={acidity}
                  onChange={(e) => setAcidity(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00</span>
                  <span>9.00+</span>
                </div>
              </div>

              {/* 5. Body */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-stone-800">5. Body / Mouthfeel (Ketebalan & Tekstur)</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-stone-200">{body.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={body}
                  onChange={(e) => setBody(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00</span>
                  <span>9.00+</span>
                </div>
              </div>

              {/* 6. Balance */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-stone-800">6. Balance (Keseimbangan Rasa)</span>
                  <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-stone-200">{balance.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00</span>
                  <span>9.00+</span>
                </div>
              </div>

              {/* 10. Overall */}
              <div className="md:col-span-2 p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black text-amber-950">10. Overall (Kesan Menyeluruh Cupper)</span>
                  <span className="font-mono font-black text-amber-800 bg-white px-2.5 py-0.5 rounded border border-amber-300">{overall.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.25"
                  value={overall}
                  onChange={(e) => setOverall(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600">
                  <span>6.00</span>
                  <span>7.00</span>
                  <span>8.00</span>
                  <span>9.00+</span>
                </div>
              </div>
            </div>

            {/* 3 CUP-BASED CHECKLIST ATTRIBUTES (Uniformity, Clean Cup, Sweetness) */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">
                Pemeriksaan 5 Cangkir Meja (Uniformity, Clean Cup, Sweetness - Tiap Cangkir = 2.0 Poin)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 7. Uniformity */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>7. Uniformity</span>
                    <span className="font-mono font-black text-emerald-700">{uniformityScore.toFixed(1)} / 10.0</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {uniformityCups.map((val, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const updated = [...uniformityCups];
                          updated[idx] = !updated[idx];
                          setUniformityCups(updated);
                        }}
                        className={`w-7 h-7 rounded text-[10px] font-black border transition-all ${
                          val ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-stone-400 border-stone-300'
                        }`}
                      >
                        C{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. Clean Cup */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>8. Clean Cup</span>
                    <span className="font-mono font-black text-emerald-700">{cleanCupScore.toFixed(1)} / 10.0</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {cleanCups.map((val, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const updated = [...cleanCups];
                          updated[idx] = !updated[idx];
                          setCleanCups(updated);
                        }}
                        className={`w-7 h-7 rounded text-[10px] font-black border transition-all ${
                          val ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-stone-400 border-stone-300'
                        }`}
                      >
                        C{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 9. Sweetness */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-stone-800">
                    <span>9. Sweetness</span>
                    <span className="font-mono font-black text-emerald-700">{sweetnessScore.toFixed(1)} / 10.0</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {sweetnessCups.map((val, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const updated = [...sweetnessCups];
                          updated[idx] = !updated[idx];
                          setSweetnessCups(updated);
                        }}
                        className={`w-7 h-7 rounded text-[10px] font-black border transition-all ${
                          val ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-stone-400 border-stone-300'
                        }`}
                      >
                        C{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DEFECT DEDUCTION SECTION */}
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Pengurangan Cacat Rasa (Defects Penalty)
                </span>
                <span className="text-xs font-mono font-black text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-300">
                  Total Potongan: -{defectDeduction.toFixed(2)} Poin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-rose-200">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Taints (-2 Poin / Cangkir)</span>
                    <span className="text-[10px] text-stone-600">Cacat minor rasa atau aroma tidak wajar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTaintCount(Math.max(0, taintCount - 1))}
                      className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 font-black text-stone-700"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-sm">{taintCount}</span>
                    <button
                      type="button"
                      onClick={() => setTaintCount(Math.min(5, taintCount + 1))}
                      className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 font-black text-stone-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-rose-200">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Faults (-4 Poin / Cangkir)</span>
                    <span className="text-[10px] text-stone-600">Cacat mayor membusuk / fermen berat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFaultCount(Math.max(0, faultCount - 1))}
                      className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 font-black text-stone-700"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-sm">{faultCount}</span>
                    <button
                      type="button"
                      onClick={() => setFaultCount(Math.min(5, faultCount + 1))}
                      className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 font-black text-stone-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TASTING NOTES & FLAVOR WHEEL PICKER */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" />
              3. Profil Catatan Rasa (Tasting Notes & Sensory Wheel)
            </h3>
            <p className="text-xs text-stone-600">Klik tag yang terdeteksi di cangkir untuk disertakan dalam sertifikasi lot dan label produk kemasan.</p>

            <div className="space-y-3">
              {TASTING_NOTES_PRESETS.map((group) => (
                <div key={group.category} className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-600 block">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.notes.map((note) => {
                      const isSelected = selectedNotes.includes(note);
                      return (
                        <button
                          key={note}
                          type="button"
                          onClick={() => toggleNote(note)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {note}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Add Custom Note */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Tambah catatan rasa kustom (cth: Lemongrass, Starfruit)..."
                  value={customNoteInput}
                  onChange={(e) => setCustomNoteInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomNote())}
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={addCustomNote}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Tambah Tag
                </button>
              </div>

              {/* Active Selected Notes Preview */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
                  Catatan Rasa Terpilih (Akan Tercetak di QR Trace & Marketplace):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-1 shadow-sm"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => toggleNote(note)}
                        className="hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cupper Remarks */}
            <div className="pt-2">
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Catatan Teknis Evaluator / Barista Notes
              </label>
              <textarea
                rows={2}
                value={evaluatorNotes}
                onChange={(e) => setEvaluatorNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-amber-500"
                placeholder="Deskripsikan karakter aroma, acidity, dan rekomendasi penyajian..."
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RADAR CHART, SCORE TIER, PACKAGING & THE 2 FINAL DECISION OPTIONS */}
        <div className="space-y-6">
          {/* TOTAL SCORE CARD & RADAR VISUALIZATION */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Skor Total Evaluasi SCA Meja
            </span>

            <div className="flex flex-col items-center justify-center">
              <span className="text-6xl font-black font-mono tracking-tight text-stone-900">
                {totalScore.toFixed(2)}
              </span>
              <span className={`mt-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${specialtyGrade.color} ${specialtyGrade.border} shadow-sm`}>
                {specialtyGrade.title}
              </span>
            </div>

            {/* RADAR / SPIDER CHART SVG */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-600 mb-2">
                Grafik Radar Spider Web 10-Atribut
              </span>

              <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                  {/* Background concentric circles for 6, 7, 8, 9, 10 */}
                  {[20, 40, 60, 80, 100].map((r, i) => (
                    <circle
                      key={i}
                      cx="150"
                      cy="150"
                      r={r}
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  ))}

                  {/* Axis lines from center */}
                  {radarPoints.map((p, i) => (
                    <line
                      key={i}
                      x1="150"
                      y1="150"
                      x2={150 + 100 * Math.cos(p.angle)}
                      y2={150 + 100 * Math.sin(p.angle)}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Polygon shape */}
                  <polygon
                    points={radarPolygonPoints}
                    fill="rgba(217, 119, 6, 0.25)"
                    stroke="#D97706"
                    strokeWidth="2.5"
                  />

                  {/* Markers & Values */}
                  {radarPoints.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#D97706" />
                      <text
                        x={150 + 120 * Math.cos(p.angle)}
                        y={150 + 120 * Math.sin(p.angle) + 3}
                        fontSize="9"
                        fontWeight="bold"
                        fill="#4B5563"
                        textAnchor="middle"
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* COMMERCIAL PACKAGING & RESTING SPECIFICATIONS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              Spesifikasi Kemasan & Harga Satuan
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-stone-600 block mb-1">Berat Kemasan</label>
                <select
                  value={packageWeightGrams}
                  onChange={(e) => setPackageWeightGrams(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                >
                  <option value={200}>200 Gram</option>
                  <option value={250}>250 Gram (Standar)</option>
                  <option value={500}>500 Gram</option>
                  <option value={1000}>1.000 Gram (1 Kg)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-600 block mb-1">Total Pack Tersedia</label>
                <input
                  type="number"
                  value={totalPacks}
                  onChange={(e) => setTotalPacks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                />
              </div>

              <div className="col-span-2">
                <label className="font-bold text-stone-600 block mb-1">Harga per Kemasan (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-stone-600">Rp</span>
                  <input
                    type="number"
                    step={1000}
                    value={pricePerPack}
                    onChange={(e) => setPricePerPack(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono text-amber-700"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="font-bold text-stone-600 block mb-1">
                  Rekomendasi Resting (Degassing Days)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={recommendationRestDays}
                    onChange={(e) => setRecommendationRestDays(Number(e.target.value))}
                    className="w-24 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono text-stone-900"
                  />
                  <span className="text-xs text-stone-600 font-medium">
                    Hari sejak tanggal sangrai sebelum diseduh optimal
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Brew Methods */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-600 block">
                Metode Seduh Rekomendasi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['V60 Pour Over', 'Kalita Wave', 'Aeropress', 'French Press', 'Espresso', 'Cold Brew'].map((brew) => (
                  <button
                    key={brew}
                    type="button"
                    onClick={() => toggleBrewMethod(brew)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      recommendedBrew.includes(brew)
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {recommendedBrew.includes(brew) ? '✓ ' : '+ '}
                    {brew}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE 2 FINAL DECISION OPTIONS (USER MANDATORY REQUIREMENT)      */}
          {/* ============================================================== */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-6 border border-stone-800 shadow-xl space-y-5">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Tahap Keputusan Akhir
              </span>
              <h3 className="text-base font-black text-white mt-1">
                Pelepasan Batch Roasted Bean
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Pilih salah satu dari 2 opsi keputusan di bawah untuk menyelesaikan lembar kerja cupping:
              </p>
            </div>

            {/* OPTION A: DIRECT RELEASE TO MARKETPLACE */}
            <div className="bg-stone-800/80 hover:bg-stone-800 p-4 rounded-xl border border-emerald-500/50 transition-all space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-400">
                    Opsi A: Langsung Rilis ke Marketplace
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Batch kopi langsung dipublikasikan ke Unified Marketplace dan dapat segera dipesan oleh Coffee Shop mitra.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFinalDecision(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4 fill-current" />
                Rilis Sekarang ke Marketplace
              </button>
            </div>

            {/* OPTION B: SAVE TEMPORARILY IN INVENTORY (DEPLOY READY) */}
            <div className="bg-stone-800/80 hover:bg-stone-800 p-4 rounded-xl border border-amber-500/50 transition-all space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-400">
                    Opsi B: Simpan Sementara di Inventory (Deploy Ready)
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Batch disimpan di rak gudang internal roastery dengan status <strong>"Siap Dikirim ke Marketplace"</strong>. Anda dapat menekan tombol <strong>"🚀 Rilis Pasar"</strong> sewaktu-waktu.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFinalDecision(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan di Inventory (Siap Rilis Nanti)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {currentLot && (
        <>
          <RoasterBarcodeModal
            isOpen={isBarcodeOpen}
            onClose={() => setIsBarcodeOpen(false)}
            lot={currentLot}
          />
          <TraceabilityModal
            isOpen={isTraceOpen}
            onClose={() => setIsTraceOpen(false)}
            data={currentLot}
          />
        </>
      )}
    </div>
  );
};
