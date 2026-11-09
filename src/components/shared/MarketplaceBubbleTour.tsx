import React, { useState, useEffect, useRef } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  Layers,
  MapPin,
  Award,
  ShieldCheck,
  ShoppingCart,
  QrCode,
  HelpCircle,
} from 'lucide-react';

const STORAGE_KEY = 'cct_onboarding_tour_v1';

export interface TourBubbleStep {
  id: string;
  pageView: 'marketplace' | 'product' | 'any';
  targetSelector: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  content: string;
  tip?: string;
  preferredPlacement: 'bottom' | 'top' | 'right' | 'bottom-left';
}

export const MarketplaceBubbleTour: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}> = ({ isOpen: controlledIsOpen, onClose: controlledOnClose, forceOpen = false }) => {
  const { activeView, navigate, unifiedMarketplaceItems } = useCoffee();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [bubblePos, setBubblePos] = useState<{
    top: number;
    left: number;
    actualPlacement: 'bottom' | 'top' | 'right' | 'bottom-left';
    arrowOffset: number;
  }>({
    top: 100,
    left: 100,
    actualPlacement: 'bottom',
    arrowOffset: 30,
  });

  const bubbleRef = useRef<HTMLDivElement>(null);

  const BUBBLE_STEPS: TourBubbleStep[] = [
    {
      id: 'search',
      pageView: 'marketplace',
      targetSelector: '#tour-search-bar',
      title: 'Pencarian Cerdas Kopi',
      badge: 'Pencarian',
      icon: <Search className="w-4 h-4 text-emerald-600" />,
      content:
        'Ketik nama varietas (Typica, Bourbon), nama origin (Solok, Gayo, Pangalengan), atau nama koperasi untuk memfilter katalog secara instan.',
      tip: 'Filter hasil bekerja langsung saat Anda mengetik kata kunci.',
      preferredPlacement: 'bottom',
    },
    {
      id: 'category',
      pageView: 'marketplace',
      targetSelector: '#tour-category-filter',
      title: 'Filter Kategori Komoditas',
      badge: 'Kategori',
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      content:
        'Saring komoditas kopi berdasarkan tahapan pasok: 🟠 Ceri Segar (Panen Hulu), 🟢 Green Bean (Siap Sangrai/Ekspor), atau 🟤 Biji Sangrai (Roasted).',
      tip: 'Warna semantik membedakan setiap wujud komoditas secara visual.',
      preferredPlacement: 'right',
    },
    {
      id: 'origin',
      pageView: 'marketplace',
      targetSelector: '#tour-origin-filter',
      title: 'Wilayah Origin Nusantara',
      badge: 'Wilayah Asal',
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      content:
        'Pilih lot dari 5 kawasan penghasil kopi unggulan: Pangalengan (Jabar), Aceh Gayo, Kintamani (Bali), Flores Bajawa, atau Solok Radjo.',
      tip: 'Faceted counter memastikan pilihan Anda selalu menampilkan lot yang tersedia.',
      preferredPlacement: 'right',
    },
    {
      id: 'sca',
      pageView: 'marketplace',
      targetSelector: '#tour-sca-filter',
      title: 'Skor Mutu Cupping SCA',
      badge: 'Kualitas',
      icon: <Award className="w-4 h-4 text-emerald-600" />,
      content:
        'Kurasi lot berdasarkan skor evaluasi citarasa Q-Grader resmi: Specialty Superior (SCA 86+) atau Specialty Standard (SCA 84+).',
      tip: 'Skor SCA 86+ menjamin defect minimal (< 3/350g) dan karakter citarasa superior.',
      preferredPlacement: 'right',
    },
    {
      id: 'eudr',
      pageView: 'marketplace',
      targetSelector: '#tour-eudr-filter',
      title: 'Audit Bebas Deforestasi EUDR',
      badge: 'Regulasi Hijau',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      content:
        'Centang filter ini untuk menampilkan lot komoditas yang telah terverifikasi bebas deforestasi oleh Prof. Novizar Nazir (TPHP Universitas Andalas).',
      tip: 'Memastikan legalitas ekspor Uni Eropa dan prinsip kelestarian hutan.',
      preferredPlacement: 'right',
    },
    {
      id: 'product-card',
      pageView: 'marketplace',
      targetSelector: '#tour-first-product-card',
      title: 'Kartu Lot & Silsilah Digital',
      badge: 'Katalog Lot',
      icon: <QrCode className="w-4 h-4 text-emerald-600" />,
      content:
        'Setiap kartu menampilkan foto kebun asli, kadar air, elevasi, skor SCA, dan sertifikat traceability. Klik kartu untuk membuka lembar spesifikasi.',
      tip: 'Klik kartu produk untuk melihat detail panen dan barcode GS1-128 resmi.',
      preferredPlacement: 'top',
    },
    {
      id: 'product-add-cart',
      pageView: 'product',
      targetSelector: '#tour-product-add-cart-btn',
      title: 'Tombol + Keranjang Belanja',
      badge: 'Tambah Order',
      icon: <ShoppingCart className="w-4 h-4 text-emerald-600" />,
      content:
        'Pada halaman detail produk, gunakan tombol "+ Keranjang Belanja" ini untuk menambahkan lot kopi ke keranjang sebelum melakukan checkout bundle.',
      tip: 'Sesuaikan jumlah kilogram (kg) di atas tombol sebelum memasukkan ke keranjang.',
      preferredPlacement: 'top',
    },
    {
      id: 'cart-nav',
      pageView: 'any',
      targetSelector: '#tour-cart-btn',
      title: 'Keranjang & Bundle Checkout',
      badge: 'Bundle Payment',
      icon: <ShoppingCart className="w-4 h-4 text-emerald-600" />,
      content:
        'Arahkan kursor ke ikon keranjang ini untuk melihat ringkasan maks 4 produk, atau klik untuk membuka halaman Checkout Bundle dengan kalkulasi otomatis.',
      tip: 'Gunakan checklist bundle untuk hanya membayar produk yang Anda centang.',
      preferredPlacement: 'bottom-left',
    },
    {
      id: 'guide-nav',
      pageView: 'any',
      targetSelector: '#tour-guide-btn',
      title: 'Pusat Panduan Kapan Saja',
      badge: 'Bantuan',
      icon: <HelpCircle className="w-4 h-4 text-emerald-600" />,
      content:
        'Kapan saja Anda membutuhkan panduan fitur interaktif ini kembali, cukup klik tombol "Panduan Fitur" di navbar atas.',
      tip: 'Seluruh riwayat onboarding tersimpan rapi di browser Anda.',
      preferredPlacement: 'bottom-left',
    },
  ];

  // Auto-open on first visit with Cache Management
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStepIndex(0);
      return;
    }

    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
      return;
    }

    if (typeof window !== 'undefined') {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setCurrentStepIndex(0);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [controlledIsOpen, forceOpen]);

  const handleClose = (markCompleted: boolean = true) => {
    if (markCompleted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        console.error('Failed to set tour cache', e);
      }
    }
    setIsOpen(false);
    setTargetElement(null);
    setTargetRect(null);
    setIsReady(false);
    if (controlledOnClose) controlledOnClose();
  };

  const handleNext = () => {
    if (currentStepIndex < BUBBLE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Measure and position bubble directly attached to the target element
  const updatePosition = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    const bubbleEl = bubbleRef.current;
    const bubbleWidth = bubbleEl ? bubbleEl.offsetWidth : 360;
    const bubbleHeight = bubbleEl ? bubbleEl.offsetHeight : 230;

    const currentStep = BUBBLE_STEPS[currentStepIndex];
    let placement = currentStep.preferredPlacement;

    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop && placement === 'right') {
      placement = 'bottom';
    }

    let top = 0;
    let left = 0;
    let arrowOffset = 30;

    if (placement === 'bottom') {
      top = rect.bottom + 14;
      left = rect.left + rect.width / 2 - bubbleWidth / 2;
      left = Math.max(16, Math.min(window.innerWidth - bubbleWidth - 16, left));
      arrowOffset = Math.max(20, Math.min(bubbleWidth - 24, rect.left + rect.width / 2 - left));

      // Flip to top if overflowing bottom of screen
      if (top + bubbleHeight > window.innerHeight - 16 && rect.top - bubbleHeight - 14 > 76) {
        placement = 'top';
        top = rect.top - bubbleHeight - 14;
      }
    } else if (placement === 'top') {
      top = rect.top - bubbleHeight - 14;
      left = rect.left + rect.width / 2 - bubbleWidth / 2;
      left = Math.max(16, Math.min(window.innerWidth - bubbleWidth - 16, left));
      arrowOffset = Math.max(20, Math.min(bubbleWidth - 24, rect.left + rect.width / 2 - left));

      // Flip to bottom if overflowing top under navbar
      if (top < 76 && rect.bottom + bubbleHeight + 14 < window.innerHeight - 16) {
        placement = 'bottom';
        top = rect.bottom + 14;
      }
    } else if (placement === 'right') {
      left = rect.right + 14;
      top = rect.top + rect.height / 2 - bubbleHeight / 2;
      top = Math.max(76, Math.min(window.innerHeight - bubbleHeight - 16, top));
      arrowOffset = Math.max(20, Math.min(bubbleHeight - 24, rect.top + rect.height / 2 - top));

      // Flip to bottom if right edge overflows screen
      if (left + bubbleWidth > window.innerWidth - 16) {
        placement = 'bottom';
        top = rect.bottom + 14;
        left = Math.max(16, Math.min(window.innerWidth - bubbleWidth - 16, rect.left));
        arrowOffset = 30;
      }
    } else if (placement === 'bottom-left') {
      top = rect.bottom + 14;
      left = rect.right - bubbleWidth;
      left = Math.max(16, Math.min(window.innerWidth - bubbleWidth - 16, left));
      arrowOffset = Math.max(20, Math.min(bubbleWidth - 24, rect.right - 20 - left));
    }

    // Clamp top to never hide under sticky navbar (~72px)
    top = Math.max(76, Math.min(window.innerHeight - bubbleHeight - 16, top));

    setBubblePos({
      top,
      left,
      actualPlacement: placement,
      arrowOffset,
    });
    setIsReady(true);
  };

  // Switch view if needed and locate target element
  useEffect(() => {
    if (!isOpen) {
      setTargetElement(null);
      setTargetRect(null);
      setIsReady(false);
      return;
    }

    const currentStep = BUBBLE_STEPS[currentStepIndex];
    if (!currentStep) return;

    // View Routing: Switch view to match step context!
    if (currentStep.pageView === 'marketplace' && activeView !== 'marketplace') {
      navigate({ view: 'marketplace', lotId: null });
    } else if (currentStep.pageView === 'product' && activeView !== 'product') {
      const defaultLotId = unifiedMarketplaceItems[0]?.id || 'LOT-PTN-004';
      navigate({ view: 'product', lotId: defaultLotId });
    }

    setIsReady(false);
    let isCancelled = false;
    let attempts = 0;

    const findTarget = () => {
      if (isCancelled) return;
      const el = document.querySelector(currentStep.targetSelector) as HTMLElement | null;

      if (el) {
        setTargetElement(el);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Give smooth scroll time to finish before anchoring
        setTimeout(() => {
          if (!isCancelled) {
            updatePosition(el);
          }
        }, 300);
      } else {
        attempts++;
        if (attempts < 25) {
          // Poll every 80ms while DOM mounts
          setTimeout(findTarget, 80);
        } else {
          // Element not found even after timeout
          console.warn(`[MarketplaceBubbleTour] Target element not found: ${currentStep.targetSelector}`);
        }
      }
    };

    const initialTimer = setTimeout(findTarget, 100);

    return () => {
      isCancelled = true;
      clearTimeout(initialTimer);
    };
  }, [currentStepIndex, isOpen, activeView]);

  // Keep bubble anchored during scroll or resize
  useEffect(() => {
    if (!isOpen || !targetElement) return;

    const handleUpdate = () => {
      requestAnimationFrame(() => {
        if (targetElement) updatePosition(targetElement);
      });
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isOpen, targetElement, currentStepIndex]);

  // DO NOT RENDER IN THE DEAD CENTER: Only render when element target is located and measured!
  if (!isOpen || !targetElement || !targetRect || !isReady) return null;

  const currentStep = BUBBLE_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === BUBBLE_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* SOFT BACKDROP (dismiss on click) */}
      <div
        className="fixed top-16 inset-x-0 bottom-0 bg-slate-950/25 pointer-events-auto transition-opacity duration-300"
        onClick={() => handleClose(true)}
      />

      {/* HIGHLIGHT SPOTLIGHT RING DIRECTLY ON TARGET ELEMENT */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-300 rounded-2xl ring-4 ring-emerald-500/90 ring-offset-2 ring-offset-white border-2 border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.5)]"
        style={{
          top: `${Math.max(0, targetRect.top - 4)}px`,
          left: `${Math.max(0, targetRect.left - 4)}px`,
          width: `${targetRect.width + 8}px`,
          height: `${targetRect.height + 8}px`,
        }}
      />

      {/* FLOATING SPEECH BUBBLE CHAT DIRECTLY ATTACHED TO TARGET */}
      <div
        ref={bubbleRef}
        className="fixed z-50 pointer-events-auto w-[calc(100vw-32px)] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 text-slate-900 transition-all duration-200 animate-in fade-in zoom-in-95"
        style={{
          top: `${bubblePos.top}px`,
          left: `${bubblePos.left}px`,
        }}
      >
        {/* CHAT BUBBLE TAIL / POINTER ARROW POINTING DIRECTLY TO TARGET */}
        {bubblePos.actualPlacement === 'bottom' && (
          <div
            className="absolute -top-2 w-4 h-4 bg-white border-t border-l border-slate-200/90 transform rotate-45 z-10"
            style={{ left: `${bubblePos.arrowOffset - 8}px` }}
          />
        )}
        {bubblePos.actualPlacement === 'bottom-left' && (
          <div
            className="absolute -top-2 w-4 h-4 bg-white border-t border-l border-slate-200/90 transform rotate-45 z-10"
            style={{ left: `${bubblePos.arrowOffset - 8}px` }}
          />
        )}
        {bubblePos.actualPlacement === 'top' && (
          <div
            className="absolute -bottom-2 w-4 h-4 bg-white border-b border-r border-slate-200/90 transform rotate-45 z-10"
            style={{ left: `${bubblePos.arrowOffset - 8}px` }}
          />
        )}
        {bubblePos.actualPlacement === 'right' && (
          <div
            className="absolute -left-2 w-4 h-4 bg-white border-b border-l border-slate-200/90 transform rotate-45 z-10"
            style={{ top: `${bubblePos.arrowOffset - 8}px` }}
          />
        )}

        {/* BUBBLE HEADER */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{currentStep.badge}</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {currentStepIndex + 1} / {BUBBLE_STEPS.length}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              {currentStep.icon}
              <span>{currentStep.title}</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleClose(true)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BUBBLE CONTENT */}
        <div className="p-4 sm:p-5 pt-3 space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {currentStep.content}
          </p>

          {currentStep.tip && (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-[11px] text-emerald-900 flex items-start gap-1.5 leading-snug">
              <span className="shrink-0 font-bold text-emerald-700">💡 Tips:</span>
              <span>{currentStep.tip}</span>
            </div>
          )}
        </div>

        {/* BUBBLE FOOTER CONTROLS */}
        <div className="p-3.5 sm:p-4 bg-slate-50/90 rounded-b-3xl border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Skip Button */}
          <button
            type="button"
            onClick={() => handleClose(true)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Lewati Tutorial
          </button>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{isLastStep ? 'Selesai' : 'Lanjut'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
