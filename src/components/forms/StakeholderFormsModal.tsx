import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  ClipboardList,
  RotateCcw,
  Sparkles,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export type StakeholderFormType = 'petani' | 'pengolah' | 'gudang' | 'roastery';

interface StakeholderFormsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialForm?: StakeholderFormType;
  embedded?: boolean;
}

// ============================================================================
// HELPER COMPONENTS FOR DIGITAL + PRINTABLE HYBRID FORMS
// ============================================================================

interface PrintableInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  blankMode?: boolean;
}

const PrintableInput: React.FC<PrintableInputProps> = ({
  value,
  onChange,
  placeholder = '....................',
  className = '',
  blankMode = false,
}) => (
  <input
    type="text"
    value={blankMode ? '' : value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`bg-transparent border-b border-dotted border-stone-400 focus:border-stone-900 focus:bg-amber-50/50 focus:outline-hidden text-xs text-stone-900 font-semibold px-1 py-0.5 placeholder:text-stone-300 placeholder:italic print:placeholder:text-transparent print:border-b print:border-solid print:border-stone-800 print:text-black print:bg-transparent ${className}`}
  />
);

interface PrintableCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  blankMode?: boolean;
  className?: string;
}

const PrintableCheckbox: React.FC<PrintableCheckboxProps> = ({
  checked,
  onChange,
  label,
  blankMode = false,
  className = '',
}) => {
  const isChecked = blankMode ? false : checked;
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 cursor-pointer select-none text-left py-0.5 px-1 rounded-sm hover:bg-stone-100 transition-colors ${className}`}
      title="Klik untuk centang / lepas centang secara digital"
    >
      <span
        className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center text-[10px] font-black transition-colors shrink-0 print:border-stone-950 ${
          isChecked
            ? 'bg-stone-900 text-white border-stone-900 print:bg-stone-900 print:text-white print:border-stone-950'
            : 'bg-white border-stone-400 text-transparent print:bg-white print:border-stone-800'
        }`}
      >
        ✓
      </span>
      <span className="text-stone-800 text-xs print:text-black print:font-medium">{label}</span>
    </button>
  );
};

// ============================================================================
// STATE INTERFACES & SAMPLE DATA
// ============================================================================

interface FormPetaniState {
  namaPetani: string;
  nik: string;
  kelompokTani: string;
  namaBlok: string;
  desa: string;
  ketinggian: string;
  luasLahan: string;
  jumlahPohon: string;
  tahunTanam: string;
  lat: string;
  long: string;
  varietas: Record<string, boolean>;
  varietasLainnya: string;
  sistemBudidaya: Record<string, boolean>;
  jenisPupuk: Record<string, boolean>;
  sertifikasi: Record<string, boolean>;
  sertifikasiLainnya: string;
  eudrDeforestationFree: boolean;
  harvestRows: Array<{
    no: number;
    tgl: string;
    blok: string;
    varietas: string;
    berat: string;
    persenMerah: string;
    brix: string;
    float: string;
    ket: string;
    paraf: string;
  }>;
  ttdPetani: string;
  ttdPetugas: string;
  ttdKetua: string;
}

