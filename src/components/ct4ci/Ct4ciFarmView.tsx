import React, { useState, useEffect, useMemo } from 'react';
import {
  FileBadge,
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  ListTodo,
  Download,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ArrowLeft,
  Share2
} from 'lucide-react';
import {
  ComplianceLevel,
  Ct4ciProducerProfile,
  Ct4ciAnswerItem,
  Ct4ciCapItem
} from '../../types/ct4ci';
import {
  INITIAL_PRODUCER_PROFILE,
  INITIAL_CAP_LIST,
  getInitialAnswerStore,
  calculateAuditMetrics
} from '../../data/mockCt4ciData';
import { CT4CI_MASTER_108 } from '../../data/ct4ciMaster108';
import { useCoffee } from '../../context/CoffeeContext';
import { Ct4ciDashboard } from './Ct4ciDashboard';
import { Ct4ciRegistration } from './Ct4ciRegistration';
import { Ct4ciFieldForm } from './Ct4ciFieldForm';
import { Ct4ciIcsValidation } from './Ct4ciIcsValidation';
import { Ct4ciCapTracker } from './Ct4ciCapTracker';

const LOCAL_STORAGE_KEY_ANSWERS = 'ct4ci_answers_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'ct4ci_profile_v1';
const LOCAL_STORAGE_KEY_CAP = 'ct4ci_caps_v1';

export const Ct4ciFarmView: React.FC<{ onBackToHome?: () => void }> = ({ onBackToHome }) => {
  const { currentUser } = useCoffee();
  const [activeTab, setActiveTabState] = useState<
    'dashboard' | 'registration' | 'field_form' | 'ics_validation' | 'cap'
  >(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const t = urlParams.get('tab');
      if (t === 'registration' || t === 'field_form' || t === 'ics_validation' || t === 'cap') {
        return t;
      }
    }
    return 'dashboard';
  });

  const setActiveTab = (tab: 'dashboard' | 'registration' | 'field_form' | 'ics_validation' | 'cap') => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'dashboard') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const [complianceLevel, setComplianceLevel] = useState<ComplianceLevel>('1');

  // Profile State
  const [profile, setProfile] = useState<Ct4ciProducerProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCER_PROFILE;
  });

  // Answers State
  const [answers, setAnswers] = useState<Record<string, Ct4ciAnswerItem>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ANSWERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return getInitialAnswerStore();
  });

  // CAP List State
  const [capList, setCapList] = useState<Ct4ciCapItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CAP);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CAP_LIST;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch {}
  }, [answers]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CAP, JSON.stringify(capList));
    } catch {}
  }, [capList]);

  // Calculated Metrics
  const metrics = useMemo(() => {
    return calculateAuditMetrics(answers, complianceLevel);
  }, [answers, complianceLevel]);

  // Update single answer
  const handleUpdateAnswer = (
    checkpointId: string,
    partial: Partial<Ct4ciAnswerItem>
  ) => {
    setAnswers((prev) => {
      const existing = prev[checkpointId] || {
        checkpointId,
        fieldAnswer: 'Belum dinilai',
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
      return {
        ...prev,
        [checkpointId]: {
          ...existing,
          ...partial,
        },
      };
    });
  };

  // Add CAP Item
  const handleAddCapItem = (newCap: Omit<Ct4ciCapItem, 'id'>) => {
    const item: Ct4ciCapItem = {
      ...newCap,
      id: `CAP-${Date.now().toString().slice(-6)}`,
    };
    setCapList((prev) => [item, ...prev]);
  };

  const handleUpdateCapStatus = (capId: string, status: Ct4ciCapItem['status']) => {
    setCapList((prev) =>
      prev.map((c) => (c.id === capId ? { ...c, status } : c))
    );
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'Checkpoint ID',
      'Dimension',
      'Criteria',
      'Level 1',
      'Level 2',
      'Level 3+',
      'Field Answer',
      'Applicability',
      'NA Reason',
      'Evidence Verified',
      'Official Result',
      'Verifier Notes',
    ];

    const rows = CT4CI_MASTER_108.map((cp) => {
      const a = answers[cp.id];
      return [
        `"${cp.id}"`,
        `"${cp.dimension}"`,
        `"${cp.criteria.replace(/"/g, '""')}"`,
        `"${cp.level1}"`,
        `"${cp.level2}"`,
        `"${cp.level3Plus}"`,
        `"${a?.fieldAnswer || ''}"`,
        `"${a?.applicability || ''}"`,
        `"${(a?.naReason || '').replace(/"/g, '""')}"`,
        `"${a?.evidenceVerified || ''}"`,
        `"${a?.officialResult || ''}"`,
        `"${(a?.verifierNotes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CT4CI_Audit_Export_${profile.producerId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Kembali ke Portal Utama"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
              <FileBadge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-stone-900 dark:text-white">
                  CT-4CI Farm
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  v3.1
                </span>
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {profile.farmerName} • {profile.producerId}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak SOP</span>
          </button>
        </div>
      </header>

      {/* Main Tab Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {[
            { id: 'dashboard', label: 'Dashboard Pra-Audit', icon: LayoutDashboard },
            { id: 'registration', label: '1. Registrasi 4C', icon: FileBadge },
            { id: 'field_form', label: '2. Form Lapangan (Enumerator)', icon: ClipboardList },
            { id: 'ics_validation', label: '3. Validasi ICS (Verifikator)', icon: CheckSquare },
            { id: 'cap', label: `4. Tindak Lanjut CAP (${capList.filter(c => c.status !== 'RE_VERIFIED').length})`, icon: ListTodo },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {activeTab === 'dashboard' && (
          <Ct4ciDashboard
            metrics={metrics}
            complianceLevel={complianceLevel}
            onLevelChange={setComplianceLevel}
            onNavigateTab={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'registration' && (
          <Ct4ciRegistration
            profile={profile}
            onSaveProfile={(p) => setProfile(p)}
          />
        )}

        {activeTab === 'field_form' && (
          <Ct4ciFieldForm
            answers={answers}
            onUpdateAnswer={handleUpdateAnswer}
            enumeratorName={profile.enumeratorName}
          />
        )}

        {activeTab === 'ics_validation' && (
          <Ct4ciIcsValidation
            answers={answers}
            complianceLevel={complianceLevel}
            onUpdateAnswer={handleUpdateAnswer}
            onAddCapItem={handleAddCapItem}
            verifierName={profile.icsVerifierName}
          />
        )}

        {activeTab === 'cap' && (
          <Ct4ciCapTracker
            capList={capList}
            onUpdateCapStatus={handleUpdateCapStatus}
            onAddNewCap={handleAddCapItem}
          />
        )}
      </main>
    </div>
  );
};
