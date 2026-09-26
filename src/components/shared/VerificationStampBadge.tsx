import React, { useState } from 'react';
import { VerificationStamp } from '../../types/coffee';
import {
  ShieldCheck,
  Award,
  Coffee,
  CheckCircle2,
  X,
  Copy,
  Check,
  FileCheck2,
  Sparkles,
  Calendar,
  Building,
  UserCheck,
  Sprout,
} from 'lucide-react';

interface VerificationStampBadgeProps {
  stamp?: VerificationStamp;
  status?: 'unverified' | 'pending' | 'verified' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  showDetailsOnClick?: boolean;
  className?: string;
}

export const VerificationStampBadge: React.FC<VerificationStampBadgeProps> = ({
  stamp,
  status = stamp ? 'verified' : 'unverified',
  size = 'md',
  showDetailsOnClick = true,
  className = '',
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (status === 'unverified' && !stamp) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 rounded-full font-medium ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        } ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Belum Terverifikasi
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 rounded-full font-medium animate-pulse ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        } ${className}`}
      >
        <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
        Menunggu Audit
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 rounded-full font-medium ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        } ${className}`}
      >
        <X className="w-3 h-3 text-rose-500" />
        Audit Ditolak
      </span>
    );
  }

  const getStampTheme = () => {
    switch (stamp?.stampType) {
      case 'roast_cupping':
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700/60',
          gradient: 'from-amber-500 to-amber-700',
          icon: Coffee,
          label: stamp?.cuppingEvaluation ? `SCA Cupped (${stamp.cuppingEvaluation.totalScore})` : 'SCA Cupped',
        };
      case 'eudr_farm':
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
          gradient: 'from-emerald-600 to-teal-700',
          icon: ShieldCheck,
          label: 'EUDR Verified',
        };
      case 'harvest_quality':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60',
          gradient: 'from-emerald-700 to-green-800',
          icon: Sprout,
          label: 'Mutu Panen Sah',
        };
      case 'processing_mill':
        return {
          bg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/60',
          gradient: 'from-cyan-600 to-blue-700',
          icon: Award,
          label: 'Mill QA Verified',
        };
      case 'warehouse_silo':
        return {
          bg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/60',
          gradient: 'from-indigo-600 to-purple-700',
          icon: FileCheck2,
          label: 'Gudang QA Certified',
        };
      case 'cafe_safety':
        return {
          bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700/60',
          gradient: 'from-rose-600 to-pink-700',
          icon: CheckCircle2,
          label: 'Barista QA Passed',
        };
      default:
        return {
          bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/60',
          gradient: 'from-purple-600 to-indigo-700',
          icon: ShieldCheck,
          label: 'Verified',
        };
    }
  };

  const theme = getStampTheme();
  const IconComponent = theme.icon;

  const handleCopyHash = () => {
    if (stamp?.digitalSignatureHash) {
      navigator.clipboard.writeText(stamp.digitalSignatureHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          if (showDetailsOnClick && stamp) {
            e.stopPropagation();
            setModalOpen(true);
          }
        }}
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold border transition-all shadow-sm ${
          theme.bg
        } ${
          showDetailsOnClick
            ? 'hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer'
            : 'cursor-default'
        } ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px]'
            : size === 'lg'
            ? 'px-3.5 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } ${className}`}
        title={showDetailsOnClick && stamp ? 'Klik untuk melihat sertifikat audit resmi' : undefined}
      >
        <IconComponent
          className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-current`}
        />
        <span>{stamp?.title ? stamp.title.split(' ')[0] + ' ' + (stamp.title.split(' ')[1] || '') : theme.label}</span>
        {stamp && <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />}
      </button>

      {/* Certificate / Cupping Details Modal */}
      {modalOpen && stamp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Seal Banner */}
            <div className={`p-6 bg-gradient-to-r ${theme.gradient} text-white rounded-t-2xl relative`}>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
                  <Award className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm tracking-wider uppercase">
                      Sertifikat Audit Terverifikasi
                    </span>
                    <span className="text-xs text-white/80">#{stamp.certificateNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold mt-1 text-white">{stamp.title}</h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Score / Highlight Banner */}
              {stamp.scoreDisplay && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400">
                        Hasil Evaluasi Kualitas
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {stamp.scoreDisplay}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Status</div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Lulus Audit
                    </span>
                  </div>
                </div>
              )}

              {/* SCA Cupping Sheet Detailed Breakdown (If present) */}
              {stamp.cuppingEvaluation && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 p-4 bg-amber-50/40 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Lembar Uji Cicip Sensori SCA (Cupping Sheet)
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
                      CQI Protocol
                    </span>
                  </div>

                  {/* 10 Attribute Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Aroma</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.fragranceAroma.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Flavor</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.flavor.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Aftertaste</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.aftertaste.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Acidity</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.acidity.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Body</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.body.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Balance</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.balance.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Uniformity</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.uniformity.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Clean Cup</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.cleanCup.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Sweetness</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.sweetness.toFixed(2)}</div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-slate-400 text-[10px]">Overall</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{stamp.cuppingEvaluation.overall.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Tasting Notes & Rest Days */}
                  <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Catatan Rasa:</span>
                      {stamp.cuppingEvaluation.tastingNotes.map((note, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Evaluasi: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stamp.cuppingEvaluation.roastEvaluation}</span> • Rest: <span className="font-semibold">{stamp.cuppingEvaluation.recommendationRestDays} Hari</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Auditor & Entity Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                    <UserCheck className="w-4 h-4 text-indigo-500" />
                    Auditor Penanggung Jawab
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {stamp.verifierName}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {stamp.verifierTitle}
                  </div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {stamp.verifierOrg}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px]">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Metadata Sertifikasi
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Audit:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{stamp.verifiedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kategori Verifikasi:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                      {stamp.stampType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID Verifikator:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{stamp.verifierId}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {stamp.notes && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white mb-1">Catatan Auditor:</div>
                  <p className="leading-relaxed">{stamp.notes}</p>
                </div>
              )}

              {/* Cryptographic Digital Signature */}
              <div className="p-3.5 bg-slate-950 text-slate-200 rounded-xl text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Tanda Tangan Digital Kriptografis (SHA-256)
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedHash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Salin Hash
                      </>
                    )}
                  </button>
                </div>
                <div className="break-all text-[11px] text-emerald-300 bg-black/40 p-2 rounded border border-emerald-500/20">
                  {stamp.digitalSignatureHash}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Terotentikasi oleh Circular Coffee Trace Verification Engine
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
              >
                Tutup Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
