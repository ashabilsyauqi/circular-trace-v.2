import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Printer,
  FileSpreadsheet,
  ChevronRight,
  ClipboardList,
  Sprout,
  Cog,
  Warehouse,
  Flame,
} from 'lucide-react';
import {
  StakeholderFormsModal,
  StakeholderFormType,
} from '../../../components/forms/StakeholderFormsModal';

interface StakeholderFormsPageProps {
  defaultForm?: StakeholderFormType;
}

export const StakeholderFormsPage: React.FC<StakeholderFormsPageProps> = ({ defaultForm }) => {
  const { formType } = useParams<{ formType?: string }>();

  const activeFormType: StakeholderFormType = (() => {
    if (defaultForm) return defaultForm;
    if (
      formType === 'petani' ||
      formType === 'pengolah' ||
      formType === 'gudang' ||
      formType === 'roastery'
    ) {
      return formType;
    }
    return 'petani';
  })();

  const FORM_META: Record<
    StakeholderFormType,
    { title: string; subtitle: string; icon: React.ReactNode; code: string }
  > = {
    petani: {
      title: 'Formulir Registrasi Kebun & Catatan Panen Ceri Kopi',
      subtitle: 'Standar GAP & Kepatuhan Regulasi Bebas Deforestasi EUDR (Hulu Perkebunan)',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      code: 'FORM-CCT-PETANI-01',
    },
    pengolah: {
      title: 'Formulir Penerimaan Ceri, Batch Olah & Limbah Wet Mill',
      subtitle: 'Verifikasi Rendemen, Kadar Air & Parameter 7 Metode Pengolahan',
      icon: <Cog className="w-6 h-6 text-amber-600" />,
      code: 'FORM-CCT-MILL-02',
    },
    gudang: {
      title: 'Formulir Inbound Gudang, QC Grading & Karantina Ekspor',
      subtitle: 'Standar Penyimpanan Klimatik Hermetik & Sertifikat Kesehatan Tumbuhan',
      icon: <Warehouse className="w-6 h-6 text-blue-600" />,
      code: 'FORM-CCT-GUDANG-03',
    },
    roastery: {
      title: 'Formulir Profil Sangrai & Lembar Kerja SCA Cupping',
      subtitle: 'Artisan Roasting Telemetry & Evaluasi Sensori Standar SCA 10-Atribut',
      icon: <Flame className="w-6 h-6 text-orange-600" />,
      code: 'FORM-CCT-ROASTERY-04',
    },
  };

  const meta = FORM_META[activeFormType];

  return (
    <div className="space-y-5 pb-16 print:p-0 print:m-0 print:space-y-0 print:pb-0">
      {/* 1. Header Banner (AdminLTE Style - Hidden on Print) */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden no-print">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black shadow-xs shrink-0">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {meta.code}
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">•</span>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Standar Cetak Kertas A4 Potret
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight mt-0.5">
              {meta.title}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {meta.subtitle} • Format siap cetak blanko kosong untuk survei lapangan manual oleh ICS & stakeholder.
            </p>
          </div>
        </div>

        {/* Quick Nav to other forms */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            to="/admin/petani/blanko"
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              activeFormType === 'petani'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
            }`}
          >
            Form Petani
          </Link>
          <Link
            to="/admin/pengolah/blanko"
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              activeFormType === 'pengolah'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
            }`}
          >
            Form Pengolah
          </Link>
          <Link
            to="/admin/gudang/blanko"
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              activeFormType === 'gudang'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
            }`}
          >
            Form Gudang
          </Link>
          <Link
            to="/admin/roaster/blanko"
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              activeFormType === 'roastery'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
            }`}
          >
            Form Roastery
          </Link>
        </div>
      </div>

      {/* 2. Embedded Hybrid Form (Digital Interactive + Printable A4) */}
      <StakeholderFormsModal
        isOpen={true}
        initialForm={activeFormType}
        embedded={true}
      />
    </div>
  );
};
