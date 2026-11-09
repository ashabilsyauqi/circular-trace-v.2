import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Paperclip,
  Eye,
  AlertCircle,
  Lock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Ct4ciAnswerItem,
  FieldAnswerOption,
  CheckpointTheme,
  Ct4ciEvidenceFile
} from '../../types/ct4ci';
import { CT4CI_MASTER_108 } from '../../data/ct4ciMaster108';

interface Ct4ciFieldFormProps {
  answers: Record<string, Ct4ciAnswerItem>;
  onUpdateAnswer: (checkpointId: string, partial: Partial<Ct4ciAnswerItem>) => void;
  enumeratorName: string;
}

export const Ct4ciFieldForm: React.FC<Ct4ciFieldFormProps> = ({
  answers,
  onUpdateAnswer,
  enumeratorName,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnswer, setFilterAnswer] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('P 1');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Themes list
  const themes = [
    { id: 'all', label: 'Semua Tema (108)' },
    { id: 'pengelolaan usaha', label: 'Pengelolaan Usaha' },
    { id: 'integritas', label: 'Integritas & Anti-Korupsi' },
    { id: 'praktik kebun', label: 'Praktik Kebun & Lingkungan' },
    { id: 'pencatatan', label: 'Pencatatan & Buku Kas' },
    { id: 'pelatihan', label: 'Pelatihan Petani & Pekerja' },
  ];

  // Filtered checkpoints
  const filteredCheckpoints = useMemo(() => {
    return CT4CI_MASTER_108.filter((cp) => {
      // Theme
      if (selectedTheme !== 'all' && cp.theme !== selectedTheme) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = cp.id.toLowerCase().includes(q);
        const matchCriteria = cp.criteria.toLowerCase().includes(q);
        const matchQuestion = cp.fieldQuestionId.toLowerCase().includes(q);
        if (!matchId && !matchCriteria && !matchQuestion) return false;
      }
      // Answer filter
      if (filterAnswer !== 'all') {
        const curAns = answers[cp.id]?.fieldAnswer || cp.defaultInitialAnswer;
        if (curAns !== filterAnswer) return false;
      }
      return true;
    });
  }, [selectedTheme, searchQuery, filterAnswer, answers]);

  // Answer counts
  const answeredCount = Object.values(answers).filter(
    (a) => a.fieldAnswer && a.fieldAnswer !== 'Belum dinilai'
  ).length;

  const handleSetAnswer = (cpId: string, ans: FieldAnswerOption) => {
    onUpdateAnswer(cpId, { fieldAnswer: ans });
  };

  const handleAddSampleEvidence = (cpId: string) => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    ];
    const pickedUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    const currentFiles = answers[cpId]?.evidenceFiles || [];
    const newFile: Ct4ciEvidenceFile = {
      id: `EV-${cpId.replace(/\s/g, '')}-${Date.now().toString().slice(-4)}`,
      name: `Foto_Lapangan_${cpId.replace(/\s/g, '')}_${Date.now().toString().slice(-4)}.jpg`,
      url: pickedUrl,
      type: 'image/jpeg',
      timestamp: new Date().toLocaleString('id-ID'),
      isSensitive: false,
    };
    onUpdateAnswer(cpId, { evidenceFiles: [...currentFiles, newFile] });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Progress */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-md uppercase">
              Field Enumerator Edition
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Enumerator: <strong className="text-stone-800 dark:text-stone-200">{enumeratorName}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
            Form Wawancara & Observasi Lapangan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Pertanyaan disederhanakan per tema acuan 108 checkpoint untuk mempercepat wawancara petani di kebun.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
          <div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">Progress Survei:</div>
            <div className="text-lg font-bold text-amber-600">
              {answeredCount} / 108
            </div>
          </div>
          <div className="w-24 bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((answeredCount / 108) * 100)}%` }}
            />
          </div>
          <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
            {Math.round((answeredCount / 108) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        {/* Theme Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTheme === t.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Cari ID (mis: P 1, P 11) atau kata kunci pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterAnswer}
              onChange={(e) => setFilterAnswer(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none"
            >
              <option value="all">Semua Status Jawaban</option>
              <option value="Sesuai">Sesuai (Compliant)</option>
              <option value="Tidak sesuai">Tidak Sesuai (Non-Compliant)</option>
              <option value="Belum dinilai">Belum Dinilai</option>
              <option value="Tidak diketahui">Tidak Diketahui</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checkpoints Card List */}
      <div className="space-y-4">
        {filteredCheckpoints.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 text-center text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800">
            Tidak ada checkpoint yang sesuai dengan filter pencarian.
          </div>
        ) : (
          filteredCheckpoints.map((cp) => {
            const ans = answers[cp.id] || {
              checkpointId: cp.id,
              fieldAnswer: cp.defaultInitialAnswer,
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
            const isExpanded = expandedId === cp.id;

            return (
              <div
                key={cp.id}
                className={`bg-white dark:bg-stone-900 rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
                  isExpanded
                    ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                {/* Header Card */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : cp.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none bg-stone-50/50 dark:bg-stone-900/50"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-stone-800 text-amber-400 border border-stone-700">
                        {cp.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 capitalize">
                        {cp.theme}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        • {cp.dimension}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-snug">
                      {cp.criteria}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                      {cp.fieldQuestionId}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Status Pill */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      ans.fieldAnswer === 'Sesuai'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : ans.fieldAnswer === 'Tidak sesuai'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400'
                    }`}>
                      {ans.fieldAnswer}
                    </span>

                    {/* Files Count Pill */}
                    {ans.evidenceFiles.length > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{ans.evidenceFiles.length}</span>
                      </span>
                    )}

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Form Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-stone-100 dark:border-stone-800 space-y-5 bg-white dark:bg-stone-900">
                    {/* Fast Selection Buttons (Mobile thumb-friendly >= 48px) */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                        Jawaban Wawancara / Observasi:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetAnswer(cp.id, 'Sesuai')}
                          className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                            ans.fieldAnswer === 'Sesuai'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Sesuai</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetAnswer(cp.id, 'Tidak sesuai')}
                          className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                            ans.fieldAnswer === 'Tidak sesuai'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                              : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Tidak Sesuai</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetAnswer(cp.id, 'Tidak diketahui')}
                          className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                            ans.fieldAnswer === 'Tidak diketahui'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                              : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                          }`}
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Tidak Diketahui</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetAnswer(cp.id, 'Belum dinilai')}
                          className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                            ans.fieldAnswer === 'Belum dinilai'
                              ? 'bg-stone-700 text-white border-stone-700 shadow-md'
                              : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Catatan Observasi & Cara Cek */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                          Catatan Hasil Wawancara / Observasi Lapangan:
                        </label>
                        <textarea
                          rows={3}
                          value={ans.observationNotes}
                          onChange={(e) =>
                            onUpdateAnswer(cp.id, { observationNotes: e.target.value })
                          }
                          placeholder="Jelaskan kondisi riil di lapangan, temuan fisik, atau kutipan jawaban petani..."
                          className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-2">
                        <div className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-500">
                          Metode Pemeriksaan (SOP)
                        </div>
                        <p className="text-stone-600 dark:text-stone-300">
                          {cp.checkMethod}
                        </p>
                        {cp.smallholderNotes && (
                          <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-[11px] text-amber-700 dark:text-amber-400 flex items-start gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{cp.smallholderNotes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bukti Foto & Dokumen */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>Berkas Bukti / Foto Pendukung ({ans.evidenceFiles.length})</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleAddSampleEvidence(cp.id)}
                          className="px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 text-xs font-bold rounded-lg border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>+ Ambil / Unggah Foto Bukti</span>
                        </button>
                      </div>

                      {ans.evidenceFiles.length === 0 ? (
                        <div className="p-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center text-xs text-stone-400">
                          Belum ada foto/dokumen bukti terlampir untuk checkpoint ini.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {ans.evidenceFiles.map((f) => (
                            <div
                              key={f.id}
                              className="relative group rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800"
                            >
                              <img
                                src={f.url}
                                alt={f.name}
                                className="w-full h-24 object-cover"
                              />
                              <div className="p-2 text-[10px] space-y-0.5">
                                <div className="font-semibold truncate text-stone-800 dark:text-stone-200">
                                  {f.name}
                                </div>
                                <div className="text-stone-400 text-[9px]">
                                  {f.timestamp}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(f.url)}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Follow up toggle */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
                        <input
                          type="checkbox"
                          checked={ans.needFollowUp}
                          onChange={(e) =>
                            onUpdateAnswer(cp.id, { needFollowUp: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>Tandai Perlu Tindak Lanjut Lapangan Khusus</span>
                      </label>

                      <div className="text-[11px] text-stone-400">
                        Bobot Resmi: <strong>L1: {cp.level1}</strong> • <strong>L2: {cp.level2}</strong> • <strong>L3+: {cp.level3Plus}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-stone-900 border border-stone-700">
            <img src={previewImage} alt="Bukti Lapangan" className="w-full h-auto object-contain max-h-[80vh]" />
            <div className="p-3 text-center text-xs text-white bg-stone-900/90">
              Klik di mana saja untuk menutup pratinjau bukti
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
