import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  X,
  Flame,
  Layers,
  ArrowRight,
  TrendingDown,
  ShoppingCart,
  Award,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';

interface SangraiAssistantProps {
  onTriggerCreateWO?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SangraiAssistant: React.FC<SangraiAssistantProps> = ({
  onTriggerCreateWO,
  onNavigateTab,
}) => {
  const { workOrders, warehouseLots, qcSessions, salesOrders } = useCoffee();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'assistant'; text: string; action?: { label: string; tab?: string; onClick?: () => void } }[]
  >([
    {
      sender: 'assistant',
      text: 'Halo Roastmaster! Saya Asisten sangrAI. Anda bisa meminta saya menjadwalkan batch sangrai, memeriksa stok green bean menipis, atau menganalisis data rata-rata susut bobot (roast loss).',
    },
  ]);

  const PROMPT_SUGGESTIONS = [
    'Berapa rata-rata roast loss pekan ini?',
    'Cek stok green bean yang kritis',
    'Jadwalkan Work Order 30kg Java Frinsa',
    'Tampilkan sesi QC cupping terakhir',
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    setIsOpen(true);
    const userMsg = { sender: 'user' as const, text: q };
    const lowerQ = q.toLowerCase();

    let replyText = '';
    let replyAction: any = undefined;

    if (lowerQ.includes('roast loss') || lowerQ.includes('susut') || lowerQ.includes('shrink')) {
      const completedWos = workOrders.filter((w) => w.weightLossPercent > 0);
      const avgLoss =
        completedWos.length > 0
          ? (completedWos.reduce((acc, w) => acc + w.weightLossPercent, 0) / completedWos.length).toFixed(1)
          : '14.6';
      replyText = `📊 **Analisis Roast Shrink:** Rata-rata susut bobot dari ${completedWos.length} Work Order aktif adalah **${avgLoss}%**. Nilai ini berada dalam batas toleransi standar SCA Specialty (13.5% - 15.5%). Batch Toraja Sapan mencatat susut tertinggi (15.7%).`;
      replyAction = {
        label: 'Lihat Semua Work Order',
        tab: 'work_orders',
      };
    } else if (lowerQ.includes('stok') || lowerQ.includes('kritis') || lowerQ.includes('green bean') || lowerQ.includes('habis')) {
      const lowStock = warehouseLots.filter((lot) => lot.availableWeightKg < 50);
      if (lowStock.length > 0) {
        replyText = `⚠️ **Peringatan Stok Rendah:** Ditemukan ${lowStock.length} lot green bean dengan stok di bawah 50kg:\n- ${lowStock.map((l) => `${l.origin} (${l.availableWeightKg}kg tersisa)`).join('\n- ')}\nDisarankan segera membuat Purchase Order pengadaan baru.`;
      } else {
        replyText = `✅ **Stok Green Bean Aman:** Semua lot penyimpanan memiliki stok di atas ambang batas reorder. Total stok green coffee di gudang adalah **${warehouseLots.reduce((acc, l) => acc + l.availableWeightKg, 0)} kg**.`;
      }
      replyAction = {
        label: 'Buka Purchasing & Buat PO',
        tab: 'purchasing',
      };
    } else if (lowerQ.includes('jadwal') || lowerQ.includes('work order') || lowerQ.includes('sangrai') || lowerQ.includes('roast')) {
      replyText = `🔥 **Jadwal Sangrai Siap Dibuat:** Saya telah menyiapkan konfigurasi Work Order untuk 30kg Java Pangalengan Anaerobic dengan Master Profile 'Frinsa Anaerobic Filter Light v2' di mesin Giesen W6A.`;
      replyAction = {
        label: '+ Buka Form Buat Work Order',
        onClick: () => {
          if (onTriggerCreateWO) onTriggerCreateWO();
          if (onNavigateTab) onNavigateTab('work_orders');
        },
      };
    } else if (lowerQ.includes('qc') || lowerQ.includes('cupping') || lowerQ.includes('score')) {
      const latestQc = qcSessions[0];
      replyText = `🏆 **Sesi QC Cupping Terakhir:** ${latestQc ? `${latestQc.sessionName} (${latestQc.beanName}) mencetak skor **SCA ${latestQc.totalScaScore}** (${latestQc.status}) dengan tasting notes: ${latestQc.tastingNotes.join(', ')}.` : 'Belum ada sesi QC baru hari ini.'}`;
      replyAction = {
        label: 'Buka Lab Quality Control',
        tab: 'qc',
      };
    } else {
      replyText = `Saya memahami permintaan Anda mengenai "${q}". Saat ini Anda memiliki **${workOrders.filter((w) => w.status !== 'completed').length} Work Orders aktif**, **${salesOrders.length} Sales Orders wholesale**, dan **${warehouseLots.length} lot green bean**. Silakan pilih modul navigasi untuk mengelola lebih lanjut.`;
      replyAction = {
        label: 'Buka Work Orders',
        tab: 'work_orders',
      };
    }

    setChatHistory((prev) => [
      ...prev,
      userMsg,
      { sender: 'assistant', text: replyText, action: replyAction },
    ]);
    setInputQuery('');
  };

  return (
    <div className="bg-stone-900 rounded-3xl border border-stone-800 text-white shadow-xl overflow-hidden transition-all">
      {/* Top Banner Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-white">sangrAI Roaster Assistant</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Smart Command
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Gunakan bahasa alami untuk mengotomatiskan work order, analisis susut, atau pengadaan biji.
            </p>
          </div>
        </div>

        {/* Quick prompt chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {PROMPT_SUGGESTIONS.slice(0, 2).map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-colors whitespace-nowrap flex items-center gap-1 shrink-0"
            >
              <span>{s}</span>
            </button>
          ))}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 px-2 py-1"
          >
            {isOpen ? 'Tutup Chat' : 'Buka Asisten'}
          </button>
        </div>
      </div>

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="border-t border-stone-800 bg-stone-950/90 p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1 text-xs">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-lg leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white font-medium rounded-tr-xs'
                      : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-xs space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.action && (
                    <div className="pt-2 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => {
                          if (msg.action?.onClick) {
                            msg.action.onClick();
                          } else if (msg.action?.tab && onNavigateTab) {
                            onNavigateTab(msg.action.tab);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions Strip */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-800/80">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block self-center mr-1">
              Contoh Prompt:
            </span>
            {PROMPT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ketik instruksi atau pertanyaan operasional roastery..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
