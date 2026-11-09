import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Eye,
  Send,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen
} from 'lucide-react';
import {
  Ct4ciAnswerItem,
  ComplianceLevel,
  ApplicabilityOption,
  ValidationResultOption,
  EvidenceVerificationOption,
  Ct4ciCapItem
} from '../../types/ct4ci';
import { CT4CI_MASTER_108 } from '../../data/ct4ciMaster108';

interface Ct4ciIcsValidationProps {
  answers: Record<string, Ct4ciAnswerItem>;
  complianceLevel: ComplianceLevel;
  onUpdateAnswer: (checkpointId: string, partial: Partial<Ct4ciAnswerItem>) => void;
  onAddCapItem: (cap: Omit<Ct4ciCapItem, 'id'>) => void;
  verifierName: string;
}

export const Ct4ciIcsValidation: React.FC<Ct4ciIcsValidationProps> = ({
  answers,
  complianceLevel,
  onUpdateAnswer,
  onAddCapItem,
  verifierName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [activeCpId, setActiveCpId] = useState<string>('P 1');
  const [showStandardGuide, setShowStandardGuide] = useState(true);
  const [capCreatedNotice, setCapCreatedNotice] = useState<string | null>(null);

  // Filtered checkpoints
  const filteredList = useMemo(() => {
    return CT4CI_MASTER_108.filter((cp) => {
      const ans = answers[cp.id];
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !cp.id.toLowerCase().includes(q) &&
          !cp.criteria.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      // Mode filter
      if (filterMode === 'undecided') {
        return ans?.applicability === 'Belum ditentukan';
      }
      if (filterMode === 'unverified_evidence') {
        return ans?.applicability === 'Berlaku' && ans?.evidenceVerified === 'Belum';
      }
      if (filterMode === 'non_conform') {
        return ans?.officialResult === 'Tidak sesuai';
      }
      if (filterMode === 'major_only') {
        const weight =
          complianceLevel === '1'
            ? cp.level1
            : complianceLevel === '2'
            ? cp.level2
            : cp.level3Plus;
        return weight === 'Major';
      }
      return true;
    });
  }, [searchQuery, filterMode, answers, complianceLevel]);

  const activeCheckpoint = useMemo(() => {
    return CT4CI_MASTER_108.find((c) => c.id === activeCpId) || CT4CI_MASTER_108[0];
  }, [activeCpId]);

  const activeAnswer: Ct4ciAnswerItem = answers[activeCheckpoint.id] || {
    checkpointId: activeCheckpoint.id,
    fieldAnswer: activeCheckpoint.defaultInitialAnswer,
    observationNotes: '',
    evidenceFiles: [],
    needFollowUp: false,
    applicability: 'Belum ditentukan',
    naReason: '',
    officialResult: 'Belum dinilai',
    evidenceVerified: 'Belum',
    verifierNotes: '',
    correctiveActionRequired: '',
    deadline: '',
  };

  const activeWeight =
    complianceLevel === '1'
      ? activeCheckpoint.level1
      : complianceLevel === '2'
      ? activeCheckpoint.level2
      : activeCheckpoint.level3Plus;

  const handleCreateCap = () => {
    if (!activeAnswer.verifierNotes && !activeAnswer.correctiveActionRequired) {
      alert('Mohon isi catatan temuan dan tindakan korektif terlebih dahulu.');
      return;
    }
    onAddCapItem({
      checkpointId: activeCheckpoint.id,
      producerId: 'BP-PROD-PLW-01',
      farmId: 'FARM-PLW-MALABAR-A',
      finding: activeAnswer.verifierNotes || activeAnswer.observationNotes || 'Temuan ketidaksesuaian audit lapangan.',
      category: activeWeight,
      correctiveAction: activeAnswer.correctiveActionRequired || 'Tindakan perbaikan wajib segera dilaksanakan sesuai SOP 4C.',
      pic: 'Petani & Pendamping Lapangan',
      deadline: activeAnswer.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'OPEN',
    });
    setCapCreatedNotice(`Tindak lanjut CAP untuk ${activeCheckpoint.id} berhasil ditambahkan ke daftar monitoring.`);
    setTimeout(() => setCapCreatedNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md uppercase">
              ICS Verifier Workbench
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Verifikator ICS: <strong className="text-stone-800 dark:text-stone-200">{verifierName}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
            Validasi Kepatuhan & Pemeriksaan Bukti 4C
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Memeriksa keabsahan bukti dokumen, memutuskan klausul Applicability/Smallholder, dan menetapkan skor resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Target Level:</span>
          <span className="px-3 py-1 bg-amber-600 text-white font-bold text-xs rounded-lg shadow-sm">
            Compliance Level {complianceLevel}
          </span>
        </div>
      </div>

      {capCreatedNotice && (
        <div className="p-4 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{capCreatedNotice}</span>
          </div>
          <button onClick={() => setCapCreatedNotice(null)} className="text-xs underline">
            Tutup
          </button>
        </div>
      )}

      {/* Main Split Layout: Left List & Right Detail Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List Checkpoints (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari Checkpoint (mis: P 1, P 11)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Semua (108)' },
                { id: 'undecided', label: 'Belum Ditentukan' },
                { id: 'unverified_evidence', label: 'Bukti Belum Cek' },
                { id: 'non_conform', label: 'Tidak Sesuai' },
                { id: 'major_only', label: 'Khusus Major' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                    filterMode === f.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredList.map((cp) => {
              const ans = answers[cp.id];
              const isSelected = activeCpId === cp.id;
              const weight =
                complianceLevel === '1'
                  ? cp.level1
                  : complianceLevel === '2'
                  ? cp.level2
                  : cp.level3Plus;

              return (
                <div
                  key={cp.id}
                  onClick={() => setActiveCpId(cp.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                        {cp.id}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        weight === 'Major'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                      }`}>
                        {weight}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ans?.officialResult === 'Sesuai'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : ans?.officialResult === 'Tidak sesuai'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400'
                    }`}>
                      {ans?.officialResult || 'Belum dinilai'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1.5 line-clamp-1">
                    {cp.criteria}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2 pt-1.5 border-t border-stone-100 dark:border-stone-800">
                    <span>Applicability: {ans?.applicability || 'Belum ditentukan'}</span>
                    <span>Bukti: {ans?.evidenceVerified || 'Belum'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Workbench Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            {/* Header Checkpoint Review */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 bg-stone-900 text-amber-400 font-extrabold text-sm rounded-lg">
                    {activeCheckpoint.id}
                  </span>
                  <span className="text-xs text-stone-500">
                    {activeCheckpoint.dimension}
                  </span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                    activeWeight === 'Major'
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}>
                    Level {complianceLevel}: {activeWeight} Checkpoint
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mt-2">
                  {activeCheckpoint.criteria}
                </h3>
              </div>
            </div>

            {/* Official 4C Standard Box */}
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-4 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Official 4C Checklist v4.1 Requirement</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowStandardGuide(!showStandardGuide)}
                  className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                >
                  {showStandardGuide ? 'Sembunyikan' : 'Tampilkan Detail'}
                </button>
              </div>

              {showStandardGuide && (
                <div className="space-y-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                  <div>
                    <strong className="text-stone-900 dark:text-white block mb-0.5">
                      Teks Resmi (EN):
                    </strong>
                    <p className="italic bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700">
                      "{activeCheckpoint.officialTextEn}"
                    </p>
                  </div>

                  {activeCheckpoint.verificationGuidanceEn && (
                    <div>
                      <strong className="text-stone-900 dark:text-white block mb-0.5">
                        Verification Guidance:
                      </strong>
                      <p className="bg-white dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 line-clamp-4 hover:line-clamp-none transition-all">
                        {activeCheckpoint.verificationGuidanceEn}
                      </p>
                    </div>
                  )}

                  {activeCheckpoint.smallholderNotes && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <strong>Catatan Smallholder:</strong> {activeCheckpoint.smallholderNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inputan Observasi Enumerator Sebelumnya */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200 dark:border-stone-700/80 text-xs space-y-2">
              <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                <span>Catatan Lapangan Enumerator:</span>
                <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-300">
                  Jawaban: {activeAnswer.fieldAnswer}
                </span>
              </div>
              <p className="text-stone-600 dark:text-stone-300 italic">
                {activeAnswer.observationNotes || '(Belum ada catatan observasi lapangan)'}
              </p>

              {/* Bukti Foto Terlampir */}
              <div className="pt-2">
                <span className="font-semibold block mb-1">
                  Bukti Terlampir ({activeAnswer.evidenceFiles.length}):
                </span>
                {activeAnswer.evidenceFiles.length === 0 ? (
                  <span className="text-stone-400">Tidak ada lampiran bukti.</span>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {activeAnswer.evidenceFiles.map((f) => (
                      <div key={f.id} className="w-20 shrink-0">
                        <img
                          src={f.url}
                          alt={f.name}
                          className="w-20 h-16 object-cover rounded-lg border"
                        />
                        <div className="text-[9px] truncate mt-0.5">{f.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Keputusan ICS Verifier */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Keputusan Audit ICS Verifikator</span>
              </h4>

              {/* 1. Applicability */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  1. Apakah Checkpoint Berlaku? (Applicability):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Berlaku', label: 'Berlaku (Applicable)' },
                    { id: 'Tidak Berlaku (NA Smallholder)', label: 'NA (Pengecualian Smallholder)' },
                    { id: 'Tidak Berlaku (Lainnya)', label: 'NA (Tidak Relevan)' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        onUpdateAnswer(activeCheckpoint.id, {
                          applicability: opt.id as ApplicabilityOption,
                        })
                      }
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-left flex items-center gap-2 ${
                        activeAnswer.applicability === opt.id
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {activeAnswer.applicability.includes('Tidak Berlaku') && (
                  <div className="mt-2">
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                      Dasar Alasan NA / Pengecualian Smallholder (Wajib diisi sesuai klausul 4C):
                    </label>
                    <input
                      type="text"
                      value={activeAnswer.naReason}
                      onChange={(e) =>
                        onUpdateAnswer(activeCheckpoint.id, { naReason: e.target.value })
                      }
                      placeholder="Sebutkan rujukan klausul NA 4C v4.1..."
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 2. Verifikasi Bukti */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  2. Status Verifikasi Bukti (Evidence Validity):
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAnswer(activeCheckpoint.id, {
                        evidenceVerified:
                          activeAnswer.evidenceVerified === 'Sudah' ? 'Belum' : 'Sudah',
                      })
                    }
                    className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all ${
                      activeAnswer.evidenceVerified === 'Sudah'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {activeAnswer.evidenceVerified === 'Sudah'
                        ? 'Bukti Sah & Terverifikasi'
                        : 'Tandai Bukti Terverifikasi'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. Hasil Resmi Audit */}
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  3. Keputusan Resmi Kepatuhan:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAnswer(activeCheckpoint.id, { officialResult: 'Sesuai' })
                    }
                    className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      activeAnswer.officialResult === 'Sesuai'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Sesuai (Compliant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateAnswer(activeCheckpoint.id, { officialResult: 'Tidak sesuai' })
                    }
                    className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      activeAnswer.officialResult === 'Tidak sesuai'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Sesuai (Non-Compliant)</span>
                  </button>
                </div>
              </div>

              {/* If Tidak Sesuai: Action required and CAP creation */}
              {activeAnswer.officialResult === 'Tidak sesuai' && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-3">
                  <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Temuan Ketidaksesuaian & Instruksi Tindak Lanjut (CAP):</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                      Deskripsi Temuan Auditor:
                    </label>
                    <textarea
                      rows={2}
                      value={activeAnswer.verifierNotes}
                      onChange={(e) =>
                        onUpdateAnswer(activeCheckpoint.id, { verifierNotes: e.target.value })
                      }
                      placeholder="Jelaskan klausul yang dilanggar dan fakta temuan..."
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                      Tindakan Korektif yang Wajib Dilakukan Petani:
                    </label>
                    <input
                      type="text"
                      value={activeAnswer.correctiveActionRequired}
                      onChange={(e) =>
                        onUpdateAnswer(activeCheckpoint.id, {
                          correctiveActionRequired: e.target.value,
                        })
                      }
                      placeholder="Contoh: Buat pembukuan kas 4C, lengkapi APD pestisida..."
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Tenggat Waktu:
                      </label>
                      <input
                        type="date"
                        value={activeAnswer.deadline}
                        onChange={(e) =>
                          onUpdateAnswer(activeCheckpoint.id, { deadline: e.target.value })
                        }
                        className="px-2 py-1 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateCap}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Simpan ke Rencana Aksi (CAP)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
