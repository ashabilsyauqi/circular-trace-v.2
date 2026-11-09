import React, { useState } from 'react';
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Plus,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Ct4ciCapItem } from '../../types/ct4ci';

interface Ct4ciCapTrackerProps {
  capList: Ct4ciCapItem[];
  onUpdateCapStatus: (capId: string, status: Ct4ciCapItem['status']) => void;
  onAddNewCap: (cap: Omit<Ct4ciCapItem, 'id'>) => void;
}

export const Ct4ciCapTracker: React.FC<Ct4ciCapTrackerProps> = ({
  capList,
  onUpdateCapStatus,
  onAddNewCap,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCap, setNewCap] = useState({
    checkpointId: 'P 1',
    producerId: 'BP-PROD-PLW-01',
    farmId: 'FARM-PLW-MALABAR-A',
    finding: '',
    category: 'Major' as 'Major' | 'Minor',
    correctiveAction: '',
    pic: 'Pak Joko Subagyo',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  const filteredCaps = capList.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCap.finding || !newCap.correctiveAction) return;
    onAddNewCap({
      ...newCap,
      status: 'OPEN',
    });
    setShowAddModal(false);
    setNewCap({
      checkpointId: 'P 1',
      producerId: 'BP-PROD-PLW-01',
      farmId: 'FARM-PLW-MALABAR-A',
      finding: '',
      category: 'Major',
      correctiveAction: '',
      pic: 'Pak Joko Subagyo',
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-md uppercase">
            <ListTodo className="w-3.5 h-3.5" />
            <span>Corrective Action Plan (CAP)</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
            Monitoring Tindak Lanjut & Rencana Aksi Korektif
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Daftar temuan audit ketidaksesuaian 4C yang wajib diselesaikan petani sebelum verifikasi ulang.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tindak Lanjut Manual</span>
        </button>
      </div>

      {/* Filter status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: `Semua (${capList.length})` },
          { id: 'OPEN', label: 'Belum Dikerjakan (OPEN)' },
          { id: 'IN_PROGRESS', label: 'Sedang Proses (IN_PROGRESS)' },
          { id: 'RE_VERIFIED', label: 'Terverifikasi Ulang (RE_VERIFIED)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards Table */}
      <div className="space-y-4">
        {filteredCaps.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 text-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
            Tidak ada temuan tindak lanjut pada status ini.
          </div>
        ) : (
          filteredCaps.map((cap) => (
            <div
              key={cap.id}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:border-stone-300 dark:hover:border-stone-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-stone-900 text-amber-400 font-extrabold text-xs rounded-md">
                    {cap.checkpointId}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    cap.category === 'Major'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                  }`}>
                    {cap.category} Checkpoint
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    ID: {cap.id}
                  </span>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    cap.status === 'RE_VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : cap.status === 'IN_PROGRESS'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {cap.status}
                  </span>

                  {cap.status !== 'RE_VERIFIED' && (
                    <button
                      onClick={() => onUpdateCapStatus(cap.id, 'RE_VERIFIED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verifikasi Ulang Selesai</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Temuan & Tindakan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <span className="font-bold text-stone-500 dark:text-stone-400 uppercase text-[10px] block mb-1">
                    Temuan Auditor:
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 font-medium">
                    {cap.finding}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[10px] block mb-1">
                    Tindakan Korektif (CAP):
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 font-medium">
                    {cap.correctiveAction}
                  </p>
                </div>
              </div>

              {/* Footer PIC & Deadline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>PIC: <strong>{cap.pic}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tenggat: <strong>{cap.deadline}</strong></span>
                  </span>
                </div>

                {cap.status === 'RE_VERIFIED' && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Telah Ditutup & Lolos Re-Verifikasi</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Tambah Tindak Lanjut (CAP) Baru
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">ID Checkpoint Terkait</label>
                <input
                  type="text"
                  value={newCap.checkpointId}
                  onChange={(e) => setNewCap({ ...newCap, checkpointId: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Kategori Bobot</label>
                <select
                  value={newCap.category}
                  onChange={(e) => setNewCap({ ...newCap, category: e.target.value as 'Major' | 'Minor' })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                >
                  <option value="Major">Major</option>
                  <option value="Minor">Minor</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Fakta Temuan Ketidaksesuaian</label>
                <textarea
                  rows={2}
                  value={newCap.finding}
                  onChange={(e) => setNewCap({ ...newCap, finding: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Rencana Tindakan Korektif</label>
                <textarea
                  rows={2}
                  value={newCap.correctiveAction}
                  onChange={(e) => setNewCap({ ...newCap, correctiveAction: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">PIC Penanggung Jawab</label>
                  <input
                    type="text"
                    value={newCap.pic}
                    onChange={(e) => setNewCap({ ...newCap, pic: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Batas Waktu (Tenggat)</label>
                  <input
                    type="date"
                    value={newCap.deadline}
                    onChange={(e) => setNewCap({ ...newCap, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Tindak Lanjut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
