import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Play,
  Square,
  Sparkles,
  CheckCircle2,
  Clock,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  Award,
  Layers,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';
import { WorkOrder, WorkOrderBatch, RoastCurvePoint } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';

interface ArtisanRoastSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  onRoastComplete?: () => void;
}

export const ArtisanRoastSimulatorModal: React.FC<ArtisanRoastSimulatorModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onRoastComplete,
}) => {
  const { executeRoastBatch } = useCoffee();

  // Roasting Simulation State
  const [isRoasting, setIsRoasting] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [beanTemp, setBeanTemp] = useState(205); // Initial charge temp
  const [envTemp, setEnvTemp] = useState(220);
  const [rateOfRise, setRateOfRise] = useState(0);
  const [firstCrackSeconds, setFirstCrackSeconds] = useState<number | null>(null);
  const [firstCrackTemp, setFirstCrackTemp] = useState<number | null>(null);
  const [isDropped, setIsDropped] = useState(false);
  const [dropSeconds, setDropSeconds] = useState<number | null>(null);
  const [dropTemp, setDropTemp] = useState<number | null>(null);

  // Batch Yield Inputs
  const [greenWeightKg, setGreenWeightKg] = useState<number>(15.0);
  const [roastedWeightKg, setRoastedWeightKg] = useState<number>(12.8);
  const [roasterOperator, setRoasterOperator] = useState('Agus Roastmaster');
  const [roastNotes, setRoastNotes] = useState('RoR smooth, First crack rolling pada 08:35.');
  const [curvePoints, setCurvePoints] = useState<RoastCurvePoint[]>([]);

  useEffect(() => {
    if (workOrder) {
      const remainingGreen = Math.max(1, workOrder.targetGreenKg - workOrder.actualGreenKg);
      const batchSize = Math.min(15.0, remainingGreen);
      setGreenWeightKg(batchSize);
      setRoastedWeightKg(Number((batchSize * 0.854).toFixed(2)));
      setRoasterOperator(workOrder.assignedRoaster || 'Agus Roastmaster');
    }
    handleReset();
  }, [workOrder]);

  // Live Timer & Curve Generation Tick
  useEffect(() => {
    let interval: any = null;
    if (isRoasting && !isDropped) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const nextSec = prev + 5; // Fast-forward 5s every tick (300ms) for pleasant demo UX
          updateRoastCurve(nextSec);
          return nextSec;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isRoasting, isDropped]);

  const updateRoastCurve = (currentSec: number) => {
    // Realistic S-curve Roasting model:
    // 0s - 90s: Turning point (drops from 205 to 95°C)
    // 90s - 300s: Drying phase (climbs to 150°C, RoR ~15°C/min)
    // 300s - 510s: Maillard phase (climbs to 195°C, RoR ~10°C/min)
    // 510s - 600s: Development / First crack (climbs to 210°C, RoR ~6°C/min)
    let curBt = 205;
    let curEt = 220;
    let curRor = 12.0;

    if (currentSec <= 90) {
      // Turning point dip
      curBt = 205 - (110 * (currentSec / 90));
      curEt = 220 - (50 * (currentSec / 90));
      curRor = -5.0;
    } else if (currentSec <= 300) {
      // Drying
      const progress = (currentSec - 90) / 210;
      curBt = 95 + (57 * progress);
      curEt = 170 + (35 * progress);
      curRor = 16.0 - (progress * 4.0);
    } else if (currentSec <= 510) {
      // Maillard
      const progress = (currentSec - 300) / 210;
      curBt = 152 + (43 * progress);
      curEt = 205 + (18 * progress);
      curRor = 12.0 - (progress * 5.0);
    } else {
      // Development
      const progress = (currentSec - 510) / 120;
      curBt = 195 + (16 * progress);
      curEt = 223 + (8 * progress);
      curRor = 7.0 - (progress * 3.0);
    }

    const roundedBt = Number(curBt.toFixed(1));
    const roundedEt = Number(curEt.toFixed(1));
    const roundedRor = Number(Math.max(1.0, curRor).toFixed(1));

    setBeanTemp(roundedBt);
    setEnvTemp(roundedEt);
    setRateOfRise(roundedRor);

    setCurvePoints((prev) => [
      ...prev,
      {
        timeSeconds: currentSec,
        beanTemp: roundedBt,
        envTemp: roundedEt,
        rateOfRise: roundedRor,
      },
    ]);

    // Auto trigger First Crack simulation around 08:30 (510s) if not manually clicked
    if (currentSec >= 510 && firstCrackSeconds === null) {
      setFirstCrackSeconds(510);
      setFirstCrackTemp(195);
    }
  };

  const handleStartRoast = () => {
    setIsRoasting(true);
    setIsDropped(false);
  };

  const handleMarkFirstCrack = () => {
    if (!firstCrackSeconds) {
      setFirstCrackSeconds(seconds);
      setFirstCrackTemp(beanTemp);
    }
  };

  const handleDropCoffee = () => {
    setIsDropped(true);
    setIsRoasting(false);
    setDropSeconds(seconds);
    setDropTemp(beanTemp);
    // Calculate expected roasted output based on 14.5% shrink
    const estRoasted = Number((greenWeightKg * (1 - 0.145)).toFixed(2));
    setRoastedWeightKg(estRoasted);
  };

  const handleReset = () => {
    setIsRoasting(false);
    setIsDropped(false);
    setSeconds(0);
    setBeanTemp(205);
    setEnvTemp(220);
    setRateOfRise(0);
    setFirstCrackSeconds(null);
    setFirstCrackTemp(null);
    setDropSeconds(null);
    setDropTemp(null);
    setCurvePoints([]);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // DTR calculation: (DropTime - FirstCrackTime) / DropTime * 100
  const dtrPercent =
    dropSeconds && firstCrackSeconds && dropSeconds > firstCrackSeconds
      ? Number((((dropSeconds - firstCrackSeconds) / dropSeconds) * 100).toFixed(1))
      : firstCrackSeconds && seconds > firstCrackSeconds
      ? Number((((seconds - firstCrackSeconds) / seconds) * 100).toFixed(1))
      : 0;

  // Weight loss % calculation
  const weightLossPercent =
    greenWeightKg > 0 && roastedWeightKg > 0
      ? Number((((greenWeightKg - roastedWeightKg) / greenWeightKg) * 100).toFixed(1))
      : 14.5;

  const handleSaveAndComplete = () => {
    if (!workOrder) return;

    const nextBatchNum = workOrder.batches.length + 1;
    const newBatch: Omit<WorkOrderBatch, 'executedAt'> = {
      batchNumber: nextBatchNum,
      greenWeightKg: Number(greenWeightKg),
      roastedWeightKg: Number(roastedWeightKg),
      chargeTemp: 205,
      turningPointTemp: 96,
      yellowingTemp: 152,
      firstCrackTime: formatTime(firstCrackSeconds || 510),
      firstCrackTemp: firstCrackTemp || 195,
      dropTemp: dropTemp || beanTemp,
      totalRoastTime: formatTime(dropSeconds || seconds || 595),
      dtrPercent: dtrPercent || 14.5,
      weightLossPercent: weightLossPercent,
      roasterOperator: roasterOperator,
      notes: roastNotes,
      curveData: curvePoints,
    };

    executeRoastBatch(workOrder.id, newBatch);
    onClose();
    if (onRoastComplete) onRoastComplete();
  };

  if (!isOpen || !workOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  {workOrder.woNumber} • Batch #{workOrder.batches.length + 1}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Artisan Live Sync Connected
                </span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                {workOrder.greenBeanName} ({workOrder.origin})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Telemetry Meters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Timer */}
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Durasi Sangrai</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-mono font-black text-white mt-1">
                {formatTime(seconds)}
              </div>
              <span className="text-[10px] text-stone-500">Target: ~10:00</span>
            </div>

            {/* BT - Bean Temp */}
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-amber-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Bean Temp (BT)</span>
                <Thermometer className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                {beanTemp}°C
              </div>
              <span className="text-[10px] text-amber-300/70">
                {seconds < 90 ? 'Drying / Turn Point' : seconds < 510 ? 'Maillard Reaction' : 'Development'}
              </span>
            </div>

            {/* ET - Env Temp */}
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-blue-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Env Temp (ET)</span>
                <Gauge className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-mono font-black text-blue-400 mt-1">
                {envTemp}°C
              </div>
              <span className="text-[10px] text-blue-300/70">Drum Chamber Temp</span>
            </div>

            {/* DTR % */}
            <div className="bg-stone-950/70 p-4 rounded-2xl border border-emerald-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>DTR (Dev Time)</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-mono font-black text-emerald-400 mt-1">
                {dtrPercent}%
              </div>
              <span className="text-[10px] text-emerald-300/70">Target: {workOrder.targetDtr}%</span>
            </div>
          </div>

          {/* SVG Roasting Curve Graph */}
          <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 relative">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" /> Kurva Suhu Telemetri (Artisan Sync)
                </span>
                <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> BT (Bean)
                </span>
                <span className="text-blue-400 flex items-center gap-1 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> ET (Chamber)
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-400">
                <span>Profil: <strong>{workOrder.masterProfileName}</strong></span>
                <span>• Mesin: <strong>{workOrder.assignedMachine}</strong></span>
              </div>
            </div>

            {/* Canvas / SVG Chart Area */}
            <div className="h-56 w-full relative bg-stone-900/50 rounded-xl overflow-hidden border border-stone-800/80 flex items-end p-2">
              <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="700" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="0" y1="150" x2="700" y2="150" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="175" y1="0" x2="175" y2="200" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="350" y1="0" x2="350" y2="200" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="525" y1="0" x2="525" y2="200" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />

                {/* Master Reference Background Curve */}
                <path
                  d="M 0 40 Q 90 140, 180 120 T 360 80 T 540 40 T 700 20"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Live BT Curve */}
                {curvePoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={curvePoints
                      .map((p) => {
                        const x = Math.min(700, (p.timeSeconds / 660) * 700);
                        const y = Math.max(10, Math.min(190, 200 - ((p.beanTemp - 80) / 150) * 180));
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* Live ET Curve */}
                {curvePoints.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    points={curvePoints
                      .map((p) => {
                        const x = Math.min(700, (p.timeSeconds / 660) * 700);
                        const y = Math.max(10, Math.min(190, 200 - ((p.envTemp - 80) / 150) * 180));
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                )}

                {/* First Crack Marker */}
                {firstCrackSeconds && (
                  <g>
                    <line
                      x1={(firstCrackSeconds / 660) * 700}
                      y1="0"
                      x2={(firstCrackSeconds / 660) * 700}
                      y2="200"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={(firstCrackSeconds / 660) * 700 + 4}
                      y="30"
                      fill="#10B981"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      FC: {formatTime(firstCrackSeconds)} ({firstCrackTemp}°C)
                    </text>
                  </g>
                )}

                {/* Drop Marker */}
                {dropSeconds && (
                  <g>
                    <line
                      x1={(dropSeconds / 660) * 700}
                      y1="0"
                      x2={(dropSeconds / 660) * 700}
                      y2="200"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                    />
                    <text
                      x={Math.min(620, (dropSeconds / 660) * 700 - 60)}
                      y="180"
                      fill="#EF4444"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      DROP: {formatTime(dropSeconds)} ({dropTemp}°C)
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-stone-950 rounded-2xl border border-stone-800">
            <div className="flex items-center gap-2">
              {!isRoasting && !isDropped && (
                <button
                  onClick={handleStartRoast}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Mulai Roasting (Charge)
                </button>
              )}

              {isRoasting && (
                <>
                  <button
                    onClick={handleMarkFirstCrack}
                    disabled={!!firstCrackSeconds}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      firstCrackSeconds
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {firstCrackSeconds ? `First Crack (${formatTime(firstCrackSeconds)})` : 'Tandai First Crack (FC)'}
                  </button>

                  <button
                    onClick={handleDropCoffee}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Drop / Selesaikan Batch
                  </button>
                </>
              )}

              {(isDropped || seconds > 0) && (
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Status indicator */}
            <div className="text-right text-xs">
              <span className="text-stone-400 block text-[11px]">Status Siklus:</span>
              <strong className={isDropped ? 'text-emerald-400' : isRoasting ? 'text-amber-400 animate-pulse' : 'text-stone-300'}>
                {isDropped ? '✓ Batch Selesai (Cooling Tray Active)' : isRoasting ? '🔥 Sedang Berlangsung Sangrai...' : 'Standby / Mesin Siap'}
              </strong>
            </div>
          </div>

          {/* Batch Weight Yield & Operator Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-950/60 p-5 rounded-2xl border border-stone-800 text-xs">
            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Green Bean Digunakan (Kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={greenWeightKg}
                onChange={(e) => setGreenWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white font-mono font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Hasil Roasted Output (Kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={roastedWeightKg}
                onChange={(e) => setRoastedWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-amber-400 font-mono font-black focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Susut Bobot (Roast Shrink)
              </label>
              <div className="px-3 py-2 bg-stone-900/80 border border-stone-700 rounded-xl text-white font-mono font-bold flex items-center justify-between">
                <span>{weightLossPercent}%</span>
                <span className="text-[10px] text-stone-400 font-normal">Normal: 13-16%</span>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Operator / Roastmaster
              </label>
              <input
                type="text"
                value={roasterOperator}
                onChange={(e) => setRoasterOperator(e.target.value)}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-200 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-300 uppercase tracking-wider mb-1">
                Catatan Batch Roasting
              </label>
              <input
                type="text"
                value={roastNotes}
                onChange={(e) => setRoastNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-stone-200 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Setelah disimpan, batch akan otomatis masuk ke antrean uji <strong>Quality Control (QC Cupping)</strong>.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAndComplete}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Batch & Update Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
