import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Sprout,
  Cog,
  ShieldCheck,
  Warehouse,
  Thermometer,
  Scale,
  Truck,
  Flame,
  Activity,
  Coffee,
  QrCode,
  Store,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
  PackageCheck,
  Sliders,
} from 'lucide-react';

export const ServicesShowcaseSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-20 md:py-24 bg-[#F8F5F0] border-b border-[#E6DFD5] scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-stone-900 text-amber-400 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Ekosistem Digital Circular Trace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Pilih Solusi yang Sesuai dengan Ekosistem Bisnis Kopi Anda
          </h2>
          <p className="mt-3.5 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Mulai langkah transformasi digital rantai pasok kopi Anda. Pilih peran organisasi Anda dan nikmati fitur operasional khusus, standar mutu SCA, serta ketertelusuran EUDR.
          </p>
        </div>

        {/* 4 Dedicated Service Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* KARTU 1: KELOMPOK TANI / GAPOKTAN (Bundle 3 Layanan Terpadu) */}
          <div className="bg-white rounded-3xl border-2 border-emerald-300/90 hover:border-emerald-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-700" />
                  Bundle Terpadu (3-in-1 Included)
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-emerald-900 transition-colors">
                  Kelompok Tani &amp; Koperasi Kopi
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Solusi digitalisasi hulu perkebunan kopi terintegrasi untuk Gapoktan, koperasi tani, dan konsorsium perkebunan rakyat.
                </p>
              </div>

              {/* 3 Included Services */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>3 Layanan Operasional Langsung Termasuk:</span>
                </div>
                <div className="space-y-2.5 text-stone-700 pl-1">
                  <div className="flex items-start gap-2">
                    <Sprout className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">Unit Petani Kopi:</strong> Pendataan profil petani, luas hektar, poligon batas kebun anti-deforestasi EUDR, dan pencatatan panen ceri petik merah.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Cog className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">Unit Pengolah (Wet Mill):</strong> Penerimaan ceri, 7 metode olah/fermentasi, pencatatan rendemen &amp; pengelolaan limbah sirkular.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">Unit Verifikator Mutu (ICS):</strong> Tim audit internal kebun, uji brix ceri di pohon, inspeksi GAP, dan penerbitan stempel resmi mutu kelompok tani.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate('/register/kelompok-tani')}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
              >
                <span>Daftarkan Kelompok Tani (Bundle 3 Layanan)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* KARTU 2: GUDANG & QA (Warehouse Management) */}
          <div className="bg-white rounded-3xl border-2 border-blue-200 hover:border-blue-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Warehouse className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  Logistik &amp; Mutu Green Bean
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-blue-900 transition-colors">
                  Gudang Penyimpanan &amp; QA
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Sistem kontrol iklim hermetik, uji grading fisik green bean SCA, dan manajemen karantina ekspor.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2.5 text-xs">
                <div className="font-bold text-blue-950 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-blue-700" />
                  <span>Fitur Standar Gudang Hermetik:</span>
                </div>
                <ul className="space-y-2.5 text-stone-700 pl-1">
                  <li className="flex items-start gap-2">
                    <Thermometer className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Pemantauan suhu ruangan (18–22°C) &amp; kelembapan ruangan (RH 55–65%) karung GrainPro.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Scale className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Lembar sortasi fisik: uji kadar air moisture meter, defect count, dan screen size SCA.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Modul penerimaan ceri giling (inbound) dari stasiun olah &amp; outbound roastery.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate('/register/gudang')}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
              >
                <span>Daftar Sebagai Mitra Gudang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* KARTU 3: ARTISAN ROASTERY (Roastery ERP) */}
          <div className="bg-white rounded-3xl border-2 border-orange-200 hover:border-orange-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-700 border border-orange-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Flame className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 text-orange-950 border border-orange-300">
                  Penyangraian &amp; Cupping Lab
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-orange-950 transition-colors">
                  Artisan Roastery
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Software ERP artisan sangrai, profiling kurva Agtron/RoR, uji cita rasa cupping SCA, dan integrasi paspor digital kemasan retail.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-2.5 text-xs">
                <div className="font-bold text-orange-950 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-700" />
                  <span>Fitur Unggulan Roastery ERP:</span>
                </div>
                <ul className="space-y-2.5 text-stone-700 pl-1">
                  <li className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>Jadwal Work Orders sangrai, DTR (Development Time Ratio), dan kalibrasi kurva suhu RoR.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Coffee className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>Lembar uji sensori spider chart 10 atribut standar Specialty Coffee Association (SCA).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <QrCode className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>Cetak label kemasan retail ber-QR traceability langsung ke kebun petani asal.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate('/register/roaster')}
                className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
              >
                <span>Buka Akun Roastery</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* KARTU 4: COFFEE SHOP & KEDAI KOPI (Retail & Barista) */}
          <div className="bg-white rounded-3xl border-2 border-amber-200 hover:border-amber-600 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 sm:p-8 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Coffee className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                  Hilir &amp; Seduh Konsumen
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-amber-950 transition-colors">
                  Coffee Shop &amp; Barista
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Sajikan setiap cangkir kopi spesialti dengan transparansi penuh dari kebun hingga ke meja seduh konsumen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs">
                <div className="font-bold text-amber-950 flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-700" />
                  <span>Fitur Kedai Kopi &amp; Barista:</span>
                </div>
                <ul className="space-y-2.5 text-stone-700 pl-1">
                  <li className="flex items-start gap-2">
                    <Store className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Akses langsung beli roasted beans berkualitas tinggi dari mitra roastery terverifikasi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <QrCode className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Paspor digital QR Code meja agar pengunjung dapat menelusuri kisah petani di balik cangkirnya.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Sertifikat transparansi harga berkeadilan (fair price) &amp; kalkulator biaya seduh.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate('/register/coffee-shop')}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
              >
                <span>Daftarkan Coffee Shop Anda</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ServicesShowcaseSection;
