import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { SUBSCRIPTION_PLANS } from '../../data/mockSubscriptions';
import { SubscriptionTierId } from '../../types/subscription';
import { PurchaseSimulationModal } from './PurchaseSimulationModal';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Award,
  Layers,
  Calendar,
  Play,
  RotateCcw,
} from 'lucide-react';

export interface SubscriptionPricingCardsProps {
  onSuccess?: () => void;
  showAllInclusiveBanner?: boolean;
}

export const SubscriptionPricingCards: React.FC<SubscriptionPricingCardsProps> = ({
  onSuccess,
  showAllInclusiveBanner = true,
}) => {
  const {
    currentUser,
    getUserSubscription,
    setActiveView,
  } = useCoffee();

  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [targetSimPlan, setTargetSimPlan] = useState<SubscriptionTierId>('3_months');

  const currentSub = currentUser ? getUserSubscription(currentUser.id) : null;

  const handleOpenSimulator = (planId: SubscriptionTierId) => {
    setTargetSimPlan(planId);
    setSimulatorOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* ALL-INCLUSIVE BUNDLE EXPLANATION BANNER */}
      {showAllInclusiveBanner && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 border border-amber-500/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Paket Langganan Langsung Bundle (All-In-One Full Access)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Satu Langganan, Bebas Akses Seluruh 6 Layanan Ekosistem Kopi
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Anda tidak perlu menyewa modul satu per satu. Seluruh varian durasi di bawah langsung memberikan akses lengkap dari hulu perkebunan, stasiun mill, gudang konsinyasi, artisan roastery, kedai kopi cafe, hingga audit resmi CT-4CI.
              </p>
            </div>

            {/* Included Roles Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full md:w-auto shrink-0 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-emerald-300 font-bold">
                <Sprout className="w-3.5 h-3.5" />
                <span>1. Petani &amp; Kebun</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-amber-300 font-bold">
                <Cog className="w-3.5 h-3.5" />
                <span>2. Pabrik &amp; Mill</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-blue-300 font-bold">
                <Warehouse className="w-3.5 h-3.5" />
                <span>3. Gudang &amp; Silo</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-orange-300 font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>4. Roastery Sangrai</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-stone-300 font-bold">
                <Coffee className="w-3.5 h-3.5" />
                <span>5. Cafe &amp; POS Kasir</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-1.5 text-purple-300 font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>6. Dewan Audit 4C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 DURATION BUNDLE VARIANT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentActive =
            currentSub?.status !== 'expired' && currentSub?.tierId === plan.id;
          const isPopular = plan.isPopular;
          const isBest = plan.isBestValue;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative border ${
                isBest
                  ? 'bg-gradient-to-b from-purple-50/50 to-white border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
                  : isPopular
                  ? 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                  : 'bg-white border-stone-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Badges on top */}
              {isBest && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-700 text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Paling Hemat &bull; 4 Bulan Gratis</span>
                </div>
              )}
              {isPopular && !isBest && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shadow-sm whitespace-nowrap">
                  Populer 1 Siklus Panen
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      isBest
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : isPopular
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-black text-stone-900 tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="pt-3 border-t border-stone-100 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-stone-500">Rp</span>
                    <span className="text-3xl font-black text-stone-900">
                      {plan.totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      /{plan.durationDays === 365 ? 'tahun' : `${plan.durationDays} hari`}
                    </span>
                  </div>

                  {plan.savingsNote && (
                    <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <span>&check; Setara Rp {plan.monthlyEquivalent.toLocaleString()}/bln</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 text-[10px]">
                        {plan.savingsNote}
                      </span>
                    </div>
                  )}
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-3 border-t border-stone-100">
                  <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Fasilitas Bundle Lengkap:
                  </p>
                  <ul className="space-y-2 text-xs text-stone-600">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button: Opens Purchase Simulator */}
              <div className="pt-6 mt-6 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleOpenSimulator(plan.id)}
                  className={`w-full py-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                    isBest
                      ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/30'
                      : isPopular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Pilih Paket {plan.durationLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK 7-DAYS FREE TRIAL BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">
              Ingin Mencoba Dulu Tanpa Biaya?
            </h4>
            <p className="text-[11px] sm:text-xs text-stone-600">
              Daftar <strong>Free Trial 7 Hari (Full Access)</strong> untuk mencoba semua fitur ekosistem dari hulu ke hilir tanpa komitmen.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenSimulator('7_days_trial')}
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs transition-all cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 text-amber-400" />
          <span>Aktivasi Trial 7 Hari &rarr;</span>
        </button>
      </div>

      {/* FULL PURCHASE SIMULATION MODAL */}
      <PurchaseSimulationModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        initialPlanId={targetSimPlan}
        onCompleted={(sub, invoice) => {
          if (onSuccess) onSuccess();
        }}
      />
    </div>
  );
};
