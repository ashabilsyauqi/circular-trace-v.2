import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Store,
  Upload,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Flame,
  Sprout,
  Cog,
  Warehouse,
  QrCode,
  DollarSign,
  TrendingUp,
  Package,
  ShieldCheck,
  AlertCircle,
  Eye,
  Camera,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  MarketplaceCategory,
  PublishProductPayload,
  RoastedBeanLot,
  WarehouseLot,
  ProcessedGreenBeanLot,
  FarmerHarvestLot,
} from '../../types/coffee';

interface UploadProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedLotId?: string;
  preSelectedCategory?: MarketplaceCategory;
  onSuccess?: () => void;
}

// Preset foto komersial profesional untuk etalase specialty coffee (sebagai template fallback)
const PRESET_COFFEE_IMAGES = [
  {
    label: 'Roasted Bean Pouch (Hitam Doff Minimalis)',
    url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Roasted Bean Artisan Pouch (Kraft Paper)',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Biji Kopi Sangrai Utuh Fresh Roasting',
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Green Bean Karung Goni GrainPro Ekspor',
    url: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Ceri Kopi Merah Petik Pilihan (Ripe Cherry)',
    url: 'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&q=80&w=600',
  },
];

export const UploadProductModal: React.FC<UploadProductModalProps> = ({
  isOpen,
  onClose,
  preSelectedLotId,
  preSelectedCategory,
  onSuccess,
}) => {
  const {
    currentUser,
    roastedLots,
    warehouseLots,
    processedLots,
    farmerLots,
    publishProductFromInternalLot,
  } = useCoffee();

  // Category & Lot Selection
  const [category, setCategory] = useState<MarketplaceCategory>(
    preSelectedCategory || (currentUser?.role === 'roaster' ? 'roasted_bean' : 'green_bean_warehouse')
  );
  const [selectedLotId, setSelectedLotId] = useState<string>(preSelectedLotId || '');

  // Commercial Form Fields
  const [title, setTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState(PRESET_COFFEE_IMAGES[0].url);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [description, setDescription] = useState('');
  const [packageWeight, setPackageWeight] = useState('250g');
  const [stockQuantity, setStockQuantity] = useState(25);
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);
  const [packagingType, setPackagingType] = useState('Valve Foil Pouch 250g (Nitrogen Flush)');

  // Pricing & Margin Fields
  const [unitHpp, setUnitHpp] = useState(42000);
  const [packagingOverhead, setPackagingOverhead] = useState(5000);
  const [pricePerUnit, setPricePerUnit] = useState(95000);

  // Status message
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // File input ref for image upload from device
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ref to track initialized lot key so user typing title (e.g. "001") is NOT overwritten on re-renders
  const lastLoadedLotKeyRef = useRef<string | null>(null);

  // Reset lastLoadedLotKeyRef when modal closes
  useEffect(() => {
    if (!isOpen) {
      lastLoadedLotKeyRef.current = null;
    }
  }, [isOpen]);

  // Filter lots ready for upload based on active user role and category
  const availableLots = useMemo(() => {
    if (category === 'roasted_bean') {
      return roastedLots.filter(
        (l) => (!currentUser || currentUser.role === 'admin_kelompok_tani' || l.roasterId === currentUser.id) &&
               l.roastStatus !== 'cupping_pending' &&
               (l.availablePacks || 0) > 0
      );
    }
    if (category === 'green_bean_warehouse') {
      return warehouseLots.filter(
        (l) => (!currentUser || currentUser.role === 'admin_kelompok_tani' || l.warehouseId === currentUser.id) &&
               l.sortingStatus !== 'pending_sorting' &&
               (l.availableWeightKg || 0) > 0
      );
    }
    if (category === 'green_bean_processor') {
      return processedLots.filter(
        (l) => (!currentUser || currentUser.role === 'admin_kelompok_tani' || l.processorId === currentUser.id) &&
               (l.availableWeightKg || 0) > 0
      );
    }
    if (category === 'cherry') {
      return farmerLots.filter((l) => (l.availableWeightKg || 0) > 0);
    }
    return [];
  }, [category, roastedLots, warehouseLots, processedLots, farmerLots, currentUser]);

  // Currently selected internal lot object
  const currentLot = useMemo(() => {
    if (!selectedLotId) return null;
    if (category === 'roasted_bean') return roastedLots.find((l) => l.id === selectedLotId);
    if (category === 'green_bean_warehouse') return warehouseLots.find((l) => l.id === selectedLotId);
    if (category === 'green_bean_processor') return processedLots.find((l) => l.id === selectedLotId);
    if (category === 'cherry') return farmerLots.find((l) => l.id === selectedLotId);
    return null;
  }, [selectedLotId, category, roastedLots, warehouseLots, processedLots, farmerLots]);

  // Set default selected lot if available
  useEffect(() => {
    if (preSelectedLotId) {
      setSelectedLotId(preSelectedLotId);
    } else if (availableLots.length > 0 && !selectedLotId) {
      setSelectedLotId(availableLots[0].id);
    }
  }, [availableLots, preSelectedLotId]);

  // Autofill form ONLY when switching to a different lot (protects user's custom title & image edits)
  useEffect(() => {
    if (!currentLot) return;
    const currentKey = `${category}-${currentLot.id}`;
    if (lastLoadedLotKeyRef.current === currentKey) return;
    lastLoadedLotKeyRef.current = currentKey;

    if (category === 'roasted_bean') {
      const lot = currentLot as RoastedBeanLot;
      setTitle(lot.marketplaceTitle || `[Artisan Roast] ${lot.origin} - ${lot.variety} (${lot.roastLevel})`);
      setPhotoUrl(lot.photoUrl || PRESET_COFFEE_IMAGES[0].url);
      setUploadedFileName('');
      setPackageWeight(`${lot.packageWeightGrams || 250}g`);
      setStockQuantity(lot.availablePacks || 20);
      setPricePerUnit(lot.pricePerPack || 95000);
      setPackagingType('Valve Foil Pouch 250g (Nitrogen Flush)');
      setDescription(
        lot.marketplaceDescription ||
        `Biji kopi sangrai artisanal pilihan dari ${lot.origin} varietas ${lot.variety}. Disangrai menggunakan mesin ${lot.roasterMachine} dengan profil ${lot.roastLevel} (Agtron #${lot.agtronNumber}, DTR ${lot.developmentTimeRatio}%). Skor cupping SCA resmi ${(lot.scaCuppingScore || 85).toFixed(2)} dengan karakter rasa dominan: ${lot.tastingNotes?.join(', ') || 'Manis alami'}. Sangat direkomendasikan diseduh dengan metode ${lot.recommendedBrew?.join(', ') || 'Filter V60 atau Espresso'}.`
      );

      // Rekomendasi HPP Roaster: Beli green bean ~Rp 120rb / (1 - 0.16 susut) * 0.25kg + packaging
      const rawEstimatedHpp = Math.round((120000 / 0.84) * ((lot.packageWeightGrams || 250) / 1000)) + packagingOverhead;
      setUnitHpp(rawEstimatedHpp);
    } else if (category === 'green_bean_warehouse') {
      const lot = currentLot as WarehouseLot;
      setTitle(lot.marketplaceTitle || `[${lot.gradeTier ? lot.gradeTier.split(' - ')[1] : 'Grade 1'}] Green Bean ${lot.variety} - ${lot.origin}`);
      setPhotoUrl(lot.photoUrl || PRESET_COFFEE_IMAGES[3].url);
      setUploadedFileName('');
      setPackageWeight('Karung 60kg');
      setStockQuantity(lot.availableWeightKg || 60);
      setPricePerUnit(lot.pricePerKg || 125000);
      setPackagingType(`${lot.packagingType || 'GrainPro Hermetik + Karung Goni 60kg'}`);
      setDescription(
        lot.marketplaceDescription ||
        `Green bean grade ekspor terverifikasi dari ${lot.origin} (${lot.variety}, proses ${lot.processMethod}). Kadar air terkontrol ${lot.moistureContentPercent || 11.2}%, defect ${lot.defectCount} butir/350g, ukuran ayakan ${lot.screenSize || 'Size 16-18'}. Disimpan pada ${lot.storageLocation} dengan sertifikasi mutu SCA Score ${lot.verifiedScaScore}.`
      );

      // HPP Gudang: Harga beli modal + 3.000 (biaya sortasi & kemasan GrainPro)
      const baseCost = lot.purchasePricePerKg || Math.round(lot.pricePerKg * 0.8);
      setUnitHpp(baseCost + 3000);
    } else if (category === 'green_bean_processor') {
      const lot = currentLot as ProcessedGreenBeanLot;
      setTitle(lot.marketplaceTitle || `Green Bean Olahan ${lot.variety} (${lot.processMethod})`);
      setPhotoUrl(lot.photoUrl || PRESET_COFFEE_IMAGES[3].url);
      setUploadedFileName('');
      setPackageWeight('Per Kg');
      setStockQuantity(lot.availableWeightKg || 50);
      setPricePerUnit(lot.pricePerKg || 110000);
      setDescription(
        lot.marketplaceDescription ||
        `Green bean hasil olah basah/kering stasiun ${lot.processorName}. Fermentasi ${lot.fermentationTimeHours} jam dengan metode penjemuran ${lot.dryingMethod}. Kadar air ${lot.moistureContentPercent}%, rasa dominan ${lot.cuppingNotes?.join(', ')}.`
      );
      setUnitHpp(Math.round((16000 / 0.166) + 10000));
    } else if (category === 'cherry') {
      const lot = currentLot as FarmerHarvestLot;
      setTitle(lot.marketplaceTitle || `Ceri Kopi Merah Petik Pilihan: ${lot.variety} (${lot.farmLocation})`);
      setPhotoUrl(lot.photoUrl || PRESET_COFFEE_IMAGES[4].url);
      setUploadedFileName('');
      setPackageWeight('Per Kg');
      setStockQuantity(lot.availableWeightKg || 100);
      setPricePerUnit(lot.marketplacePricePerKg || lot.pricePerKg || 16500);
      setDescription(
        lot.marketplaceDescription ||
        `Ceri kopi merah matang optimal (${lot.brix}° Brix) hasil panen kebun ${lot.farmLocation} pada ketinggian ${lot.altitude}. Standar petik ${lot.pickingMethod}.`
      );
      setUnitHpp(Math.round((lot.pricePerKg || 15000) * 0.65));
    }
  }, [currentLot, category]);

  // Image File Upload Handler (FileReader -> Base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setNotice({ type: 'error', text: 'Ukuran file foto maksimal 5 MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          setCustomPhotoInput('');
          setUploadedFileName(file.name);
          setNotice({ type: 'success', text: `Foto kemasan "${file.name}" berhasil diunggah.` });
          setTimeout(() => setNotice(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Real-time Margin & Profit Calculations
  const grossProfitPerUnit = Math.max(0, pricePerUnit - unitHpp);
  const marginPercent = pricePerUnit > 0 ? Number(((grossProfitPerUnit / pricePerUnit) * 100).toFixed(1)) : 0;
  const projectedTotalProfit = grossProfitPerUnit * stockQuantity;
  const projectedTotalRevenue = pricePerUnit * stockQuantity;

  // Margin Health Tier
  const marginHealth = useMemo(() => {
    if (marginPercent >= 45) return { label: 'Margin Sangat Sehat (>45%)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (marginPercent >= 25) return { label: 'Margin Standar Industri (25-45%)', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    if (marginPercent > 0) return { label: 'Margin Tipis (<25%)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { label: 'Potensi Kerugian (Harga Di Bawah HPP)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  }, [marginPercent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLotId) {
      setNotice({ type: 'error', text: 'Wajib memilih lot internal sumber yang siap rilis.' });
      return;
    }

    if (!title.trim()) {
      setNotice({ type: 'error', text: 'Judul komersial produk tidak boleh kosong.' });
      return;
    }

    if (stockQuantity <= 0) {
      setNotice({ type: 'error', text: 'Jumlah stok yang dialokasikan harus lebih besar dari 0.' });
      return;
    }

    if (pricePerUnit <= 0) {
      setNotice({ type: 'error', text: 'Harga jual harus lebih besar dari 0.' });
      return;
    }

    const finalPhoto = customPhotoInput.trim() ? customPhotoInput.trim() : photoUrl;

    const payload: PublishProductPayload = {
      sourceLotId: selectedLotId,
      category,
      title: title.trim(),
      photoUrl: finalPhoto,
      description: description.trim(),
      packageWeight,
      stockQuantity,
      unitHpp,
      pricePerUnit,
      minOrderQuantity,
      packagingType,
    };

    const res = publishProductFromInternalLot(payload);
    if (res.success) {
      setNotice({ type: 'success', text: res.message });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } else {
      setNotice({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* 1. AdminLTE 3 Modal Header */}
        <div className="bg-[#343a40] text-white px-6 py-4.5 flex items-center justify-between border-b border-stone-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500 text-stone-950">
                  Seller Panel Portal
                </span>
                <span className="text-xs text-stone-300 font-mono flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-amber-400" /> Traceability-Enforced
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Upload &amp; Publikasi Produk ke Marketplace Terpadu
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-700/60 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Bar */}
        {notice && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center gap-2 border-b shrink-0 ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* STEP 1: PILIH LOT SUMBER INTERNAL (WAJIB) */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-stone-900 text-sm">
                  Pilih Data Lot Sumber Internal (Wajib Ber-QR)
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">
                Hanya lot berstatus <strong>Deploy Ready / Lulus Mutu</strong> yang dapat diunggah.
              </span>
            </div>

            {/* Category Pill Switcher */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('roasted_bean');
                  setSelectedLotId('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  category === 'roasted_bean'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Biji Sangrai (Roaster)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('green_bean_warehouse');
                  setSelectedLotId('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  category === 'green_bean_warehouse'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Warehouse className="w-3.5 h-3.5" />
                <span>Green Bean Gudang &amp; Ekspor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('green_bean_processor');
                  setSelectedLotId('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  category === 'green_bean_processor'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Cog className="w-3.5 h-3.5" />
                <span>Green Bean Pengolah (Mill)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('cherry');
                  setSelectedLotId('');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  category === 'cherry'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Ceri Kopi Segar (Petani)</span>
              </button>
            </div>

            {/* Dropdown Lot Internal */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Pilih Batch / Lot Siap Rilis:
              </label>
              {availableLots.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Belum ada lot internal yang siap rilis pada kategori ini. Selesaikan proses cupping/sortasi terlebih dahulu di menu internal.
                  </span>
                </div>
              ) : (
                <select
                  value={selectedLotId}
                  onChange={(e) => setSelectedLotId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-bold text-stone-800 focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">-- Pilih Lot Internal yang Siap Tayang --</option>
                  {availableLots.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.id} • {l.variety || 'Arabika'} ({l.origin || l.farmLocation || 'Jawa Barat'}) — Stok:{' '}
                      {l.availablePacks ? `${l.availablePacks} pack` : `${l.availableWeightKg} kg`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Lot Preview Box */}
            {currentLot && (
              <div className="bg-white p-3.5 rounded-lg border border-stone-200 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{currentLot.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Lolos Verifikasi Mutu</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Silsilah Terkunci: <strong>{(currentLot as any).farmerName || (currentLot as any).sourceFarmerName || 'Petani Mandiri'}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Varietas:</span>
                    <strong className="text-stone-800">{(currentLot as any).variety}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Metode Olah / Sangrai:</span>
                    <strong className="text-stone-800">{(currentLot as any).processMethod || (currentLot as any).roastLevel}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Skor Evaluasi:</span>
                    <strong className="text-amber-800">
                      {(currentLot as any).scaCuppingScore
                        ? `SCA ${(currentLot as any).scaCuppingScore}`
                        : (currentLot as any).verifiedScaScore
                        ? `SCA ${(currentLot as any).verifiedScaScore}`
                        : `${(currentLot as any).brix || 21}° Brix`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Sisa Stok Internal:</span>
                    <strong className="text-stone-800">
                      {(currentLot as any).availablePacks
                        ? `${(currentLot as any).availablePacks} pack`
                        : `${(currentLot as any).availableWeightKg} kg`}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: DETAIL LISTING KOMERSIAL & MEDIA */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-stone-900 text-sm">
                Detail Etalase Komersial &amp; Foto Produk
              </h3>
            </div>

            {/* Custom Commercial Title Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-800">
                  Judul Komersial Produk di Marketplace:
                </label>
                <span className="text-[10px] text-stone-500 font-medium">
                  Bebas Anda ganti (contoh: "001", "Specialty Typica Roaster X", dll)
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: 001 - Gunung Tilu Natural Typica 250g"
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-bold text-stone-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
                required
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Judul ini yang akan tampil di etalase pembeli. Silsilah internal lot (asal panen, varietas, QR paspor) tetap terjaga otomatis.
              </p>
            </div>

            {/* SELLER PRODUCT PHOTO MANAGEMENT (File Upload / URL / Presets) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-stone-800 block">
                    Foto Produk &amp; Kemasan Ritel:
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Seller dapat mengunggah foto kemasan asli sendiri atau menggunakan opsi lainnya.
                  </span>
                </div>

                {/* Switcher Modes */}
                <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPhotoSourceMode('upload')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      photoSourceMode === 'upload'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>Upload Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSourceMode('url')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      photoSourceMode === 'url'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>URL Gambar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSourceMode('preset')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                      photoSourceMode === 'preset'
                        ? 'bg-white text-orange-600 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Template</span>
                  </button>
                </div>
              </div>

              {/* Live Image Preview Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-3 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-44 h-32 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={title || 'Pratinjau Foto Produk'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px]">Belum ada foto</span>
                    </div>
                  )}

                  {photoUrl && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-stone-950/80 text-white text-[9px] font-bold backdrop-blur-xs flex items-center gap-1">
                      {uploadedFileName ? (
                        <>
                          <Camera className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Foto Unggahan</span>
                        </>
                      ) : photoUrl.startsWith('data:') ? (
                        <>
                          <Camera className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Foto Kustom</span>
                        </>
                      ) : customPhotoInput ? (
                        <>
                          <LinkIcon className="w-2.5 h-2.5 text-blue-400" />
                          <span>URL Foto</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-2.5 h-2.5 text-amber-400" />
                          <span>Template CCT</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">
                      {uploadedFileName
                        ? `File: ${uploadedFileName}`
                        : customPhotoInput
                        ? 'Tautan Foto Eksternal Aktif'
                        : 'Foto Sampel Kemasan Aktif'}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Foto ini akan langsung tampil di etalase Marketplace bersama judul komersial "{title || '...'}"
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{photoUrl ? 'Pilih / Ganti Foto Lain' : 'Upload Foto dari Komputer'}</span>
                    </button>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl(PRESET_COFFEE_IMAGES[0].url);
                          setUploadedFileName('');
                          setCustomPhotoInput('');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-stone-500" />
                        <span>Reset ke Default</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mode 1: File Upload Dropzone */}
              {photoSourceMode === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50/70 rounded-xl text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-stone-900 text-xs">
                    Klik untuk memilih foto produk dari Laptop atau HP Anda
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Mendukung format JPG, PNG, WEBP (Ukuran file maksimal 5 MB)
                  </div>
                </div>
              )}

              {/* Mode 2: Direct Image URL */}
              {photoSourceMode === 'url' && (
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-1.5">
                  <label className="font-bold text-stone-800 text-[11px] block">
                    Masukkan URL Foto Produk (CDN / Hosting Eksternal):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customPhotoInput}
                      onChange={(e) => {
                        setCustomPhotoInput(e.target.value);
                        if (e.target.value.trim()) {
                          setPhotoUrl(e.target.value.trim());
                          setUploadedFileName('');
                        }
                      }}
                      placeholder="https://images.unsplash.com/... atau tautan foto lainnya"
                      className="flex-1 px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customPhotoInput.trim()) {
                          setPhotoUrl(customPhotoInput.trim());
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-stone-900 text-white font-bold text-xs cursor-pointer"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 3: Curated Presets Template */}
              {photoSourceMode === 'preset' && (
                <div className="bg-white p-3 rounded-lg border border-stone-200 space-y-2">
                  <span className="text-[11px] text-stone-600 font-bold block">
                    Pilih salah satu template foto kemasan standar CCT:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_COFFEE_IMAGES.map((img, idx) => {
                      const isSelected = photoUrl === img.url && !uploadedFileName && !customPhotoInput;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setPhotoUrl(img.url);
                            setCustomPhotoInput('');
                            setUploadedFileName('');
                          }}
                          className={`group relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-600 shadow-md scale-102'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-18 object-cover" />
                          <div className="p-1 bg-white text-[9px] font-bold text-stone-700 truncate">
                            {img.label.split(' ')[0]} {img.label.split(' ')[1]}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Deskripsi & Storytelling Produk */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Deskripsi Produk &amp; Catatan Rasa (*Flavor Profile &amp; Story*):
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 text-stone-800 focus:outline-none focus:border-orange-500"
                placeholder="Ceritakan keistimewaan terroir kopi, proses pengolahan, dan profil rasanya..."
                required
              />
            </div>
          </div>

          {/* STEP 3: KEMASAN, KUOTA STOK & KALKULATOR HARGA & MARGIN */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-stone-900 text-sm">
                Satuan Kemasan, Kuota Stok &amp; Kalkulator Margin Laba
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Satuan Kemasan:</label>
                <select
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-bold text-stone-800"
                >
                  <option value="200g">Pack 200g (Retail)</option>
                  <option value="250g">Pack 250g (Standard Pouch)</option>
                  <option value="500g">Pack 500g</option>
                  <option value="1 kg">Pack 1 Kg (B2B Cafe)</option>
                  <option value="Per Kg">Per Kg (Bahan Baku / Green Bean)</option>
                  <option value="Karung 60kg">Karung Goni 60kg (Ekspor / Gudang)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Stok yang Dirilis ke Pasar:
                </label>
                <input
                  type="number"
                  min="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-bold text-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  Minimal Pembelian (MOQ):
                </label>
                <input
                  type="number"
                  min="1"
                  value={minOrderQuantity}
                  onChange={(e) => setMinOrderQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 font-bold text-stone-800"
                  required
                />
              </div>
            </div>

            {/* PRICING & HPP INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-stone-100 rounded-lg border border-stone-300 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800">
                    Estimasi Beban Pokok (HPP) per Unit:
                  </label>
                  <span className="text-[10px] text-stone-500 font-medium">(Modal Beli + Biaya Kemasan)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">Rp</span>
                  <input
                    type="number"
                    value={unitHpp}
                    onChange={(e) => setUnitHpp(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white rounded border border-stone-300 font-mono font-bold text-stone-900"
                    required
                  />
                </div>
                <p className="text-[10px] text-stone-500">
                  Dihitung otomatis berdasarkan harga green bean asal, estimasi susut roasting ~16%, serta biaya kemasan.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-950">
                    Harga Jual Satuan di Marketplace:
                  </label>
                  <span className="text-[10px] text-amber-700 font-bold">Harga Bersih ke Pembeli</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700">Rp</span>
                  <input
                    type="number"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white rounded border border-amber-400 font-mono font-black text-amber-900 text-sm"
                    required
                  />
                </div>
                <p className="text-[10px] text-amber-800">
                  Harga yang akan ditampilkan di etalase katalog publik untuk dipesan Cafe &amp; Mitra.
                </p>
              </div>
            </div>

            {/* LIVE MARGIN & PROFIT SIMULATOR BOX */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white p-4.5 rounded-xl border border-stone-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Kalkulator Margin &amp; Proyeksi Keuntungan
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${marginHealth.color}`}>
                  {marginHealth.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                  <span className="text-[10px] text-stone-400 block mb-0.5">Laba Kotor / Unit</span>
                  <div className="font-mono font-black text-sm text-emerald-400">
                    Rp {grossProfitPerUnit.toLocaleString()}
                  </div>
                </div>

                <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                  <span className="text-[10px] text-stone-400 block mb-0.5">Margin Keuntungan</span>
                  <div className="font-mono font-black text-sm text-amber-400">
                    {marginPercent.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                  <span className="text-[10px] text-stone-400 block mb-0.5">Potensi Omset Total</span>
                  <div className="font-mono font-bold text-xs text-stone-300">
                    Rp {projectedTotalRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="bg-stone-800/80 p-2.5 rounded-lg border border-stone-700">
                  <span className="text-[10px] text-stone-400 block mb-0.5">Proyeksi Total Laba</span>
                  <div className="font-mono font-black text-sm text-emerald-400">
                    Rp {projectedTotalProfit.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-black text-xs shadow-md shadow-orange-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>🚀 Terbitkan Produk ke Marketplace Publik</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