const emptyPetani: FormPetaniState = {
  namaPetani: '',
  nik: '',
  kelompokTani: '',
  namaBlok: '',
  desa: '',
  ketinggian: '',
  luasLahan: '',
  jumlahPohon: '',
  tahunTanam: '',
  lat: '',
  long: '',
  varietas: {},
  varietasLainnya: '',
  sistemBudidaya: {},
  jenisPupuk: {},
  sertifikasi: {},
  sertifikasiLainnya: '',
  eudrDeforestationFree: false,
  harvestRows: [
    { no: 1, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
    { no: 2, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
    { no: 3, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
    { no: 4, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
    { no: 5, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
  ],
  ttdPetani: '',
  ttdPetugas: '',
  ttdKetua: '',
};

const samplePetani: FormPetaniState = {
  namaPetani: 'Asep Supriatna',
  nik: '3204281204850002',
  kelompokTani: 'KT Rahayu Mukti Pangalengan',
  namaBlok: 'Blok Pasir Kunci (Gunung Tilu)',
  desa: 'Desa Margamukti, Kec. Pangalengan, Bandung',
  ketinggian: '1550',
  luasLahan: '2.5',
  jumlahPohon: '3200',
  tahunTanam: '2018',
  lat: '-7.175402',
  long: '107.568910',
  varietas: {
    'Typica Java Preanger': true,
    'Ateng Super': true,
    'Sigarar Utang': true,
  },
  varietasLainnya: '',
  sistemBudidaya: { 'Agroforestri (Naungan Pohon Hutan/Buah)': true },
  jenisPupuk: { '100% Organik (Kompos / Kohe)': true },
  sertifikasi: {
    'Certificate Organic': true,
    'Certificate GAP': true,
  },
  sertifikasiLainnya: '',
  eudrDeforestationFree: true,
  harvestRows: [
    { no: 1, tgl: '2026-09-12', blok: 'Blok A-1', varietas: 'Typica', berat: '420', persenMerah: '96%', brix: '21.5', float: '3%', ket: 'Ceri segar petik merah prima', paraf: 'AS' },
    { no: 2, tgl: '2026-09-15', blok: 'Blok A-2', varietas: 'Ateng Super', berat: '380', persenMerah: '95%', brix: '22.0', float: '2%', ket: 'Kondisi mulus & brix tinggi', paraf: 'AS' },
    { no: 3, tgl: '2026-09-18', blok: 'Blok B-1', varietas: 'Sigarar Utang', berat: '450', persenMerah: '97%', brix: '21.0', float: '4%', ket: 'Sortasi air petik pagi', paraf: 'AS' },
    { no: 4, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
    { no: 5, tgl: '', blok: '', varietas: '', berat: '', persenMerah: '', brix: '', float: '', ket: '', paraf: '' },
  ],
  ttdPetani: 'Asep Supriatna',
  ttdPetugas: 'Dedi Kurniawan, S.P.',
  ttdKetua: 'H. Suryana (Ketua Poktan)',
};

interface FormPengolahState {
  batchId: string;
  tglWaktu: string;
  namaPetani: string;
  asalKebun: string;
  beratCeri: string;
  hargaBeli: string;
  brix: string;
  persenMerah: string;
  floaters: string;
  metodeOlah: Record<string, boolean>;
  metodeOlahLainnya: string;
  durasiFermentasi: string;
  phAkhir: string;
  suhuAir: string;
  metodeJemur: Record<string, boolean>;
  lamaJemur: string;
  targetKadarAir: string;
  kulitCeri: Record<string, boolean>;
  kulitTanduk: Record<string, boolean>;
  airLimbah: Record<string, boolean>;
  idGreenBean: string;
  beratGreenBean: string;
  rendemen: string;
  kadarAir: string;
  waterActivity: string;
  defect: string;
  gradeMutu: Record<string, boolean>;
  hargaJual: string;
  ttdOperator: string;
  ttdIcs: string;
  ttdKepala: string;
}

const emptyPengolah: FormPengolahState = {
  batchId: '',
  tglWaktu: '',
  namaPetani: '',
  asalKebun: '',
  beratCeri: '',
  hargaBeli: '',
  brix: '',
  persenMerah: '',
  floaters: '',
  metodeOlah: {},
  metodeOlahLainnya: '',
  durasiFermentasi: '',
  phAkhir: '',
  suhuAir: '',
  metodeJemur: {},
  lamaJemur: '',
  targetKadarAir: '',
  kulitCeri: {},
  kulitTanduk: {},
  airLimbah: {},
  idGreenBean: '',
  beratGreenBean: '',
  rendemen: '',
  kadarAir: '',
  waterActivity: '',
  defect: '',
  gradeMutu: {},
  hargaJual: '',
  ttdOperator: '',
  ttdIcs: '',
  ttdKepala: '',
};

const samplePengolah: FormPengolahState = {
  batchId: 'BATCH-MLB-2026-09-001',
  tglWaktu: '2026-09-18 14:30 WIB',
  namaPetani: 'Asep Supriatna',
  asalKebun: 'Margamukti, Pangalengan (1550 mdpl)',
  beratCeri: '1250',
  hargaBeli: '14500',
  brix: '21.5',
  persenMerah: '96',
  floaters: '3',
  metodeOlah: {
    'Anaerobic Honey': true,
    'Anaerobic Natural': false,
  },
  metodeOlahLainnya: '',
  durasiFermentasi: '72',
  phAkhir: '4.2',
  suhuAir: '19.5',
  metodeJemur: { 'Solar Dryer Dome / Greenhouse': true },
  lamaJemur: '14',
  targetKadarAir: '11.5',
  kulitCeri: { 'Teh Cascara Pangan': true, 'Pupuk Kompos Organik Kebun': true },
  kulitTanduk: { Parchment: true, 'Arang / Briket': true },
  airLimbah: { 'Bak Filtrasi Biologis / Wetland': true },
  idGreenBean: 'GB-MLB-2026-0918',
  beratGreenBean: '210',
  rendemen: '16.8',
  kadarAir: '11.2',
  waterActivity: '0.58',
  defect: '4',
  gradeMutu: { 'Specialty Grade 1': true },
  hargaJual: '135000',
  ttdOperator: 'Iwan Ridwan',
  ttdIcs: 'Rahmat Hidayat, S.P. (Auditor ICS)',
  ttdKepala: 'Hendra Gunawan, S.T.',
};

interface FormGudangState {
  idLot: string;
  tglMasuk: string;
  refGb: string;
  stasiunAsal: string;
  petaniAsal: string;
  varietasMetode: string;
  beratInbound: string;
  hargaModal: string;
  lokasiPallet: string;
  suhuRuang: string;
  kelembaban: string;
  jenisKemasan: Record<string, boolean>;
  jenisKemasanLainnya: string;
  skorCupping: string;
  kadarAir: string;
  waterActivity: string;
  tierMutu: Record<string, boolean>;
  hargaJualExw: string;
  nomorPhyto: string;
  statusKarantina: Record<string, boolean>;
  pelabuhanMuat: string;
  negaraTujuan: string;
  ttdSupervisor: string;
  ttdIcs: string;
  ttdKarantina: string;
}

const emptyGudang: FormGudangState = {
  idLot: '',
  tglMasuk: '',
  refGb: '',
  stasiunAsal: '',
  petaniAsal: '',
  varietasMetode: '',
  beratInbound: '',
  hargaModal: '',
  lokasiPallet: '',
  suhuRuang: '',
  kelembaban: '',
  jenisKemasan: {},
  jenisKemasanLainnya: '',
  skorCupping: '',
  kadarAir: '',
  waterActivity: '',
  tierMutu: {},
  hargaJualExw: '',
  nomorPhyto: '',
  statusKarantina: {},
  pelabuhanMuat: '',
  negaraTujuan: '',
  ttdSupervisor: '',
  ttdIcs: '',
  ttdKarantina: '',
};

const sampleGudang: FormGudangState = {
  idLot: 'WH-GDG-2026-0925',
  tglMasuk: '2026-09-25',
  refGb: 'GB-MLB-2026-0918',
  stasiunAsal: 'Malabar Mountain Wet & Dry Mill',
  petaniAsal: 'Asep Supriatna / Pangalengan',
  varietasMetode: 'Ateng Super & Typica (Anaerobic Honey)',
  beratInbound: '210',
  hargaModal: '135000',
  lokasiPallet: 'Pallet B-04 / Ruang Klimatik A',
  suhuRuang: '19.5',
  kelembaban: '55',
  jenisKemasan: { 'GrainPro + Karung Goni 60kg': true },
  jenisKemasanLainnya: '',
  skorCupping: '87.25',
  kadarAir: '11.0',
  waterActivity: '0.57',
  tierMutu: { 'Tier 1: Super Specialty (SCA 86+)': true },
  hargaJualExw: '165000',
  nomorPhyto: 'KT-9/ID/2026/0942',
  statusKarantina: { 'Lolos Bebas Serangga & OPTK': true },
  pelabuhanMuat: 'Tanjung Priok, Jakarta',
  negaraTujuan: 'Hamburg, Jerman (EUDR Compliant)',
  ttdSupervisor: 'Bambang Triyono',
  ttdIcs: 'Siti Aminah, S.T. (QA / ICS Gudang)',
  ttdKarantina: 'Dr. Ir. Suryadi (Karantina Tumbuhan)',
};

interface FormRoasteryState {
  batchId: string;
  tglRoast: string;
  lotGb: string;
  varietasAsal: string;
  mesinRoaster: string;
  roastMaster: string;
  kapasitasBatch: string;
  chargeTemp: string;
  turningPoint: string;
  firstCrack: string;
  dropTemp: string;
  totalWaktu: string;
  dtr: string;
  beratRoasted: string;
  weightLoss: string;
  tingkatSangrai: Record<string, boolean>;
  agtron: string;
  scores: {
    aroma: string;
    flavor: string;
    aftertaste: string;
    acidity: string;
    body: string;
    balance: string;
    uniformity: string;
    cleanCup: string;
    sweetness: string;
    overall: string;
  };
  defects: string;
  totalScore: string;
  tastingNotes: string;
  restingDays: string;
  ttdRoastmaster: string;
  ttdQGrader: string;
  ttdHeadQa: string;
}

const emptyRoastery: FormRoasteryState = {
  batchId: '',
  tglRoast: '',
  lotGb: '',
  varietasAsal: '',
  mesinRoaster: '',
  roastMaster: '',
  kapasitasBatch: '',
  chargeTemp: '',
  turningPoint: '',
  firstCrack: '',
  dropTemp: '',
  totalWaktu: '',
  dtr: '',
  beratRoasted: '',
  weightLoss: '',
  tingkatSangrai: {},
  agtron: '',
  scores: {
    aroma: '',
    flavor: '',
    aftertaste: '',
    acidity: '',
    body: '',
    balance: '',
    uniformity: '',
    cleanCup: '',
    sweetness: '',
    overall: '',
  },
  defects: '',
  totalScore: '',
  tastingNotes: '',
  restingDays: '',
  ttdRoastmaster: '',
  ttdQGrader: '',
  ttdHeadQa: '',
};

const sampleRoastery: FormRoasteryState = {
  batchId: 'RST-2026-10-004',
  tglRoast: '2026-10-02',
  lotGb: 'WH-GDG-2026-0925',
  varietasAsal: 'Java Pangalengan Ateng Super Honey',
  mesinRoaster: 'Giesen W6A Artisan Computerized',
  roastMaster: 'Agus Roastmaster',
  kapasitasBatch: '5.0',
  chargeTemp: '195',
  turningPoint: '92',
  firstCrack: '198',
  dropTemp: '208',
  totalWaktu: '10:45',
  dtr: '15.2',
  beratRoasted: '4.28',
  weightLoss: '14.4',
  tingkatSangrai: { 'Medium': true },
  agtron: '64 / 78',
  scores: {
    aroma: '8.75',
    flavor: '8.75',
    aftertaste: '8.50',
    acidity: '8.75',
    body: '8.50',
    balance: '8.50',
    uniformity: '10.0',
    cleanCup: '10.0',
    sweetness: '10.0',
    overall: '8.75',
  },
  defects: '0',
  totalScore: '87.50',
  tastingNotes: 'Jasmine, White Peach, Wild Honeycomb, Bergamot, Silky Tea-like Body',
  restingDays: '7',
  ttdRoastmaster: 'Agus Roastmaster',
  ttdQGrader: 'Rian Santoso (Q-Arabica Grader)',
  ttdHeadQa: 'Maya Anggraini (Head of Roastery QA)',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const StakeholderFormsModal: React.FC<StakeholderFormsModalProps> = ({
  isOpen = false,
  onClose,
  initialForm = 'petani',
  embedded = false,
}) => {
  const [activeForm, setActiveForm] = useState<StakeholderFormType>(initialForm);
  const [printBlankMode, setPrintBlankMode] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  // Form states
  const [fPetani, setFPetani] = useState<FormPetaniState>(emptyPetani);
  const [fPengolah, setFPengolah] = useState<FormPengolahState>(emptyPengolah);
  const [fGudang, setFGudang] = useState<FormGudangState>(emptyGudang);
  const [fRoastery, setFRoastery] = useState<FormRoasteryState>(emptyRoastery);

  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if ((isOpen || embedded) && initialForm) {
      setActiveForm(initialForm);
    }
  }, [isOpen, embedded, initialForm]);

  // Pre-generate official QR Codes for all blanko forms
  useEffect(() => {
    const host = typeof window !== 'undefined' ? window.location.origin : 'https://circularcoffee.circulartrace.id';
    const formMeta: Record<StakeholderFormType, string> = {
      petani: 'FORM-CCT-PETANI-01',
      pengolah: 'FORM-CCT-MILL-02',
      gudang: 'FORM-CCT-GUDANG-03',
      roastery: 'FORM-CCT-ROASTERY-04',
    };

    (Object.keys(formMeta) as StakeholderFormType[]).forEach(async (key) => {
      try {
        const code = formMeta[key];
        const verifyUrl = `${host}/?docCode=${code}&verified=1`;
        const dataUrl = await QRCode.toDataURL(verifyUrl, {
          width: 140,
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCodeDataUrls((prev) => ({ ...prev, [key]: dataUrl }));
      } catch (err) {
        console.error('Failed to generate form QR:', err);
      }
    });
  }, []);

  // Ensure printing-blanko class is removed immediately when print dialog closes
  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-blanko');
      setPrintBlankMode(false);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  if (!isOpen && !embedded) return null;

  // Print with current filled values
  const handlePrintFilled = () => {
    setPrintBlankMode(false);
    document.body.classList.add('printing-blanko');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-blanko');
      }, 1000);
    }, 150);
  };

  // Print 100% blank form for gaptek farmers
  const handlePrintBlank = () => {
    setPrintBlankMode(true);
    document.body.classList.add('printing-blanko');
    setNotification('Menyiapkan format blanko kosong untuk dicetak...');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setPrintBlankMode(false);
        document.body.classList.remove('printing-blanko');
        setNotification('');
      }, 1000);
    }, 200);
  };

  // Reset active form
  const handleResetCurrentForm = () => {
    if (activeForm === 'petani') setFPetani(emptyPetani);
    if (activeForm === 'pengolah') setFPengolah(emptyPengolah);
    if (activeForm === 'gudang') setFGudang(emptyGudang);
    if (activeForm === 'roastery') setFRoastery(emptyRoastery);
    setNotification('Isian form berhasil dikosongkan.');
    setTimeout(() => setNotification(''), 2500);
  };

  // Autofill sample data for active form
  const handleFillSample = () => {
    if (activeForm === 'petani') setFPetani(samplePetani);
    if (activeForm === 'pengolah') setFPengolah(samplePengolah);
    if (activeForm === 'gudang') setFGudang(sampleGudang);
    if (activeForm === 'roastery') setFRoastery(sampleRoastery);
    setNotification('Data contoh berhasil dimuat ke formulir digital.');
    setTimeout(() => setNotification(''), 2500);
  };

  const modalContent = (
    <div className={`relative bg-stone-100 rounded-3xl max-w-5xl w-full border border-stone-300 overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none print:bg-white print:overflow-visible ${embedded ? 'my-0 shadow-md border-stone-200' : 'my-4 shadow-2xl'}`}>
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 print:hidden no-print sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white">
                  Formulir Digital &amp; Blanko Cetak A4
                </h3>
                <span className="text-[10px] uppercase font-bold bg-emerald-500 text-stone-950 px-2 py-0.5 rounded-full">
                  Bisa Diisi Digital
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                  Siap Cetak A4
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Isi form secara digital atau cetak blanko kosong untuk diisi manual dengan pulpen.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Demo Autofill */}
            <button
              onClick={handleFillSample}
              type="button"
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/30"
              title="Isi contoh data otomatis untuk demo"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi Contoh</span>
            </button>

            {/* Clear button */}
            <button
              onClick={handleResetCurrentForm}
              type="button"
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-700"
              title="Kosongkan semua isian pada formulir saat ini"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Print Blank Form (for offline farmers) */}
            <button
              onClick={handlePrintBlank}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-stone-600 shadow-sm"
              title="Cetak lembar formulir kosong tanpa isian agar petani dapat mengisi manual dengan pulpen"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Cetak Blanko Kosong</span>
            </button>

            {/* Print Filled Form */}
            <button
              onClick={handlePrintFilled}
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Cetak form beserta data digital yang sudah diisi"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Form Terisi</span>
            </button>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stakeholder Tab Switcher (Hidden on Print) */}
        <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto print:hidden no-print">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 shrink-0">
              Pilih Lembar Form:
            </span>
            <button
              onClick={() => setActiveForm('petani')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeForm === 'petani'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Form Petani</span>
            </button>
            <button
              onClick={() => setActiveForm('pengolah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeForm === 'pengolah'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Cog className="w-3.5 h-3.5 text-amber-300" />
              <span>2. Form Pengolah (Mill)</span>
            </button>
            <button
              onClick={() => setActiveForm('gudang')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeForm === 'gudang'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5 text-blue-300" />
              <span>3. Form Gudang / Eksportir</span>
            </button>
            <button
              onClick={() => setActiveForm('roastery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeForm === 'roastery'
                  ? 'bg-rose-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-300" />
              <span>4. Form Roastery &amp; Cupping</span>
            </button>
          </div>

          {notification && (
            <div className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-in fade-in flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{notification}</span>
            </div>
          )}
        </div>

        {/* Digital Filling Guidance Banner (Hidden on Print) */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 sm:px-6 py-2 text-[11px] text-amber-900 flex items-center justify-between gap-2 print:hidden no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[10px]">INFO</span>
            <span>
              <strong>Ketik langsung pada garis isian</strong> dan <strong>klik kotak centang</strong> untuk mengisi form secara digital. Jika petani menghendaki formulir fisik kosong untuk ditulis pulpen, klik <strong>Cetak Blanko Kosong</strong>.
            </span>
          </div>
        </div>

        {/* Printable Sheet Viewport */}
        <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-8 space-y-8 print:max-h-none print:overflow-visible print:p-0 print:space-y-0 bg-stone-200/60 print:bg-white">
          <div id="printable-blanko-document" className="printable-blanko-sheet bg-white print:p-0 print:m-0 print:border-none print:shadow-none print:w-full">

          {/* ========================================================================= */}
          {/* FORM 1: FORMULIR PETANI (KEBUN & PANEN CERI) */}
          {/* ========================================================================= */}
          {activeForm === 'petani' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none">
              {/* Header Surat Resmi */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black shadow-xs shrink-0 print:border print:border-stone-950">
                    <Sprout className="w-7 h-7 text-emerald-400 print:text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm tracking-widest text-stone-950 uppercase">
                        CIRCULAR COFFEE TRACE • GABUNGAN KELOMPOK TANI
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 print:bg-transparent print:border-stone-800 print:text-black">
                        Tier 1: Hulu Perkebunan
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg font-black uppercase text-stone-950 mt-1">
                      Formulir Registrasi Kebun &amp; Catatan Panen Ceri Kopi
                    </h1>
                    <p className="text-xs text-stone-600 print:text-stone-800">
                      Sistem Rantai Pasok Terintegrasi • Standar GAP (Good Agriculture Practice) &amp; Kepatuhan EUDR Bebas Deforestasi (EU 2023/1115)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {qrCodeDataUrls['petani'] && (
                    <div className="text-center print:block">
                      <img
                        src={qrCodeDataUrls['petani']}
                        alt="QR Verifikasi Blanko"
                        className="w-16 h-16 border border-stone-400 rounded-sm p-0.5 bg-white print:border-black"
                      />
                      <span className="text-[8px] font-mono text-stone-500 block">SCAN VERIFIKASI</span>
                    </div>
                  )}
                  <div className="text-right text-[11px] font-mono text-stone-600 print:text-black">
                    <div className="font-bold text-stone-900">FORM-CCT-PETANI-01</div>
                    <div>Revisi: 2026.09</div>
                    <div className="text-[9px] text-stone-500">Kertas Standar A4</div>
                  </div>
                </div>
              </div>

              {/* Seksi 1: Identitas Petani & Kebun */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-emerald-600">
                  A. Identitas Petani, Koperasi &amp; Lahan Kebun
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Nama Petani / Pemilik:</span>
                    <PrintableInput
                      value={fPetani.namaPetani}
                      onChange={(v) => setFPetani({ ...fPetani, namaPetani: v })}
                      blankMode={printBlankMode}
                      placeholder="Nama lengkap petani..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">No. KTP / NIK / ID Petani:</span>
                    <PrintableInput
                      value={fPetani.nik}
                      onChange={(v) => setFPetani({ ...fPetani, nik: v })}
                      blankMode={printBlankMode}
                      placeholder="16 digit NIK..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Kelompok Tani / Koperasi:</span>
                    <PrintableInput
                      value={fPetani.kelompokTani}
                      onChange={(v) => setFPetani({ ...fPetani, kelompokTani: v })}
                      blankMode={printBlankMode}
                      placeholder="Nama kelompok tani..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Nama Blok Kebun:</span>
                    <PrintableInput
                      value={fPetani.namaBlok}
                      onChange={(v) => setFPetani({ ...fPetani, namaBlok: v })}
                      blankMode={printBlankMode}
                      placeholder="Blok kebun..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Desa / Kecamatan / Kab:</span>
                    <PrintableInput
                      value={fPetani.desa}
                      onChange={(v) => setFPetani({ ...fPetani, desa: v })}
                      blankMode={printBlankMode}
                      placeholder="Alamat kebun..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Ketinggian Lahan (mdpl):</span>
                    <PrintableInput
                      value={fPetani.ketinggian}
                      onChange={(v) => setFPetani({ ...fPetani, ketinggian: v })}
                      blankMode={printBlankMode}
                      placeholder="1500"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Luas Lahan (Hektar):</span>
                    <PrintableInput
                      value={fPetani.luasLahan}
                      onChange={(v) => setFPetani({ ...fPetani, luasLahan: v })}
                      blankMode={printBlankMode}
                      placeholder="Contoh: 2.5 Ha"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Estimasi Jumlah Pohon:</span>
                    <PrintableInput
                      value={fPetani.jumlahPohon}
                      onChange={(v) => setFPetani({ ...fPetani, jumlahPohon: v })}
                      blankMode={printBlankMode}
                      placeholder="Contoh: 3.200"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tahun Tanam:</span>
                    <PrintableInput
                      value={fPetani.tahunTanam}
                      onChange={(v) => setFPetani({ ...fPetani, tahunTanam: v })}
                      blankMode={printBlankMode}
                      placeholder="Contoh: 2018"
                      className="flex-1"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-end gap-2 pt-1">
                    <span className="text-stone-600 shrink-0 font-medium">Titik Koordinat GPS Utama:</span>
                    <span className="text-[11px] text-stone-500">Lintang (Lat):</span>
                    <PrintableInput
                      value={fPetani.lat}
                      onChange={(v) => setFPetani({ ...fPetani, lat: v })}
                      blankMode={printBlankMode}
                      placeholder="-7.123456"
                      className="w-36 font-mono"
                    />
                    <span className="text-[11px] text-stone-500 ml-2">Bujur (Long):</span>
                    <PrintableInput
                      value={fPetani.long}
                      onChange={(v) => setFPetani({ ...fPetani, long: v })}
                      blankMode={printBlankMode}
                      placeholder="107.654321"
                      className="w-36 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 2: Praktik Budidaya & Kepatuhan Keberlanjutan */}
              <div className="space-y-2 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-emerald-600">
                  B. Praktik Budidaya &amp; Deklarasi Kepatuhan EUDR
                </div>
                <div className="text-xs space-y-2 text-stone-800">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Varietas Kopi:</span>
                    {[
                      'Typica Java Preanger',
                      'Ateng Super',
                      'Sigarar Utang',
                      'Andungsari',
                      'Kartika',
                      'Lini S-795',
                      'Campuran',
                    ].map((v) => (
                      <PrintableCheckbox
                        key={v}
                        checked={!!fPetani.varietas[v]}
                        onChange={() =>
                          setFPetani({
                            ...fPetani,
                            varietas: { ...fPetani.varietas, [v]: !fPetani.varietas[v] },
                          })
                        }
                        label={v}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="inline-flex items-center gap-1 ml-1">
                      <span className="text-stone-700">Lainnya:</span>
                      <PrintableInput
                        value={fPetani.varietasLainnya}
                        onChange={(v) => setFPetani({ ...fPetani, varietasLainnya: v })}
                        blankMode={printBlankMode}
                        placeholder="isi sendiri..."
                        className="w-28"
                      />
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Sistem Budidaya:</span>
                    {[
                      'Agroforestri (Naungan Pohon Hutan/Buah)',
                      'Monokultur Terbuka',
                    ].map((sb) => (
                      <PrintableCheckbox
                        key={sb}
                        checked={!!fPetani.sistemBudidaya[sb]}
                        onChange={() =>
                          setFPetani({
                            ...fPetani,
                            sistemBudidaya: { ...fPetani.sistemBudidaya, [sb]: !fPetani.sistemBudidaya[sb] },
                          })
                        }
                        label={sb}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Jenis Pupuk:</span>
                    {[
                      '100% Organik (Kompos / Kohe)',
                      'Semi-Organik',
                      'Kimia Terkendali',
                    ].map((jp) => (
                      <PrintableCheckbox
                        key={jp}
                        checked={!!fPetani.jenisPupuk[jp]}
                        onChange={() =>
                          setFPetani({
                            ...fPetani,
                            jenisPupuk: { ...fPetani.jenisPupuk, [jp]: !fPetani.jenisPupuk[jp] },
                          })
                        }
                        label={jp}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Sertifikasi:</span>
                    {[
                      'Certificate Organic',
                      'Certificate GAP',
                    ].map((cert) => (
                      <PrintableCheckbox
                        key={cert}
                        checked={!!fPetani.sertifikasi[cert]}
                        onChange={() =>
                          setFPetani({
                            ...fPetani,
                            sertifikasi: { ...fPetani.sertifikasi, [cert]: !fPetani.sertifikasi[cert] },
                          })
                        }
                        label={cert}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="inline-flex items-center gap-1 ml-1">
                      <span className="text-stone-700">Lainnya:</span>
                      <PrintableInput
                        value={fPetani.sertifikasiLainnya}
                        onChange={(v) => setFPetani({ ...fPetani, sertifikasiLainnya: v })}
                        blankMode={printBlankMode}
                        placeholder="isi sendiri..."
                        className="w-28"
                      />
                    </span>
                  </div>

                  <div className="p-2 border border-stone-300 rounded-lg bg-stone-50/50 text-[11px] text-stone-700">
                    <div className="font-bold mb-1">Pernyataan Bebas Deforestasi (EUDR Deforestation-Free):</div>
                    <PrintableCheckbox
                      checked={fPetani.eudrDeforestationFree}
                      onChange={() => setFPetani({ ...fPetani, eudrDeforestationFree: !fPetani.eudrDeforestationFree })}
                      label="Lahan kebun kopi ini telah dikelola secara sah dan TIDAK BERASAL dari perambahan/alih fungsi hutan lindung pasca 31 Desember 2020 sesuai regulasi European Union Deforestation Regulation (EUDR)."
                      blankMode={printBlankMode}
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 3: Tabel Lembar Catatan Panen Ceri */}
              <div className="space-y-2 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-emerald-600">
                  C. Tabel Pencatatan Panen Ceri Harian (Harvest Log)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-300">
                    <thead className="bg-stone-100 text-stone-700 font-bold text-[11px] uppercase border-b border-stone-300">
                      <tr>
                        <th className="p-2 border-r border-stone-300 w-8 text-center">No</th>
                        <th className="p-2 border-r border-stone-300 w-24">Tgl Panen</th>
                        <th className="p-2 border-r border-stone-300 w-28">Blok Lahan</th>
                        <th className="p-2 border-r border-stone-300 w-28">Varietas</th>
                        <th className="p-2 border-r border-stone-300 w-20 text-right">Berat (kg)</th>
                        <th className="p-2 border-r border-stone-300 w-16 text-center">% Merah</th>
                        <th className="p-2 border-r border-stone-300 w-16 text-center">°Brix</th>
                        <th className="p-2 border-r border-stone-300 w-16 text-center">% Float</th>
                        <th className="p-2 border-r border-stone-300">Keterangan / Kondisi Ceri</th>
                        <th className="p-2 w-16 text-center">Paraf</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {fPetani.harvestRows.map((row, idx) => (
                        <tr key={row.no} className="h-8">
                          <td className="p-1 border-r border-stone-300 text-center text-stone-400 font-bold">{row.no}</td>
                          <td className="p-1 border-r border-stone-300">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.tgl}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].tgl = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium"
                              placeholder="YYYY-MM-DD"
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.blok}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].blok = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium"
                              placeholder="Blok..."
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.varietas}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].varietas = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium"
                              placeholder="Varietas..."
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300 text-right">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.berat}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].berat = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium text-right font-mono"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300 text-center">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.persenMerah}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].persenMerah = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium text-center font-mono"
                              placeholder="%"
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300 text-center">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.brix}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].brix = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium text-center font-mono"
                              placeholder="°Bx"
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300 text-center">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.float}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].float = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium text-center font-mono"
                              placeholder="%"
                            />
                          </td>
                          <td className="p-1 border-r border-stone-300">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.ket}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].ket = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-medium"
                              placeholder="Catatan ceri..."
                            />
                          </td>
                          <td className="p-1 text-center">
                            <input
                              type="text"
                              value={printBlankMode ? '' : row.paraf}
                              onChange={(e) => {
                                const updated = [...fPetani.harvestRows];
                                updated[idx].paraf = e.target.value;
                                setFPetani({ ...fPetani, harvestRows: updated });
                              }}
                              className="w-full bg-transparent focus:outline-hidden text-xs text-stone-900 font-bold text-center"
                              placeholder="..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seksi 4: Validasi & Tanda Tangan Resmi (3 Kolom) */}
              <div className="pt-3 border-t-2 border-stone-800 grid grid-cols-3 gap-4 text-xs text-center print-avoid-break print-keep-together">
                <div>
                  <p className="text-stone-700 font-medium mb-12">Petani / Pemilik Kebun,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fPetani.ttdPetani}
                      onChange={(v) => setFPetani({ ...fPetani, ttdPetani: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Terang Petani )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Tanggal</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Petugas Inspektur ICS,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fPetani.ttdPetugas}
                      onChange={(v) => setFPetani({ ...fPetani, ttdPetugas: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Terang Petugas )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Paraf &amp; Stempel Lapangan</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Ketua Kelompok Tani / Gapoktan,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fPetani.ttdKetua}
                      onChange={(v) => setFPetani({ ...fPetani, ttdKetua: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Ketua Poktan )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Cap Basah</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 2: FORMULIR PENGOLAH (WET & DRY MILL STATION) */}
          {/* ========================================================================= */}
          {activeForm === 'pengolah' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none">
              {/* Header Surat Resmi Form 2 */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black shadow-xs shrink-0 print:border print:border-stone-950">
                    <Cog className="w-7 h-7 text-amber-400 print:text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm tracking-widest text-stone-950 uppercase">
                        CIRCULAR COFFEE TRACE • STASIUN PENGOLAH (MILL)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 print:bg-transparent print:border-stone-800 print:text-black">
                        Tier 2: Wet &amp; Dry Mill Station
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg font-black uppercase text-stone-950 mt-1">
                      Formulir Penerimaan Ceri, Batch Olah &amp; Limbah Wet Mill
                    </h1>
                    <p className="text-xs text-stone-600 print:text-stone-800">
                      Verifikasi Rendemen, Kadar Air &amp; Parameter 7 Metode Pengolahan Kopi (Circular Economy &amp; Zero Waste)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {qrCodeDataUrls['pengolah'] && (
                    <div className="text-center print:block">
                      <img
                        src={qrCodeDataUrls['pengolah']}
                        alt="QR Verifikasi Blanko"
                        className="w-16 h-16 border border-stone-400 rounded-sm p-0.5 bg-white print:border-black"
                      />
                      <span className="text-[8px] font-mono text-stone-500 block">SCAN VERIFIKASI</span>
                    </div>
                  )}
                  <div className="text-right text-[11px] font-mono text-stone-600 print:text-black">
                    <div className="font-bold text-stone-900">FORM-CCT-MILL-02</div>
                    <div>Revisi: 2026.09</div>
                    <div className="text-[9px] text-stone-500">Kertas Standar A4</div>
                  </div>
                </div>
              </div>

              {/* Seksi 1: Penerimaan Bahan Baku Ceri */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-amber-600">
                  A. Penerimaan Bahan Baku Ceri Mentah
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">ID Batch Penerimaan:</span>
                    <PrintableInput
                      value={fPengolah.batchId}
                      onChange={(v) => setFPengolah({ ...fPengolah, batchId: v })}
                      blankMode={printBlankMode}
                      placeholder="BATCH-MLB-2026-..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tanggal &amp; Waktu Terima:</span>
                    <PrintableInput
                      value={fPengolah.tglWaktu}
                      onChange={(v) => setFPengolah({ ...fPengolah, tglWaktu: v })}
                      blankMode={printBlankMode}
                      placeholder="Tgl & jam penerimaan..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Nama Petani Pengirim:</span>
                    <PrintableInput
                      value={fPengolah.namaPetani}
                      onChange={(v) => setFPengolah({ ...fPengolah, namaPetani: v })}
                      blankMode={printBlankMode}
                      placeholder="Nama petani pengirim..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Asal Kebun / Daerah:</span>
                    <PrintableInput
                      value={fPengolah.asalKebun}
                      onChange={(v) => setFPengolah({ ...fPengolah, asalKebun: v })}
                      blankMode={printBlankMode}
                      placeholder="Asal blok & desa..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Berat Ceri Diterima:</span>
                    <PrintableInput
                      value={fPengolah.beratCeri}
                      onChange={(v) => setFPengolah({ ...fPengolah, beratCeri: v })}
                      blankMode={printBlankMode}
                      placeholder="0"
                      className="w-24 text-right font-mono"
                    />
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Harga Beli Ceri: Rp</span>
                    <PrintableInput
                      value={fPengolah.hargaBeli}
                      onChange={(v) => setFPengolah({ ...fPengolah, hargaBeli: v })}
                      blankMode={printBlankMode}
                      placeholder="14500"
                      className="w-28 text-right font-mono"
                    />
                    <span className="text-stone-600">/ kg</span>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-x-6 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700">Hasil Sortasi Awal Ceri:</span>
                    <span className="inline-flex items-center gap-1">
                      <span>°Brix Buah:</span>
                      <PrintableInput
                        value={fPengolah.brix}
                        onChange={(v) => setFPengolah({ ...fPengolah, brix: v })}
                        blankMode={printBlankMode}
                        placeholder="21.5"
                        className="w-14 text-center font-mono"
                      />
                      <span>°Bx</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span>Rasio Petik Merah:</span>
                      <PrintableInput
                        value={fPengolah.persenMerah}
                        onChange={(v) => setFPengolah({ ...fPengolah, persenMerah: v })}
                        blankMode={printBlankMode}
                        placeholder="95"
                        className="w-14 text-center font-mono"
                      />
                      <span>%</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span>Ceri Apung (Floaters):</span>
                      <PrintableInput
                        value={fPengolah.floaters}
                        onChange={(v) => setFPengolah({ ...fPengolah, floaters: v })}
                        blankMode={printBlankMode}
                        placeholder="3"
                        className="w-14 text-center font-mono"
                      />
                      <span>%</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Batch Pengolahan & Fermentasi */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-amber-600">
                  B. Parameter Proses Pengolahan &amp; Penjemuran
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Metode Pengolahan:</span>
                    {[
                      'Full Washed (Basah)',
                      'Honey / Miel',
                      'Natural',
                      'Anaerobic Natural',
                      'Anaerobic Honey',
                      'Carbonic Maceration',
                    ].map((m) => (
                      <PrintableCheckbox
                        key={m}
                        checked={!!fPengolah.metodeOlah[m]}
                        onChange={() =>
                          setFPengolah({
                            ...fPengolah,
                            metodeOlah: { ...fPengolah.metodeOlah, [m]: !fPengolah.metodeOlah[m] },
                          })
                        }
                        label={m}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="inline-flex items-center gap-1 ml-1">
                      <span className="text-stone-700">Lainnya:</span>
                      <PrintableInput
                        value={fPengolah.metodeOlahLainnya}
                        onChange={(v) => setFPengolah({ ...fPengolah, metodeOlahLainnya: v })}
                        blankMode={printBlankMode}
                        placeholder="isi sendiri..."
                        className="w-28"
                      />
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Durasi Fermentasi:</span>
                      <PrintableInput
                        value={fPengolah.durasiFermentasi}
                        onChange={(v) => setFPengolah({ ...fPengolah, durasiFermentasi: v })}
                        blankMode={printBlankMode}
                        placeholder="72"
                        className="w-16 text-center font-mono"
                      />
                      <span className="text-stone-600">Jam</span>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">pH Air Akhir:</span>
                      <PrintableInput
                        value={fPengolah.phAkhir}
                        onChange={(v) => setFPengolah({ ...fPengolah, phAkhir: v })}
                        blankMode={printBlankMode}
                        placeholder="4.2"
                        className="w-16 text-center font-mono"
                      />
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Suhu Air Fermentasi:</span>
                      <PrintableInput
                        value={fPengolah.suhuAir}
                        onChange={(v) => setFPengolah({ ...fPengolah, suhuAir: v })}
                        blankMode={printBlankMode}
                        placeholder="19.5"
                        className="w-16 text-center font-mono"
                      />
                      <span className="text-stone-600">°C</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700 mr-1">Metode Penjemuran:</span>
                    {[
                      'Raised Bed (Para-para Bambu/Jaring)',
                      'Solar Dryer Dome / Greenhouse',
                      'Lantai Jemur Semen Terpal',
                    ].map((mj) => (
                      <PrintableCheckbox
                        key={mj}
                        checked={!!fPengolah.metodeJemur[mj]}
                        onChange={() =>
                          setFPengolah({
                            ...fPengolah,
                            metodeJemur: { ...fPengolah.metodeJemur, [mj]: !fPengolah.metodeJemur[mj] },
                          })
                        }
                        label={mj}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Lama Penjemuran:</span>
                      <PrintableInput
                        value={fPengolah.lamaJemur}
                        onChange={(v) => setFPengolah({ ...fPengolah, lamaJemur: v })}
                        blankMode={printBlankMode}
                        placeholder="14"
                        className="w-16 text-center font-mono"
                      />
                      <span className="text-stone-600">Hari (s/d kadar air stabil)</span>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Target Kadar Air Green Bean:</span>
                      <PrintableInput
                        value={fPengolah.targetKadarAir}
                        onChange={(v) => setFPengolah({ ...fPengolah, targetKadarAir: v })}
                        blankMode={printBlankMode}
                        placeholder="11.5"
                        className="w-16 text-center font-mono"
                      />
                      <span className="text-stone-600">% (10.5 - 12.0%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Pengelolaan Limbah Mill (Eco-Zero Waste) */}
              <div className="space-y-2 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-amber-600">
                  C. Pengelolaan Limbah Stasiun (Eco-Zero Waste)
                </div>
                <div className="text-xs space-y-1.5 text-stone-800">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Pemanfaatan Kulit Ceri (Pulp):</span>
                    {[
                      'Teh Cascara Pangan',
                      'Pupuk Kompos Organik Kebun',
                      'Pakan Ternak',
                    ].map((kc) => (
                      <PrintableCheckbox
                        key={kc}
                        checked={!!fPengolah.kulitCeri[kc]}
                        onChange={() =>
                          setFPengolah({
                            ...fPengolah,
                            kulitCeri: { ...fPengolah.kulitCeri, [kc]: !fPengolah.kulitCeri[kc] },
                          })
                        }
                        label={kc}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Pemanfaatan Kulit Tanduk:</span>
                    {[
                      'Parchment',
                      'Kompos',
                      'Arang / Briket',
                      'Kombucha',
                    ].map((kt) => (
                      <PrintableCheckbox
                        key={kt}
                        checked={!!fPengolah.kulitTanduk[kt]}
                        onChange={() =>
                          setFPengolah({
                            ...fPengolah,
                            kulitTanduk: { ...fPengolah.kulitTanduk, [kt]: !fPengolah.kulitTanduk[kt] },
                          })
                        }
                        label={kt}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Penanganan Air Limbah (Effluent):</span>
                    {[
                      'Bak Filtrasi Biologis / Wetland',
                      'Reaktor Biogas Anaerobik',
                      'Dinetralkan Sebelum Diresapkan',
                    ].map((al) => (
                      <PrintableCheckbox
                        key={al}
                        checked={!!fPengolah.airLimbah[al]}
                        onChange={() =>
                          setFPengolah({
                            ...fPengolah,
                            airLimbah: { ...fPengolah.airLimbah, [al]: !fPengolah.airLimbah[al] },
                          })
                        }
                        label={al}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Seksi 4: Hasil Green Bean Siap Kirim */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-amber-600">
                  D. Hasil Hulling &amp; Spesifikasi Green Bean (Output Dry Mill)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">ID Green Bean Diterbitkan:</span>
                    <PrintableInput
                      value={fPengolah.idGreenBean}
                      onChange={(v) => setFPengolah({ ...fPengolah, idGreenBean: v })}
                      blankMode={printBlankMode}
                      placeholder="GB-MLB-2026-..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Total Berat Green Bean:</span>
                    <PrintableInput
                      value={fPengolah.beratGreenBean}
                      onChange={(v) => setFPengolah({ ...fPengolah, beratGreenBean: v })}
                      blankMode={printBlankMode}
                      placeholder="210"
                      className="w-16 text-right font-mono"
                    />
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Rendemen:</span>
                    <PrintableInput
                      value={fPengolah.rendemen}
                      onChange={(v) => setFPengolah({ ...fPengolah, rendemen: v })}
                      blankMode={printBlankMode}
                      placeholder="16.8"
                      className="w-12 text-center font-mono"
                    />
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Kadar Air Nyata:</span>
                    <PrintableInput
                      value={fPengolah.kadarAir}
                      onChange={(v) => setFPengolah({ ...fPengolah, kadarAir: v })}
                      blankMode={printBlankMode}
                      placeholder="11.2"
                      className="w-12 text-center font-mono"
                    />
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Water Activity (aW):</span>
                    <PrintableInput
                      value={fPengolah.waterActivity}
                      onChange={(v) => setFPengolah({ ...fPengolah, waterActivity: v })}
                      blankMode={printBlankMode}
                      placeholder="0.58"
                      className="w-12 text-center font-mono"
                    />
                    <span className="text-stone-600">aW</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Nilai Cacat (Defect):</span>
                    <PrintableInput
                      value={fPengolah.defect}
                      onChange={(v) => setFPengolah({ ...fPengolah, defect: v })}
                      blankMode={printBlankMode}
                      placeholder="4"
                      className="w-12 text-center font-mono"
                    />
                    <span className="text-stone-600">/ 350g</span>
                  </div>
                  <div className="sm:col-span-3 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700 mr-1">Klasifikasi Grade Mutu:</span>
                    {[
                      'Specialty Grade 1',
                      'Grade 2 Premium',
                      'Commercial Grade',
                      'Campuran',
                    ].map((gm) => (
                      <PrintableCheckbox
                        key={gm}
                        checked={!!fPengolah.gradeMutu[gm]}
                        onChange={() =>
                          setFPengolah({
                            ...fPengolah,
                            gradeMutu: { ...fPengolah.gradeMutu, [gm]: !fPengolah.gradeMutu[gm] },
                          })
                        }
                        label={gm}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="ml-4 font-semibold text-stone-700">Harga Jual: Rp</span>
                    <PrintableInput
                      value={fPengolah.hargaJual}
                      onChange={(v) => setFPengolah({ ...fPengolah, hargaJual: v })}
                      blankMode={printBlankMode}
                      placeholder="135000"
                      className="w-24 text-right font-mono"
                    />
                    <span>/ kg</span>
                  </div>
                </div>
              </div>

              {/* Seksi 5: Validasi & Tanda Tangan Resmi (3 Kolom) */}
              <div className="pt-3 border-t-2 border-stone-800 grid grid-cols-3 gap-4 text-xs text-center print-avoid-break print-keep-together">
                <div>
                  <p className="text-stone-700 font-medium mb-12">Operator Wet Mill / Pelaksana,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fPengolah.ttdOperator}
                      onChange={(v) => setFPengolah({ ...fPengolah, ttdOperator: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Terang Operator )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Tanggal</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Petugas Uji Mutu / Verifikator ICS,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fPengolah.ttdIcs}
                      onChange={(v) => setFPengolah({ ...fPengolah, ttdIcs: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Petugas ICS / QC )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Paraf &amp; Sertifikasi Mutu</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Kepala Stasiun &amp; Mill Manager,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fPengolah.ttdKepala}
                      onChange={(v) => setFPengolah({ ...fPengolah, ttdKepala: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Mill Manager )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Cap Stasiun</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 3: FORMULIR GUDANG / EKSPORTIR (GUDANG & DOKUMEN EKSPOR) */}
          {/* ========================================================================= */}
          {activeForm === 'gudang' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none">
              {/* Header Surat Resmi Form 3 */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black shadow-xs shrink-0 print:border print:border-stone-950">
                    <Warehouse className="w-7 h-7 text-blue-400 print:text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm tracking-widest text-stone-950 uppercase">
                        CIRCULAR COFFEE TRACE • GUDANG &amp; LOGISTIK EKSPOR
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 print:bg-transparent print:border-stone-800 print:text-black">
                        Tier 3: Gudang &amp; QA Karantina
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg font-black uppercase text-stone-950 mt-1">
                      Formulir Inbound Gudang, QC Grading &amp; Karantina Ekspor
                    </h1>
                    <p className="text-xs text-stone-600 print:text-stone-800">
                      Standar Penyimpanan Klimatik Hermetik GrainPro, Pengendalian Kadar Air &amp; Sertifikat Kesehatan Tumbuhan (Phytosanitary)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {qrCodeDataUrls['gudang'] && (
                    <div className="text-center print:block">
                      <img
                        src={qrCodeDataUrls['gudang']}
                        alt="QR Verifikasi Blanko"
                        className="w-16 h-16 border border-stone-400 rounded-sm p-0.5 bg-white print:border-black"
                      />
                      <span className="text-[8px] font-mono text-stone-500 block">SCAN VERIFIKASI</span>
                    </div>
                  )}
                  <div className="text-right text-[11px] font-mono text-stone-600 print:text-black">
                    <div className="font-bold text-stone-900">FORM-CCT-GUDANG-03</div>
                    <div>Revisi: 2026.09</div>
                    <div className="text-[9px] text-stone-500">Kertas Standar A4</div>
                  </div>
                </div>
              </div>

              {/* Seksi 1: Penerimaan Green Bean Masuk Gudang */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-blue-700">
                  A. Identitas Inbound Green Bean
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">ID Lot Gudang:</span>
                    <PrintableInput
                      value={fGudang.idLot}
                      onChange={(v) => setFGudang({ ...fGudang, idLot: v })}
                      blankMode={printBlankMode}
                      placeholder="WH-GDG-2026-..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tanggal Masuk Gudang:</span>
                    <PrintableInput
                      value={fGudang.tglMasuk}
                      onChange={(v) => setFGudang({ ...fGudang, tglMasuk: v })}
                      blankMode={printBlankMode}
                      placeholder="YYYY-MM-DD"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Ref ID Green Bean Olah:</span>
                    <PrintableInput
                      value={fGudang.refGb}
                      onChange={(v) => setFGudang({ ...fGudang, refGb: v })}
                      blankMode={printBlankMode}
                      placeholder="GB-MLB-..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Stasiun Pengolah Asal:</span>
                    <PrintableInput
                      value={fGudang.stasiunAsal}
                      onChange={(v) => setFGudang({ ...fGudang, stasiunAsal: v })}
                      blankMode={printBlankMode}
                      placeholder="Nama mill / stasiun olah..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Petani &amp; Daerah Asal:</span>
                    <PrintableInput
                      value={fGudang.petaniAsal}
                      onChange={(v) => setFGudang({ ...fGudang, petaniAsal: v })}
                      blankMode={printBlankMode}
                      placeholder="Petani & lokasi kebun..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Varietas &amp; Metode Olah:</span>
                    <PrintableInput
                      value={fGudang.varietasMetode}
                      onChange={(v) => setFGudang({ ...fGudang, varietasMetode: v })}
                      blankMode={printBlankMode}
                      placeholder="Varietas & proses..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Total Berat Inbound:</span>
                    <PrintableInput
                      value={fGudang.beratInbound}
                      onChange={(v) => setFGudang({ ...fGudang, beratInbound: v })}
                      blankMode={printBlankMode}
                      placeholder="0"
                      className="w-20 text-right font-mono"
                    />
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Harga Beli Modal: Rp</span>
                    <PrintableInput
                      value={fGudang.hargaModal}
                      onChange={(v) => setFGudang({ ...fGudang, hargaModal: v })}
                      blankMode={printBlankMode}
                      placeholder="135000"
                      className="w-28 text-right font-mono"
                    />
                    <span className="text-stone-600">/ kg</span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Parameter Gudang Klimatik & Penyimpanan */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-blue-700">
                  B. Parameter Klimatik Ruang Gudang &amp; Kemasan
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-end gap-2 sm:col-span-2">
                    <span className="text-stone-600 shrink-0">Lokasi Gudang / Nomor Pallet:</span>
                    <PrintableInput
                      value={fGudang.lokasiPallet}
                      onChange={(v) => setFGudang({ ...fGudang, lokasiPallet: v })}
                      blankMode={printBlankMode}
                      placeholder="Bay / Pallet..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Suhu Ruang Simpan:</span>
                    <PrintableInput
                      value={fGudang.suhuRuang}
                      onChange={(v) => setFGudang({ ...fGudang, suhuRuang: v })}
                      blankMode={printBlankMode}
                      placeholder="19.5"
                      className="w-16 text-center font-mono"
                    />
                    <span className="text-stone-600">°C (18-21°C)</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Kelembaban Relatif (RH):</span>
                    <PrintableInput
                      value={fGudang.kelembaban}
                      onChange={(v) => setFGudang({ ...fGudang, kelembaban: v })}
                      blankMode={printBlankMode}
                      placeholder="55"
                      className="w-16 text-center font-mono"
                    />
                    <span className="text-stone-600">% RH (50-60%)</span>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Jenis Kemasan:</span>
                    {[
                      'GrainPro + Karung Goni 60kg',
                      'Ecotact Hermetik 50kg',
                      'Vacuum Bag 30kg',
                    ].map((jk) => (
                      <PrintableCheckbox
                        key={jk}
                        checked={!!fGudang.jenisKemasan[jk]}
                        onChange={() =>
                          setFGudang({
                            ...fGudang,
                            jenisKemasan: { ...fGudang.jenisKemasan, [jk]: !fGudang.jenisKemasan[jk] },
                          })
                        }
                        label={jk}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="inline-flex items-center gap-1 ml-1">
                      <span className="text-stone-700">Lainnya:</span>
                      <PrintableInput
                        value={fGudang.jenisKemasanLainnya}
                        onChange={(v) => setFGudang({ ...fGudang, jenisKemasanLainnya: v })}
                        blankMode={printBlankMode}
                        placeholder="isi sendiri..."
                        className="w-28"
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Klasifikasi Mutu QC & Penetapan Harga */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-blue-700">
                  C. Uji Laboratorium Mutu, Skor SCA &amp; Klasifikasi Tier
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600">Skor Cupping Pre-Roast:</span>
                    <PrintableInput
                      value={fGudang.skorCupping}
                      onChange={(v) => setFGudang({ ...fGudang, skorCupping: v })}
                      blankMode={printBlankMode}
                      placeholder="87.5"
                      className="w-16 text-center font-mono font-bold"
                    />
                    <span className="text-stone-600">/ 100 SCA</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600">Kadar Air (Moisture Check):</span>
                    <PrintableInput
                      value={fGudang.kadarAir}
                      onChange={(v) => setFGudang({ ...fGudang, kadarAir: v })}
                      blankMode={printBlankMode}
                      placeholder="11.0"
                      className="w-16 text-center font-mono"
                    />
                    <span className="text-stone-600">% (Max 12.5%)</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600">Water Activity (aW):</span>
                    <PrintableInput
                      value={fGudang.waterActivity}
                      onChange={(v) => setFGudang({ ...fGudang, waterActivity: v })}
                      blankMode={printBlankMode}
                      placeholder="0.57"
                      className="w-16 text-center font-mono"
                    />
                    <span className="text-stone-600">aW (Safety &lt;0.65)</span>
                  </div>
                  <div className="sm:col-span-3 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700 mr-1">Klasifikasi Tier Komoditas:</span>
                    {[
                      'Tier 1: Super Specialty (SCA 86+)',
                      'Tier 2: Specialty Grade (SCA 83-85)',
                      'Tier 3: Commercial / Premium',
                    ].map((tier) => (
                      <PrintableCheckbox
                        key={tier}
                        checked={!!fGudang.tierMutu[tier]}
                        onChange={() =>
                          setFGudang({
                            ...fGudang,
                            tierMutu: { ...fGudang.tierMutu, [tier]: !fGudang.tierMutu[tier] },
                          })
                        }
                        label={tier}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="ml-4 font-semibold text-stone-700">Penetapan Harga Jual (EXW Gudang): Rp</span>
                    <PrintableInput
                      value={fGudang.hargaJualExw}
                      onChange={(v) => setFGudang({ ...fGudang, hargaJualExw: v })}
                      blankMode={printBlankMode}
                      placeholder="165000"
                      className="w-24 text-right font-mono"
                    />
                    <span>/ kg</span>
                  </div>
                </div>
              </div>

              {/* Seksi 4: Riwayat Karantina Tumbuhan & Izin Ekspor */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-blue-700">
                  D. Riwayat Karantina Tumbuhan &amp; Izin Ekspor (Phytosanitary)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">No. Sertifikat Karantina (KT-9):</span>
                    <PrintableInput
                      value={fGudang.nomorPhyto}
                      onChange={(v) => setFGudang({ ...fGudang, nomorPhyto: v })}
                      blankMode={printBlankMode}
                      placeholder="KT-9/ID/2026/..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-stone-700 mr-1">Status Uji Lab Karantina:</span>
                    {[
                      'Lolos Bebas Serangga & OPTK',
                      'Perlu Fumigasi Ulang',
                      'Ditolak Karantina',
                    ].map((sq) => (
                      <PrintableCheckbox
                        key={sq}
                        checked={!!fGudang.statusKarantina[sq]}
                        onChange={() =>
                          setFGudang({
                            ...fGudang,
                            statusKarantina: { ...fGudang.statusKarantina, [sq]: !fGudang.statusKarantina[sq] },
                          })
                        }
                        label={sq}
                        blankMode={printBlankMode}
                      />
                    ))}
                  </div>
                  <div className="sm:col-span-2 flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Pelabuhan Muat &amp; Negara Tujuan:</span>
                    <PrintableInput
                      value={fGudang.pelabuhanMuat}
                      onChange={(v) => setFGudang({ ...fGudang, pelabuhanMuat: v })}
                      blankMode={printBlankMode}
                      placeholder="Pelabuhan asal (cth: Tanjung Priok)..."
                      className="w-48"
                    />
                    <span className="text-stone-500">ke</span>
                    <PrintableInput
                      value={fGudang.negaraTujuan}
                      onChange={(v) => setFGudang({ ...fGudang, negaraTujuan: v })}
                      blankMode={printBlankMode}
                      placeholder="Negara tujuan (cth: Hamburg, Jerman)..."
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 5: Validasi & Tanda Tangan Resmi (3 Kolom) */}
              <div className="pt-3 border-t-2 border-stone-800 grid grid-cols-3 gap-4 text-xs text-center print-avoid-break print-keep-together">
                <div>
                  <p className="text-stone-700 font-medium mb-12">Supervisor Gudang &amp; Logistik,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fGudang.ttdSupervisor}
                      onChange={(v) => setFGudang({ ...fGudang, ttdSupervisor: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Supervisor )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Tanggal</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Petugas Auditor Mutu / ICS,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fGudang.ttdIcs}
                      onChange={(v) => setFGudang({ ...fGudang, ttdIcs: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Petugas ICS / QA )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Paraf &amp; Hasil Uji Klimatik</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Pejabat Pemeriksa Karantina Tumbuhan,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fGudang.ttdKarantina}
                      onChange={(v) => setFGudang({ ...fGudang, ttdKarantina: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama &amp; NIP Pejabat )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Cap Segel</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 4: FORMULIR ROASTERY (PROFIL SANGRAI & SCA CUPPING) */}
          {/* ========================================================================= */}
          {activeForm === 'roastery' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none">
              {/* Header Surat Resmi Form 4 */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black shadow-xs shrink-0 print:border print:border-stone-950">
                    <Flame className="w-7 h-7 text-rose-400 print:text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm tracking-widest text-stone-950 uppercase">
                        CIRCULAR COFFEE TRACE • ROASTERY &amp; LAB CUPPING
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 print:bg-transparent print:border-stone-800 print:text-black">
                        Tier 4: Roasting &amp; Sensori
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg font-black uppercase text-stone-950 mt-1">
                      Formulir Profil Sangrai &amp; Lembar Kerja SCA Cupping
                    </h1>
                    <p className="text-xs text-stone-600 print:text-stone-800">
                      Artisan Roasting Telemetry (RoR, Turning Point, DTR) &amp; Evaluasi Sensori Standar SCA 10-Atribut Specialty
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {qrCodeDataUrls['roastery'] && (
                    <div className="text-center print:block">
                      <img
                        src={qrCodeDataUrls['roastery']}
                        alt="QR Verifikasi Blanko"
                        className="w-16 h-16 border border-stone-400 rounded-sm p-0.5 bg-white print:border-black"
                      />
                      <span className="text-[8px] font-mono text-stone-500 block">SCAN VERIFIKASI</span>
                    </div>
                  )}
                  <div className="text-right text-[11px] font-mono text-stone-600 print:text-black">
                    <div className="font-bold text-stone-900">FORM-CCT-ROASTERY-04</div>
                    <div>Revisi: 2026.09</div>
                    <div className="text-[9px] text-stone-500">Kertas Standar A4</div>
                  </div>
                </div>
              </div>

              {/* Seksi 1: Lembar Kerja Sangrai (Roasting Work Order) */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-rose-700">
                  A. Identitas Batch &amp; Lembar Kerja Sangrai (Work Order)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">ID Batch Sangrai:</span>
                    <PrintableInput
                      value={fRoastery.batchId}
                      onChange={(v) => setFRoastery({ ...fRoastery, batchId: v })}
                      blankMode={printBlankMode}
                      placeholder="RST-2026-..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tanggal Roasting:</span>
                    <PrintableInput
                      value={fRoastery.tglRoast}
                      onChange={(v) => setFRoastery({ ...fRoastery, tglRoast: v })}
                      blankMode={printBlankMode}
                      placeholder="YYYY-MM-DD"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Lot Green Bean Gudang:</span>
                    <PrintableInput
                      value={fRoastery.lotGb}
                      onChange={(v) => setFRoastery({ ...fRoastery, lotGb: v })}
                      blankMode={printBlankMode}
                      placeholder="WH-GDG-..."
                      className="flex-1 font-mono"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Varietas &amp; Asal Kopi:</span>
                    <PrintableInput
                      value={fRoastery.varietasAsal}
                      onChange={(v) => setFRoastery({ ...fRoastery, varietasAsal: v })}
                      blankMode={printBlankMode}
                      placeholder="Varietas & origin..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Mesin Roaster Digunakan:</span>
                    <PrintableInput
                      value={fRoastery.mesinRoaster}
                      onChange={(v) => setFRoastery({ ...fRoastery, mesinRoaster: v })}
                      blankMode={printBlankMode}
                      placeholder="Merek & tipe mesin..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Roast Master (Pelaku Sangrai):</span>
                    <PrintableInput
                      value={fRoastery.roastMaster}
                      onChange={(v) => setFRoastery({ ...fRoastery, roastMaster: v })}
                      blankMode={printBlankMode}
                      placeholder="Nama roaster..."
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Kapasitas Batch Masuk:</span>
                    <PrintableInput
                      value={fRoastery.kapasitasBatch}
                      onChange={(v) => setFRoastery({ ...fRoastery, kapasitasBatch: v })}
                      blankMode={printBlankMode}
                      placeholder="5.0"
                      className="w-16 text-right font-mono"
                    />
                    <span className="text-stone-600">kg Green Bean</span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Parameter Siklus Profil Sangrai */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-rose-700">
                  B. Parameter Profil Sangrai (Roast Profile Metrics)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Charge Temp:</span>
                    <PrintableInput
                      value={fRoastery.chargeTemp}
                      onChange={(v) => setFRoastery({ ...fRoastery, chargeTemp: v })}
                      blankMode={printBlankMode}
                      placeholder="195"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Turning Point:</span>
                    <PrintableInput
                      value={fRoastery.turningPoint}
                      onChange={(v) => setFRoastery({ ...fRoastery, turningPoint: v })}
                      blankMode={printBlankMode}
                      placeholder="92"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">First Crack:</span>
                    <PrintableInput
                      value={fRoastery.firstCrack}
                      onChange={(v) => setFRoastery({ ...fRoastery, firstCrack: v })}
                      blankMode={printBlankMode}
                      placeholder="198"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Drop Temp:</span>
                    <PrintableInput
                      value={fRoastery.dropTemp}
                      onChange={(v) => setFRoastery({ ...fRoastery, dropTemp: v })}
                      blankMode={printBlankMode}
                      placeholder="208"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Total Waktu:</span>
                    <PrintableInput
                      value={fRoastery.totalWaktu}
                      onChange={(v) => setFRoastery({ ...fRoastery, totalWaktu: v })}
                      blankMode={printBlankMode}
                      placeholder="10:45"
                      className="w-16 text-center font-mono"
                    />
                    <span className="text-stone-600">menit</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">DTR (%):</span>
                    <PrintableInput
                      value={fRoastery.dtr}
                      onChange={(v) => setFRoastery({ ...fRoastery, dtr: v })}
                      blankMode={printBlankMode}
                      placeholder="15.2"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Roasted Keluar:</span>
                    <PrintableInput
                      value={fRoastery.beratRoasted}
                      onChange={(v) => setFRoastery({ ...fRoastery, beratRoasted: v })}
                      blankMode={printBlankMode}
                      placeholder="4.28"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Weight Loss:</span>
                    <PrintableInput
                      value={fRoastery.weightLoss}
                      onChange={(v) => setFRoastery({ ...fRoastery, weightLoss: v })}
                      blankMode={printBlankMode}
                      placeholder="14.4"
                      className="w-14 text-center font-mono"
                    />
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="col-span-2 sm:col-span-4 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700 mr-1">Tingkat Sangrai:</span>
                    {[
                      'Light Roast',
                      'Light-Medium',
                      'Medium',
                      'Medium-Dark',
                      'Dark Roast',
                    ].map((tr) => (
                      <PrintableCheckbox
                        key={tr}
                        checked={!!fRoastery.tingkatSangrai[tr]}
                        onChange={() =>
                          setFRoastery({
                            ...fRoastery,
                            tingkatSangrai: { ...fRoastery.tingkatSangrai, [tr]: !fRoastery.tingkatSangrai[tr] },
                          })
                        }
                        label={tr}
                        blankMode={printBlankMode}
                      />
                    ))}
                    <span className="ml-4 font-semibold text-stone-700">Agtron:</span>
                    <PrintableInput
                      value={fRoastery.agtron}
                      onChange={(v) => setFRoastery({ ...fRoastery, agtron: v })}
                      blankMode={printBlankMode}
                      placeholder="64 / 78"
                      className="w-20 text-center font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 3: SCA Cupping Score Sheet (10 Parameter) */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-rose-700 flex justify-between items-center">
                  <span>C. Lembar Skor Evaluasi Sensori Uji Cicip (SCA Cupping Form)</span>
                  <span className="text-[10px] text-stone-500 font-normal">Protokol SCA: 8.25g / 150ml @ 93°C</span>
                </div>
                
                {/* 10 Atribut Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { key: 'aroma', label: '1. Fragrance/Aroma' },
                    { key: 'flavor', label: '2. Flavor' },
                    { key: 'aftertaste', label: '3. Aftertaste' },
                    { key: 'acidity', label: '4. Acidity' },
                    { key: 'body', label: '5. Body / Mouthfeel' },
                    { key: 'balance', label: '6. Balance' },
                    { key: 'uniformity', label: '7. Uniformity (5 cup)' },
                    { key: 'cleanCup', label: '8. Clean Cup (5 cup)' },
                    { key: 'sweetness', label: '9. Sweetness' },
                    { key: 'overall', label: '10. Overall' },
                  ].map((attr) => (
                    <div key={attr.key} className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                      <span className="text-[10px] text-stone-600 block font-bold">{attr.label}</span>
                      <div className="flex items-center justify-center gap-1 mt-1 font-mono">
                        <PrintableInput
                          value={fRoastery.scores[attr.key as keyof typeof fRoastery.scores]}
                          onChange={(v) =>
                            setFRoastery({
                              ...fRoastery,
                              scores: { ...fRoastery.scores, [attr.key]: v },
                            })
                          }
                          blankMode={printBlankMode}
                          placeholder="8.50"
                          className="w-14 text-center font-bold"
                        />
                        <span className="text-stone-400 text-[10px]">/ 10.0</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score Calculation & Tasting Notes */}
                <div className="p-3 border border-stone-300 rounded-xl bg-stone-50/80 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-600 font-bold">Deduksi Cacat Rasa (Defects):</span>
                      <span className="text-stone-800 flex items-center">
                        -[ &nbsp;
                        <PrintableInput
                          value={fRoastery.defects}
                          onChange={(v) => setFRoastery({ ...fRoastery, defects: v })}
                          blankMode={printBlankMode}
                          placeholder="0"
                          className="w-10 text-center font-mono font-bold"
                        />
                        &nbsp; ] Poin
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 font-black uppercase text-sm">TOTAL SKOR AKHIR SCA:</span>
                      <div className="flex items-center rounded bg-stone-900 px-2 py-0.5 text-amber-400 font-mono font-black text-base">
                        <PrintableInput
                          value={fRoastery.totalScore}
                          onChange={(v) => setFRoastery({ ...fRoastery, totalScore: v })}
                          blankMode={printBlankMode}
                          placeholder="87.50"
                          className="w-16 text-center text-amber-400 font-black text-base border-amber-400/50"
                        />
                        <span className="text-amber-400 text-xs ml-1">/ 100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 pt-1">
                    <span className="text-stone-700 font-semibold shrink-0">Catatan Karakter Rasa (Tasting Notes):</span>
                    <PrintableInput
                      value={fRoastery.tastingNotes}
                      onChange={(v) => setFRoastery({ ...fRoastery, tastingNotes: v })}
                      blankMode={printBlankMode}
                      placeholder="misal: Jasmine, Bergamot, Brown Sugar, Juicy Lemon Zest, etc."
                      className="flex-1 italic"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-700 font-semibold shrink-0">Rekomendasi Waktu Resting Biji:</span>
                    <PrintableInput
                      value={fRoastery.restingDays}
                      onChange={(v) => setFRoastery({ ...fRoastery, restingDays: v })}
                      blankMode={printBlankMode}
                      placeholder="7"
                      className="w-14 text-center font-bold font-mono"
                    />
                    <span className="text-stone-600">Hari sebelum diseduh</span>
                  </div>
                </div>
              </div>

              {/* Seksi 4: Validasi & Tanda Tangan Resmi (3 Kolom) */}
              <div className="pt-3 border-t-2 border-stone-800 grid grid-cols-3 gap-4 text-xs text-center print-avoid-break print-keep-together">
                <div>
                  <p className="text-stone-700 font-medium mb-12">Roastmaster Pelaksana Sangrai,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fRoastery.ttdRoastmaster}
                      onChange={(v) => setFRoastery({ ...fRoastery, ttdRoastmaster: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Terang Roastmaster )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Tanggal</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Certified Q-Grader / Sensori Evaluator,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fRoastery.ttdQGrader}
                      onChange={(v) => setFRoastery({ ...fRoastery, ttdQGrader: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Terang Q-Grader )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Paraf &amp; Sertifikasi SCA</span>
                  </div>
                </div>
                <div>
                  <p className="text-stone-700 font-medium mb-12">Head of Roastery QA &amp; Manager,</p>
                  <div className="max-w-[180px] mx-auto border-t border-stone-500 pt-1">
                    <PrintableInput
                      value={fRoastery.ttdHeadQa}
                      onChange={(v) => setFRoastery({ ...fRoastery, ttdHeadQa: v })}
                      blankMode={printBlankMode}
                      placeholder="( Nama Head QA )"
                      className="text-center font-bold w-full"
                    />
                    <span className="text-[10px] text-stone-500 block">Tanda Tangan &amp; Cap Roastery</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>

        {/* Footer Modal (Hidden on Print) */}
        <div className="bg-stone-100 border-t border-stone-300 p-4 flex flex-wrap items-center justify-between text-xs text-stone-600 print:hidden no-print">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Semua formulir telah distandarisasi untuk dicetak pada kertas <strong>A4 Potret (Portrait)</strong>.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintBlank}
              type="button"
              className="px-3.5 py-2 border border-stone-300 bg-white hover:bg-stone-50 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer text-stone-700 shadow-2xs"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Cetak Blanko Kosong (A4)</span>
            </button>
            <button
              onClick={handlePrintFilled}
              type="button"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Form Terisi (A4)</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-50 font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            )}
          </div>
        </div>

      </div>
  );

  if (embedded) {
    return (
      <div className="w-full flex justify-center py-2 print:p-0 print:m-0 print:block">
        {modalContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:static print:inset-auto print:overflow-visible print:block">
      {modalContent}
    </div>
  );
};
