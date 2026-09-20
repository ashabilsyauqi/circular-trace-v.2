import React, { useState } from 'react';
import {
  MessageSquare,
  FileText,
  Clock,
  Send,
  User,
  CheckCircle2,
  Sparkles,
  Paperclip,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';

interface ChatterMessage {
  id: string;
  author: string;
  type: 'message' | 'note' | 'system';
  content: string;
  timestamp: string;
}

interface OdooChatterProps {
  initialMessages?: ChatterMessage[];
  documentTitle?: string;
}

export const OdooChatter: React.FC<OdooChatterProps> = ({
  initialMessages = [
    {
      id: 'msg-1',
      author: 'Sistem Ledger CCT',
      type: 'system',
      content: 'Dokumen berhasil diverifikasi dan disinkronkan ke buku besar rantai pasok.',
      timestamp: 'Hari ini, 09:15',
    },
  ],
  documentTitle,
}) => {
  const { currentUser } = useCoffee();
  const [activeTab, setActiveTab] = useState<'message' | 'note' | 'activity'>('note');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatterMessage[]>(initialMessages);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatterMessage = {
      id: `msg-${Date.now()}`,
      author: currentUser?.name || 'Operator',
      type: activeTab === 'message' ? 'message' : 'note',
      content: inputText.trim(),
      timestamp: 'Baru saja',
    };

    setMessages([newMsg, ...messages]);
    setInputText('');
  };

  return (
    <div className="bg-[#F8F9FA] rounded-3xl p-5 border border-stone-200/80 space-y-4">
      {/* Top Chatter Action Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200/70 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('note')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'note'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Catatan Internal (Log Note)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('message')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'message'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Kirim Pesan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('activity')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'activity'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Jadwalkan Aktivitas</span>
        </button>
      </div>

      {/* Input Box */}
      <form onSubmit={handlePost} className="space-y-2">
        <div className="bg-white rounded-2xl border border-stone-200 p-2.5 shadow-2xs focus-within:ring-2 focus-within:ring-[#714B67] focus-within:border-transparent transition-all">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeTab === 'note'
                ? 'Tulis catatan log internal untuk tim roastery...'
                : 'Kirim pesan update ke pihak terkait...'
            }
            className="w-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-[10px] text-stone-400">
              Odoo Chatter • Rekam jejak permanen
            </span>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </div>
      </form>

      {/* Messages Timeline */}
      <div className="space-y-3 pt-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/70 shadow-2xs text-xs"
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                msg.type === 'system'
                  ? 'bg-[#00A09D]'
                  : msg.type === 'note'
                  ? 'bg-[#714B67]'
                  : 'bg-amber-600'
              }`}
            >
              {msg.type === 'system' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">{msg.author}</span>
                <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
              </div>
              <p className="text-stone-700 mt-1 leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
