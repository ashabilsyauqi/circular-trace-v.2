import React, { useState } from 'react';
import {
  Flame,
  PlusCircle,
  Sliders,
  Sparkles,
  Award,
  Layers,
  Activity,
  CheckCircle2,
  X,
  Zap,
  Gauge,
  Clock,
  Thermometer,
  Wrench,
  Search,
} from 'lucide-react';
import { MasterRoastProfile, RoasterMachine } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';

export const ProductionModule: React.FC = () => {
  const { masterProfiles, roasterMachines, createMasterProfile } = useCoffee();

  const [activeTab, setActiveTab] = useState<'profiles' | 'machines'>('profiles');
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);

  // Form State for Master Profile
  const [profName, setProfName] = useState('West Java Anaerobic Fast Finish v4');
  const [profLevel, setProfLevel] = useState<MasterRoastProfile['targetRoastLevel']>('Light Roast');
  const [profAgtronGourmet, setProfAgtronGourmet] = useState<number>(76);
  const [profAgtronComm, setProfAgtronComm] = useState<number>(64);
  const [profDtr, setProfDtr] = useState<number>(14.5);
  const [profCharge, setProfCharge] = useState<number>(205);
  const [profFcTime, setProfFcTime] = useState<number>(510);
  const [profDropTemp, setProfDropTemp] = useState<number>(208);
  const [profTotalTime, setProfTotalTime] = useState<number>(595);
  const [profDesc, setProfDesc] = useState('Profil sangrai cepat untuk mengangkat aroma fermentasi buah tropis.');

  const handleCreateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMasterProfile({
      name: profName,
      targetRoastLevel: profLevel,
      agtronGourmet: Number(profAgtronGourmet),
      agtronCommercial: Number(profAgtronComm),
      targetDtr: Number(profDtr),
      chargeTemp: Number(profCharge),
      turningPointTemp: 96,
      yellowingTemp: 152,
      firstCrackTemp: 195,
      firstCrackTimeSeconds: Number(profFcTime),
      dropTemp: Number(profDropTemp),
      totalTimeSeconds: Number(profTotalTime),
      recommendedBrew: ['V60', 'Origami Dripper', 'Japanese Drip'],
      flavorProfile: ['Wild Berry', 'Jasmine', 'Cane Sugar'],
      description: profDesc,
    });
    setIsCreateProfileOpen(false);
  };

  const getAgtronColor = (gourmet: number) => {
    if (gourmet >= 80) return 'bg-[#B07246] text-white'; // Very Light
    if (gourmet >= 70) return 'bg-[#8D4E27] text-white'; // Light
    if (gourmet >= 60) return 'bg-[#6D3B1E] text-white'; // Medium
    if (gourmet >= 50) return 'bg-[#4E2713] text-white'; // Medium-Dark
    return 'bg-[#311608] text-white'; // Dark
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Master Roast Profiles"
          value={`${masterProfiles.length} Resep`}
          subtitle="Terkalibrasi kurva RoR & Agtron"
          trend={{ value: '100% Reprodusibel', isPositive: true }}
          icon={<Sliders className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Armada Mesin Roaster"
          value={`${roasterMachines.length} Unit`}
          subtitle="Kapasitas total 43 kg / batch"
          trend={{ value: 'Semua Online', isPositive: true }}
          icon={<Flame className="w-5 h-5" />}
          color="stone"
        />
        <MetricCard
          title="Koneksi Artisan Software"
          value="100% Sync"
          subtitle="USB/Modbus Telemetry Active"
          trend={{ value: 'Realtime Data', isPositive: true }}
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Total Batch Seumur Hidup"
          value="1,930 Batch"
          subtitle="Catatan sangrai digital terpelihara"
          trend={{ value: 'Zero Over-roast', isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Tabs & Add Profile Button */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'profiles'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Master Roast Profiles ({masterProfiles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('machines')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'machines'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Armada Mesin Sangrai ({roasterMachines.length})</span>
          </button>
        </div>

        {activeTab === 'profiles' && (
          <button
            onClick={() => setIsCreateProfileOpen(true)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Buat Master Profile Baru</span>
          </button>
        )}
      </div>

      {/* TAB 1: MASTER PROFILES */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {masterProfiles.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-black shadow-xs ${getAgtronColor(
                        prof.agtronGourmet
                      )}`}
                    >
                      Agtron #{prof.agtronGourmet}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold border border-stone-200">
                      {prof.targetRoastLevel}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Target DTR: {prof.targetDtr}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">{prof.name}</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {prof.description}
                </p>

                {/* Phase Milestones */}
                <div className="grid grid-cols-3 gap-2 mt-4 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Charge Temp:</span>
                    <strong className="text-stone-900 font-mono">{prof.chargeTemp}°C</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">First Crack:</span>
                    <strong className="text-emerald-700 font-mono">
                      {Math.floor(prof.firstCrackTimeSeconds / 60)}:{(prof.firstCrackTimeSeconds % 60).toString().padStart(2, '0')} ({prof.firstCrackTemp}°C)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Drop / End:</span>
                    <strong className="text-red-700 font-mono">
                      {Math.floor(prof.totalTimeSeconds / 60)}:{(prof.totalTimeSeconds % 60).toString().padStart(2, '0')} ({prof.dropTemp}°C)
                    </strong>
                  </div>
                </div>

                {/* Flavor Notes */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {prof.flavorProfile.map((flv, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/70"
                    >
                      {flv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Brew */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Rekomendasi Seduh: <strong>{prof.recommendedBrew.join(', ')}</strong></span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready to Roast
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ROASTING MACHINES */}
      {activeTab === 'machines' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roasterMachines.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-600" /> Artisan Online
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-400">
                    {m.capacityKg} kg / batch
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900">{m.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{m.model}</p>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Sumber Panas:</span>
                    <strong className="text-stone-800">{m.heatSource}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Batch Sangrai:</span>
                    <strong className="text-amber-800 font-mono">{m.totalBatchesRoasted} Batch</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Servis Terakhir:</span>
                    <strong className="text-stone-800">{m.lastMaintenanceDate}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-stone-400">Status: <strong className="text-emerald-700 font-bold capitalize">{m.status}</strong></span>
                <span className="text-[11px] text-stone-600 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-stone-400" /> Kalibrasi OK
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MASTER PROFILE MODAL */}
      {isCreateProfileOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900">
            <button
              onClick={() => setIsCreateProfileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Buat Master Roast Profile Baru</h3>
                <p className="text-xs text-stone-500">Simpan parameter kurva suhu dan target Agtron sebagai resep baku roastery.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Master Profile
                </label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Roast Level
                  </label>
                  <select
                    value={profLevel}
                    onChange={(e) => setProfLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Light Roast">Light Roast</option>
                    <option value="Light-Medium">Light-Medium</option>
                    <option value="Medium Roast">Medium Roast</option>
                    <option value="Medium-Dark">Medium-Dark</option>
                    <option value="Dark Roast">Dark Roast</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Agtron Gourmet
                  </label>
                  <input
                    type="number"
                    required
                    value={profAgtronGourmet}
                    onChange={(e) => setProfAgtronGourmet(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Target DTR (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={profDtr}
                    onChange={(e) => setProfDtr(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Charge Temp (°C)
                  </label>
                  <input
                    type="number"
                    required
                    value={profCharge}
                    onChange={(e) => setProfCharge(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Drop Temp (°C)
                  </label>
                  <input
                    type="number"
                    required
                    value={profDropTemp}
                    onChange={(e) => setProfDropTemp(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Total Time (Detik)
                  </label>
                  <input
                    type="number"
                    required
                    value={profTotalTime}
                    onChange={(e) => setProfTotalTime(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Deskripsi & Karakter Rasa
                </label>
                <textarea
                  rows={2}
                  value={profDesc}
                  onChange={(e) => setProfDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Master Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
