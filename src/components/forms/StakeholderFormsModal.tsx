import React, { useState } from 'react';
import {
  X,
  Printer,
  FileText,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  ClipboardList,
} from 'lucide-react';

export type StakeholderFormType = 'all' | 'petani' | 'pengolah' | 'gudang' | 'roastery';

interface StakeholderFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialForm?: StakeholderFormType;
}

export const StakeholderFormsModal: React.FC<StakeholderFormsModalProps> = ({
  isOpen,
  onClose,
  initialForm = 'all',
}) => {
  const [activeForm, setActiveForm] = useState<StakeholderFormType>(initialForm);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Modal Container */}
      <div className="relative bg-stone-100 rounded-3xl max-w-5xl w-full shadow-2xl border border-stone-300 overflow-hidden my-4 print:my-0 print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 print:hidden sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white">
                  Pusat Formulir &amp; Blanko Fisik Lapangan
                </h3>
                <span className="text-[10px] uppercase font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                  Format Cetak A4
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Lembar isian fisik untuk dicetak &amp; ditulis tangan oleh pekerja kebun/gudang sebelum diinput ke sistem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF (A4)</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stakeholder Tab Switcher (Hidden on Print) */}
        <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto print:hidden">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 shrink-0">
            Pilih Lembar Form:
          </span>
          <button
            onClick={() => setActiveForm('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeForm === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Semua Form (4 Stakeholder)</span>
          </button>
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

        {/* Printable Sheet Viewport */}
        <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-8 space-y-8 print:max-h-none print:overflow-visible print:p-0 print:space-y-12 bg-stone-200/60 print:bg-white">

          {/* ========================================================================= */}
          {/* FORM 1: FORMULIR PETANI (KEBUN & PANEN CERI) */}
          {/* ========================================================================= */}
          {(activeForm === 'all' || activeForm === 'petani') && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none page-break-after">
              {/* Header Surat Resmi */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-widest text-stone-900 uppercase">
                      CIRCULAR COFFEE TRACE • sangrAI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Tier 1: Hulu Perkebunan
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black uppercase text-stone-950 mt-1">
                    Formulir Registrasi Kebun &amp; Catatan Panen Ceri Kopi
                  </h1>
                  <p className="text-xs text-stone-600">
                    Sistem Rantai Pasok Terintegrasi • Standar GAP (Good Agriculture Practice) &amp; Kepatuhan EUDR Bebas Deforestasi
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-stone-600 shrink-0">
                  <div className="font-bold text-stone-900">FORM-CCT-PETANI-01</div>
                  <div>Revisi: 2026.09</div>
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
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">No. KTP / NIK / ID Petani:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Kelompok Tani / Koperasi:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Nama Blok Kebun:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Desa / Kecamatan / Kab:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Ketinggian Lahan (mdpl):</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Luas Lahan (Hektar):</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Estimasi Jumlah Pohon:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="sm:col-span-2 flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Titik Koordinat GPS Utama:</span>
                    <span className="text-[11px] text-stone-500">Lintang (Lat):</span>
                    <span className="w-36 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-[11px] text-stone-500">Bujur (Long):</span>
                    <span className="w-36 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Praktik Budidaya & Kepatuhan Keberlanjutan */}
              <div className="space-y-2 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-emerald-600">
                  B. Praktik Budidaya &amp; Deklarasi Kepatuhan EUDR
                </div>
                <div className="text-xs space-y-2 text-stone-800">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Varietas Kopi:</span>
                    <span>[ &nbsp; ] Typica Java Preanger</span>
                    <span>[ &nbsp; ] Andungsari</span>
                    <span>[ &nbsp; ] Sigarar Utang</span>
                    <span>[ &nbsp; ] Kartika</span>
                    <span>[ &nbsp; ] Lini S-795</span>
                    <span>[ &nbsp; ] Lainnya: _______________</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Sistem Budidaya:</span>
                    <span>[ &nbsp; ] Agroforestri (Naungan Pohon Hutan/Buah)</span>
                    <span>[ &nbsp; ] Monokultur Terbuka</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Jenis Pupuk:</span>
                    <span>[ &nbsp; ] 100% Organik (Kompos / Kohe)</span>
                    <span>[ &nbsp; ] Semi-Organik</span>
                    <span>[ &nbsp; ] Kimia Terkendali</span>
                  </div>
                  <div className="p-2 border border-stone-300 rounded-lg bg-stone-50/50 text-[11px] text-stone-700">
                    <strong>Pernyataan Bebas Deforestasi (EUDR Deforestation-Free):</strong><br />
                    [ &nbsp; ] Lahan kebun kopi ini telah dikelola secara sah dan <strong>TIDAK BERASAL dari perambahan/alih fungsi hutan lindung</strong> pasca 31 Desember 2020 sesuai regulasi European Union Deforestation Regulation (EUDR).
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
                        <th className="p-2 border-r border-stone-300">Blok Lahan</th>
                        <th className="p-2 border-r border-stone-300">Varietas</th>
                        <th className="p-2 border-r border-stone-300 w-20 text-right">Berat (kg)</th>
                        <th className="p-2 border-r border-stone-300 w-20 text-center">% Merah</th>
                        <th className="p-2 border-r border-stone-300 w-16 text-center">°Brix</th>
                        <th className="p-2 border-r border-stone-300 w-16 text-center">% Float</th>
                        <th className="p-2 border-r border-stone-300">Keterangan / Kondisi Ceri</th>
                        <th className="p-2 w-20 text-center">Paraf</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <tr key={idx} className="h-9">
                          <td className="p-2 border-r border-stone-300 text-center text-stone-400">{idx}</td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2 border-r border-stone-300"></td>
                          <td className="p-2"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seksi 4: Validasi & Tanda Tangan */}
              <div className="pt-2 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs text-center">
                <div>
                  <p className="text-stone-600 mb-12">Petani / Ketua Kelompok Tani,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
                <div>
                  <p className="text-stone-600 mb-12">Petugas Pendamping / Enumerator Lapangan,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 2: FORMULIR PENGOLAH (WET & DRY MILL STATION) */}
          {/* ========================================================================= */}
          {(activeForm === 'all' || activeForm === 'pengolah') && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none page-break-after">
              {/* Header */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-widest text-stone-900 uppercase">
                      CIRCULAR COFFEE TRACE • sangrAI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Tier 2: Stasiun Pengolah (Mill)
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black uppercase text-stone-950 mt-1">
                    Formulir Penerimaan Ceri, Batch Olah &amp; Pengelolaan Limbah Mill
                  </h1>
                  <p className="text-xs text-stone-600">
                    Standar Wet &amp; Dry Mill • Verifikasi Rendemen, Kadar Air &amp; Eco-Zero Waste
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-stone-600 shrink-0">
                  <div className="font-bold text-stone-900">FORM-CCT-MILL-02</div>
                  <div>Revisi: 2026.09</div>
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
                    <span className="font-mono text-stone-900">BATCH-MLB-____________________</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tanggal &amp; Waktu Terima:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Nama Petani Pengirim:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Asal Kebun / Daerah:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Berat Ceri Diterima:</span>
                    <span className="w-24 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Harga Beli Ceri: Rp</span>
                    <span className="w-28 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">/ kg</span>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-x-6 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700">Hasil Sortasi Awal Ceri:</span>
                    <span>°Brix Buah: _______ °Bx</span>
                    <span>Rasio Petik Merah: _______ %</span>
                    <span>Ceri Apung (Floaters): _______ %</span>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Batch Pengolahan & Fermentasi */}
              <div className="space-y-3 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-amber-600">
                  B. Parameter Proses Pengolahan &amp; Penjemuran
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Metode Pengolahan:</span>
                    <span>[ &nbsp; ] Full Washed (Basah)</span>
                    <span>[ &nbsp; ] Honey / Miel</span>
                    <span>[ &nbsp; ] Natural</span>
                    <span>[ &nbsp; ] Anaerobic Natural</span>
                    <span>[ &nbsp; ] Carbonic Maceration</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Durasi Fermentasi:</span>
                      <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                      <span className="text-stone-600">Jam</span>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">pH Air Akhir:</span>
                      <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Suhu Air Fermentasi:</span>
                      <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                      <span className="text-stone-600">°C</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700">Metode Penjemuran:</span>
                    <span>[ &nbsp; ] Raised Bed (Para-para Bambu/Jaring)</span>
                    <span>[ &nbsp; ] Solar Dryer Dome / Greenhouse</span>
                    <span>[ &nbsp; ] Lantai Jemur Semen Terpal</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Lama Penjemuran:</span>
                      <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                      <span className="text-stone-600">Hari (s/d kadar air stabil)</span>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <span className="text-stone-600">Target Kadar Air Green Bean:</span>
                      <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
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
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Pemanfaatan Kulit Ceri (Pulp):</span>
                    <span>[ &nbsp; ] Teh Cascara Pangan</span>
                    <span>[ &nbsp; ] Pupuk Kompos Organik Kebun</span>
                    <span>[ &nbsp; ] Pakan Ternak</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Penanganan Air Limbah (Effluent):</span>
                    <span>[ &nbsp; ] Bak Filtrasi Biologis / Wetland</span>
                    <span>[ &nbsp; ] Reaktor Biogas Anaerobik</span>
                    <span>[ &nbsp; ] Dinetralkan Sebelum Diresapkan</span>
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
                    <span className="font-mono text-stone-900">GB-____________________</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Total Berat Green Bean:</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Rendemen:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Kadar Air Nyata:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Water Activity (aW):</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">aW</span>
                  </div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-stone-600">Nilai Cacat (Defect):</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">/ 350g</span>
                  </div>
                  <div className="sm:col-span-3 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700">Klasifikasi Grade Mutu:</span>
                    <span>[ &nbsp; ] Specialty Grade 1</span>
                    <span>[ &nbsp; ] Grade 2 Premium</span>
                    <span>[ &nbsp; ] Commercial Grade</span>
                    <span className="ml-4 font-semibold text-stone-700">Harga Jual: Rp</span>
                    <span className="w-24 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span>/ kg</span>
                  </div>
                </div>
              </div>

              {/* Seksi 5: Tanda Tangan */}
              <div className="pt-2 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs text-center">
                <div>
                  <p className="text-stone-600 mb-12">Operator Wet Mill / Pengolah,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
                <div>
                  <p className="text-stone-600 mb-12">Kepala Stasiun &amp; Quality Control Mill,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 3: FORMULIR GUDANG / EKSPORTIR (GUDANG & DOKUMEN EKSPOR) */}
          {/* ========================================================================= */}
          {(activeForm === 'all' || activeForm === 'gudang') && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none page-break-after">
              {/* Header */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-widest text-stone-900 uppercase">
                      CIRCULAR COFFEE TRACE • sangrAI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300">
                      Tier 3: Gudang &amp; Eksportir
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black uppercase text-stone-950 mt-1">
                    Formulir Inbound Gudang, QC Grading &amp; Karantina Ekspor
                  </h1>
                  <p className="text-xs text-stone-600">
                    Warehouse &amp; Logistics QA • Penyimpanan Hermetik &amp; Sertifikat Kesehatan Karantina
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-stone-600 shrink-0">
                  <div className="font-bold text-stone-900">FORM-CCT-GUDANG-03</div>
                  <div>Revisi: 2026.09</div>
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
                    <span className="font-mono text-stone-900">WH-GDG-____________________</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tanggal Masuk Gudang:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Ref ID Green Bean Olah:</span>
                    <span className="font-mono text-stone-900">GB-________________________</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Stasiun Pengolah Asal:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Petani &amp; Daerah Asal:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Varietas &amp; Metode Olah:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Total Berat Inbound:</span>
                    <span className="w-20 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Harga Beli Modal: Rp</span>
                    <span className="w-28 border-b border-dotted border-stone-400 pb-0.5"></span>
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
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Suhu Ruang Simpan:</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">°C (18-21°C)</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Kelembaban Relatif (RH):</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">% RH (50-60%)</span>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-semibold text-stone-700">Jenis Kemasan:</span>
                    <span>[ &nbsp; ] GrainPro + Karung Goni 60kg</span>
                    <span>[ &nbsp; ] Ecotact Hermetik 50kg</span>
                    <span>[ &nbsp; ] Vacuum Bag 30kg</span>
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
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5 font-bold"></span>
                    <span className="text-stone-600">/ 100 SCA</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600">Cacat Fisik (Defect):</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">/ 350g</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600">Ukuran Ayakan (Screen):</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="sm:col-span-3 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700">Klasifikasi Grade Tier Gudang:</span>
                    <span>[ &nbsp; ] Grade 1 - Super Premium (+35% Margin)</span>
                    <span>[ &nbsp; ] Grade 2 - Premium Grade (+20% Margin)</span>
                    <span>[ &nbsp; ] Grade 3 - Medium Commercial</span>
                  </div>
                  <div className="sm:col-span-3 flex items-end gap-2 pt-1">
                    <span className="text-stone-600 shrink-0">Penetapan Harga Jual ke Roaster: Rp</span>
                    <span className="w-32 border-b border-dotted border-stone-400 pb-0.5 font-bold"></span>
                    <span className="text-stone-600">/ kg</span>
                    <span className="text-stone-500 ml-4">Rekomendasi Target Pasar:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                </div>
              </div>

              {/* Seksi 4: Dokumen Karantina Pertanian & Ekspor (Health Certificate) */}
              <div className="space-y-2 mb-5">
                <div className="bg-stone-100 font-bold text-xs uppercase px-2.5 py-1 text-stone-800 border-l-4 border-blue-700">
                  D. Dokumen Karantina Pertanian / Ekspor (Health Certificate)
                </div>
                <div className="p-3 border border-stone-300 rounded-xl bg-stone-50/60 text-xs space-y-2">
                  <p className="font-semibold text-stone-800">
                    Pilih salah satu status kelengkapan dokumen karantina untuk lot ini:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-stone-900">[ &nbsp; ] 1. NUMBER OF HEALTH CERTIFICATE (Pakai Sertifikat Kesehatan Karantina Resmi)</span>
                    </div>
                    <div className="pl-6 flex items-end gap-2 text-stone-700">
                      <span>Nomor Sertifikat Kesehatan:</span>
                      <span className="w-64 border-b border-dotted border-stone-500 pb-0.5 font-mono">HC-EXP-______________________________</span>
                      <span className="text-[11px] text-stone-500">(Balai Karantina Pertanian / Ekspor)</span>
                    </div>
                    <div className="pt-1 flex items-start gap-2">
                      <span className="font-bold text-stone-900">[ &nbsp; ] 2. NO HEALTH CERTIFICATE (Tanpa Sertifikat Kesehatan)</span>
                    </div>
                    <div className="pl-6 text-[11px] text-stone-500">
                      *Dialokasikan untuk distribusi konsumsi pasar domestik lokal non-karantina.
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi 5: Tanda Tangan */}
              <div className="pt-2 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs text-center">
                <div>
                  <p className="text-stone-600 mb-12">Petugas Administrasi Gudang,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
                <div>
                  <p className="text-stone-600 mb-12">Supervisor Gudang &amp; QA Eksportir,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 4: FORMULIR ROASTERY (PROFIL SANGRAI & SCA CUPPING) */}
          {/* ========================================================================= */}
          {(activeForm === 'all' || activeForm === 'roastery') && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-300 p-6 sm:p-8 text-stone-900 print:shadow-none print:border-none print:p-0 print:rounded-none">
              {/* Header */}
              <div className="border-b-2 border-stone-900 pb-3 mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm tracking-widest text-stone-900 uppercase">
                      CIRCULAR COFFEE TRACE • sangrAI
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-rose-100 text-rose-900 border border-rose-300">
                      Tier 4: Roastery &amp; Cupping Lab
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black uppercase text-stone-950 mt-1">
                    Formulir Profil Sangrai &amp; SCA Cupping Score Sheet
                  </h1>
                  <p className="text-xs text-stone-600">
                    Artisan Coffee Roasting Protocol • Standar Evaluasi Sensori Specialty Coffee Association (SCA)
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-stone-600 shrink-0">
                  <div className="font-bold text-stone-900">FORM-CCT-ROASTERY-04</div>
                  <div>Revisi: 2026.09</div>
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
                    <span className="font-mono text-stone-900">RST-________________________</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Tanggal Roasting:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Lot Green Bean Gudang:</span>
                    <span className="font-mono text-stone-900">WH-GDG-____________________</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Varietas &amp; Asal Kopi:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Mesin Roaster Digunakan:</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5"></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-600 shrink-0">Kapasitas Batch Masuk:</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
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
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Turning Point:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">First Crack:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Drop Temp:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">°C</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Total Waktu:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">menit</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">DTR (%):</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Roasted Keluar:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">kg</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-stone-600">Weight Loss:</span>
                    <span className="w-12 border-b border-dotted border-stone-400 pb-0.5"></span>
                    <span className="text-stone-600">%</span>
                  </div>
                  <div className="col-span-2 sm:col-span-4 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span className="font-semibold text-stone-700">Tingkat Sangrai:</span>
                    <span>[ &nbsp; ] Light Roast</span>
                    <span>[ &nbsp; ] Light-Medium</span>
                    <span>[ &nbsp; ] Medium</span>
                    <span>[ &nbsp; ] Medium-Dark</span>
                    <span>[ &nbsp; ] Dark Roast</span>
                    <span className="ml-4 font-semibold text-stone-700">Agtron:</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5"></span>
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
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">1. Fragrance/Aroma</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">2. Flavor</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">3. Aftertaste</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">4. Acidity</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">5. Body / Mouthfeel</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">6. Balance</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">7. Uniformity (5 cup)</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">8. Clean Cup (5 cup)</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">9. Sweetness</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                  <div className="border border-stone-300 p-2 rounded-lg text-center bg-stone-50/50">
                    <span className="text-[10px] text-stone-500 block font-bold">10. Overall</span>
                    <span className="text-xs font-mono font-black text-stone-900 block mt-1">___ / 10.0</span>
                  </div>
                </div>

                {/* Score Calculation & Tasting Notes */}
                <div className="p-3 border border-stone-300 rounded-xl bg-stone-50/80 text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-600 font-bold">Deduksi Cacat Rasa (Defects):</span>
                      <span className="text-stone-800">-[ &nbsp; ] Poin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 font-black uppercase text-sm">TOTAL SKOR AKHIR SCA:</span>
                      <span className="text-base font-black font-mono px-3 py-0.5 rounded bg-stone-900 text-amber-400">
                        ______ / 100
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2 pt-1">
                    <span className="text-stone-700 font-semibold shrink-0">Catatan Karakter Rasa (Tasting Notes):</span>
                    <span className="flex-1 border-b border-dotted border-stone-400 pb-0.5 italic text-stone-600">
                      (misal: Jasmine, Bergamot, Brown Sugar, Juicy Lemon Zest, etc.)
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-stone-700 font-semibold shrink-0">Rekomendasi Waktu Resting Biji:</span>
                    <span className="w-16 border-b border-dotted border-stone-400 pb-0.5 text-center font-bold"></span>
                    <span className="text-stone-600">Hari sebelum diseduh</span>
                  </div>
                </div>
              </div>

              {/* Seksi 4: Tanda Tangan */}
              <div className="pt-2 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs text-center">
                <div>
                  <p className="text-stone-600 mb-12">Roastmaster Pelaksana Sangrai,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
                <div>
                  <p className="text-stone-600 mb-12">Certified Q-Grader / Sensori Evaluator,</p>
                  <p className="font-bold border-t border-stone-400 pt-1 text-stone-900">( ___________________________ )</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Modal (Hidden on Print) */}
        <div className="bg-stone-100 border-t border-stone-300 p-4 flex flex-wrap items-center justify-between text-xs text-stone-600 print:hidden">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Semua formulir telah distandarisasi untuk dicetak pada kertas <strong>A4 Potret (Portrait)</strong>.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Sekarang / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-50 font-bold rounded-xl cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
