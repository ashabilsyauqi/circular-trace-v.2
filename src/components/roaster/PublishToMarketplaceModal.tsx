import React, { useState } from 'react';
import { X, Store, PackagePlus } from 'lucide-react';
import { WorkOrder } from '../../types/roasterErp';
import { RoastedBeanLot } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';

interface PublishToMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  onPublished: (lot: RoastedBeanLot) => void;
}

// Final step of the roasting flow: turn a completed Work Order into a sellable, marketplace-listed
// Roasted Bean Lot. This is what connects the internal MRP (Work Orders) to the Unified Marketplace
// that Farmer/Processor/Warehouse/Cafe already sell through.
export const PublishToMarketplaceModal: React.FC<PublishToMarketplaceModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onPublished,
}) => {
  const { publishRoastedLotFromWorkOrder } = useCoffee();

  const [packageWeightGrams, setPackageWeightGrams] = useState(250);
  const [totalPacks, setTotalPacks] = useState(20);
  const [pricePerPack, setPricePerPack] = useState(95000);
  const [scaCuppingScore, setScaCuppingScore] = useState(86.5);
  const [restingDays, setRestingDays] = useState(10);
  const [tastingNotesInput, setTastingNotesInput] = useState('Caramel, Citrus, Brown Sugar');
  const [recommendedBrewInput, setRecommendedBrewInput] = useState('V60, Espresso');

  if (!isOpen || !workOrder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot = publishRoastedLotFromWorkOrder(workOrder.id, {
      tastingNotes: tastingNotesInput.split(',').map((s) => s.trim()).filter(Boolean),
      scaCuppingScore: Number(scaCuppingScore),
      packageWeightGrams: Number(packageWeightGrams),
      totalPacks: Number(totalPacks),
      pricePerPack: Number(pricePerPack),
      restingRecommendationDays: Number(restingDays),
      recommendedBrew: recommendedBrewInput.split(',').map((s) => s.trim()).filter(Boolean),
    });
    if (newLot) onPublished(newLot);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-stone-900 text-white px-6 py-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Store className="w-3.5 h-3.5" />
              Jual ke Marketplace
            </div>
            <h2 className="text-lg font-bold">{workOrder.woNumber}</h2>
            <p className="text-xs text-stone-400 mt-1">
              {workOrder.origin} — {workOrder.variety} • {workOrder.actualRoastedKg || workOrder.targetRoastedKg} kg roasted
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-500">
            Lengkapi kemasan &amp; harga jual. Setelah diterbitkan, produk ini otomatis muncul di Unified Marketplace
            dan sebuah barcode/QR silsilah akan dibuat untuk lot ini.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Berat Kemasan (gram)</label>
              <input
                type="number"
                value={packageWeightGrams}
                onChange={(e) => setPackageWeightGrams(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Jumlah Pack</label>
              <input
                type="number"
                value={totalPacks}
                onChange={(e) => setTotalPacks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Harga / Pack (Rp)</label>
              <input
                type="number"
                value={pricePerPack}
                onChange={(e) => setPricePerPack(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">SCA Cupping Score</label>
              <input
                type="number"
                step="0.1"
                value={scaCuppingScore}
                onChange={(e) => setScaCuppingScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Resting (hari)</label>
              <input
                type="number"
                value={restingDays}
                onChange={(e) => setRestingDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tasting Notes (pisahkan koma)</label>
            <input
              type="text"
              value={tastingNotesInput}
              onChange={(e) => setTastingNotesInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Rekomendasi Brew (pisahkan koma)</label>
            <input
              type="text"
              value={recommendedBrewInput}
              onChange={(e) => setRecommendedBrewInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 flex items-center gap-2"
            >
              <PackagePlus className="w-4 h-4" /> Terbitkan ke Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
