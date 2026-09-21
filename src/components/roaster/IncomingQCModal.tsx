import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react';
import { WarehouseLot } from '../../types/coffee';
import { useCoffee } from '../../context/CoffeeContext';

interface IncomingQCModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: WarehouseLot | null;
}

// Incoming QC gate: every green bean lot that arrives from an approved Purchase Order sits
// here as 'pending_qc' until someone inspects it. Only a 'passed' lot is selectable by the
// roaster when creating a Work Order — this is what stops unverified stock from being roasted.
export const IncomingQCModal: React.FC<IncomingQCModalProps> = ({ isOpen, onClose, lot }) => {
  const { currentUser, submitIncomingQC } = useCoffee();

  const [scaScore, setScaScore] = useState(86);
  const [moisturePercent, setMoisturePercent] = useState(11.5);
  const [notes, setNotes] = useState('Kemasan utuh, tidak ada tanda kontaminasi atau serangga.');
  const [checkedBy, setCheckedBy] = useState('');

  useEffect(() => {
    if (lot) {
      setScaScore(lot.verifiedScaScore || 86);
      setMoisturePercent(lot.moistureContentPercent || 11.5);
      setNotes('Kemasan utuh, tidak ada tanda kontaminasi atau serangga.');
      setCheckedBy(currentUser?.name || '');
    }
  }, [lot, currentUser]);

  if (!isOpen || !lot) return null;

  const handleSubmit = (passed: boolean) => {
    submitIncomingQC(lot.id, {
      passed,
      scaScore: Number(scaScore),
      moisturePercent: Number(moisturePercent),
      notes,
      checkedBy: checkedBy || currentUser?.name || 'QC Roastery',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-stone-900 text-white px-6 py-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ClipboardCheck className="w-3.5 h-3.5" />
              QC Barang Masuk
            </div>
            <h2 className="text-lg font-bold">{lot.id}</h2>
            <p className="text-xs text-stone-400 mt-1">
              {lot.origin} — {lot.variety} • {lot.weightKg} kg dari {lot.sourceProcessorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <p className="text-stone-500">
            Verifikasi lot sebelum tersedia untuk diolah roaster. Lot yang ditolak tidak akan bisa dipilih pada
            Work Order.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">SCA Score</label>
              <input
                type="number"
                step="0.1"
                value={scaScore}
                onChange={(e) => setScaScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Kadar Air (%)</label>
              <input
                type="number"
                step="0.1"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Diperiksa Oleh</label>
            <input
              type="text"
              value={checkedBy}
              onChange={(e) => setCheckedBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Catatan Inspeksi</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Tolak Lot
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Lulus QC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
