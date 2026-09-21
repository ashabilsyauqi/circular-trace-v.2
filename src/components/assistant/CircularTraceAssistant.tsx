import React, { useState, useRef, useEffect } from 'react';
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
  MessageSquare,
  RotateCcw,
  Minimize2,
  Maximize2,
  ChevronRight,
  Coffee,
  Warehouse,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';

interface CircularTraceAssistantProps {
  onTriggerCreateWO?: () => void;
}

export const CircularTraceAssistant: React.FC<CircularTraceAssistantProps> = ({
  onTriggerCreateWO,
}) => {
  const {
    workOrders,
    warehouseLots,
    qcSessions,
    salesOrders,
    setRoasterActiveTab,
    setActiveView,
  } = useCoffee();

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    {
      id: string;
      sender: 'user' | 'assistant';
      text: string;
      action?: {
        label: string;
        tab?: string;
        onClick?: () => void;
      };
      timestamp: string;
    }[]
  >([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Halo Roastmaster! Saya **CircularTrace Assistant** ☕. Saya siap membantu Anda menganalisis susut bobot sangrai (roast loss), memeriksa stok green bean di gudang, menjadwalkan Work Orders, hingga memvalidasi skor sensori SCA.',
      timestamp: 'Baru saja',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const PROMPT_SUGGESTIONS = [
    'Berapa rata-rata roast loss pekan ini?',
    'Cek stok green bean yang kritis',
    'Jadwalkan Work Order 30kg Java Frinsa',
    'Tampilkan sesi QC cupping terakhir',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, chatHistory]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

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
        label: 'Buka Modul Work Orders',
        tab: 'work_orders',
      };
    } else if (
      lowerQ.includes('stok') ||
      lowerQ.includes('kritis') ||
      lowerQ.includes('green bean') ||
      lowerQ.includes('habis')
    ) {
      const lowStock = warehouseLots.filter((lot) => lot.availableWeightKg < 50);
      if (lowStock.length > 0) {
        replyText = `⚠️ **Peringatan Stok Rendah:** Ditemukan ${lowStock.length} lot green bean dengan stok di bawah 50kg:\n\n${lowStock
          .map((l) => `• **${l.origin}** (${l.availableWeightKg}kg tersisa)`)
          .join('\n')}\n\nDisarankan segera membuat Purchase Order pengadaan baru.`;
      } else {
        replyText = `✅ **Stok Green Bean Aman:** Semua lot penyimpanan memiliki stok di atas ambang batas reorder. Total stok green coffee di gudang adalah **${warehouseLots.reduce(
          (acc, l) => acc + l.availableWeightKg,
          0
        )} kg**.`;
      }
      replyAction = {
        label: 'Buka Purchasing & Buat PO',
        tab: 'purchasing',
      };
    } else if (
      lowerQ.includes('jadwal') ||
      lowerQ.includes('work order') ||
      lowerQ.includes('sangrai') ||
      lowerQ.includes('roast')
    ) {
      replyText = `🔥 **Jadwal Sangrai Siap Dibuat:** Saya telah menyiapkan konfigurasi batch Work Order untuk 30kg Java Pangalengan Anaerobic dengan resep profil 'Frinsa Anaerobic Filter Light v2' pada mesin Giesen W6A.`;
      replyAction = {
        label: '+ Jadwalkan Work Order',
        onClick: () => {
          setRoasterActiveTab('work_orders');
          setActiveView('dashboard');
          if (onTriggerCreateWO) onTriggerCreateWO();
          setIsOpen(false);
        },
      };
    } else if (lowerQ.includes('qc') || lowerQ.includes('cupping') || lowerQ.includes('score')) {
      const latestQc = qcSessions[0];
      replyText = `🏆 **Sesi QC Cupping Terakhir:** ${
        latestQc
          ? `${latestQc.sessionName} (${latestQc.beanName}) mencetak skor **SCA ${latestQc.totalScaScore}** (${latestQc.status}) dengan tasting notes: *${latestQc.tastingNotes.join(
              ', '
            )}*.`
          : 'Belum ada sesi QC baru hari ini.'
      }`;
      replyAction = {
        label: 'Buka Lab Quality Control',
        tab: 'qc',
      };
    } else if (lowerQ.includes('buku kas') || lowerQ.includes('keuangan') || lowerQ.includes('omzet')) {
      const totalRev = salesOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
      replyText = `💰 **Ringkasan Finansial Roastery:** Total omzet penjualan saat ini mencapai **Rp ${totalRev.toLocaleString()}** dari ${
        salesOrders.length
      } pesanan wholesale. Seluruh bukti transaksi tersinkronisasi ke buku besar rantai pasok.`;
      replyAction = {
        label: 'Buka Buku Kas Roastery',
        tab: 'history',
      };
    } else {
      replyText = `Saya memahami pertanyaan Anda mengenai "${q}". Saat ini Roastery memiliki **${
        workOrders.filter((w) => w.status !== 'completed').length
      } Work Orders aktif**, **${salesOrders.length} Sales Orders wholesale**, dan **${
        warehouseLots.length
      } lot green bean**. Silakan pilih modul yang ingin dituju:`;
      replyAction = {
        label: 'Buka Work Orders',
        tab: 'work_orders',
      };
    }

    const assistantMsg = {
      id: `a-${Date.now()}`,
      sender: 'assistant' as const,
      text: replyText,
      action: replyAction,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg, assistantMsg]);
    setInputQuery('');
  };

  const handleActionClick = (action: { label: string; tab?: string; onClick?: () => void }) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.tab) {
      setRoasterActiveTab(action.tab as any);
      setActiveView('dashboard');
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setChatHistory([
      {
        id: `init-${Date.now()}`,
        sender: 'assistant',
        text: 'Percakapan telah direset. Silakan ajukan pertanyaan atau perintah operasional roastery lainnya.',
        timestamp: 'Baru saja',
      },
    ]);
  };

  return (
    <>
      {/* 1. FLOATING CHAT LAUNCHER BUBBLE BUTTON (Fixed at Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-stone-900/90 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-full border border-stone-700 shadow-xl animate-in fade-in slide-in-from-right-3">
            <span className="w-2 h-2 rounded-full bg-[#00A09D] animate-ping" />
            <span>Butuh bantuan roastery? Tanya CircularTrace</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 sm:p-4 rounded-full bg-gradient-to-br from-[#714B67] via-[#5A3950] to-[#3B2234] text-white shadow-2xl hover:shadow-purple-900/40 border border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group ${
            isOpen ? 'rotate-90 bg-stone-800' : ''
          }`}
          title="CircularTrace AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A09D] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A09D]" />
              </span>
            </div>
          )}
        </button>
      </div>

      {/* 2. FLOATING POPUP CHAT WINDOW DIALOG */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] h-[560px] max-h-[82vh] bg-stone-900/95 backdrop-blur-xl border border-stone-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-stone-100">
          {/* Header Bar */}
          <div className="p-4 border-b border-stone-800 bg-gradient-to-r from-stone-950 via-[#714B67]/30 to-stone-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#714B67] to-[#00A09D] text-white flex items-center justify-center font-black shadow-md border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white tracking-tight">
                    CircularTrace Assistant
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#00A09D]/20 text-[#00A09D] border border-[#00A09D]/40">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Asisten Operasional Roastery & Supply Chain sangrAI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Reset percakapan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                title="Tutup jendela chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-stone-700 text-xs">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#714B67] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-xs shadow-md'
                      : 'bg-stone-800/90 text-stone-200 border border-stone-700/60 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs font-normal">{msg.text}</p>

                  {/* Interactive Action Button */}
                  {msg.action && (
                    <button
                      type="button"
                      onClick={() => msg.action && handleActionClick(msg.action)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-[11px] transition-all shadow-xs active:scale-95"
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <div className="text-[9px] text-stone-400/80 text-right">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-3 py-2 border-t border-stone-800 bg-stone-950/60">
            <div className="text-[10px] text-stone-400 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Contoh Perintah:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PROMPT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(item)}
                  className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-[10px] font-medium whitespace-nowrap transition-all border border-stone-700/60 shrink-0"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-stone-800 bg-stone-950 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Tanya CircularTrace AI..."
              className="flex-1 bg-stone-800/80 border border-stone-700 text-white placeholder-stone-400 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#00A09D] focus:outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white disabled:opacity-40 disabled:hover:bg-[#00A09D] transition-all shrink-0"
              title="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
