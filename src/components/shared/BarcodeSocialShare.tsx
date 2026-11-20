import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles,
  Smartphone,
} from 'lucide-react';

interface BarcodeSocialShareProps {
  url: string;
  title: string;
  lotId?: string;
  variety?: string;
  origin?: string;
  actorRole?: 'petani' | 'pengolah' | 'gudang' | 'roaster' | 'cafe' | string;
  compact?: boolean;
}

export const BarcodeSocialShare: React.FC<BarcodeSocialShareProps> = ({
  url,
  title,
  lotId,
  variety,
  origin,
  actorRole = 'kopi',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(!compact);

  // Compose an attractive social media sharing text
  const shareText = `☕ [sangrAI Coffee Traceability]
Cek riwayat silsilah & spesifikasi barcode untuk ${title}
${variety ? `Varietas: ${variety}` : ''}${origin ? ` • Asal: ${origin}` : ''}
Pindai atau buka link transparansi berikut:
${url}`;

  // WhatsApp
  const shareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Twitter / X
  const shareTwitter = () => {
    const tweetText = `☕ ${title} - Cek sertifikat silsilah & transparansi barcode kopi di sangrAI Traceability Platform:`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}&hashtags=CoffeeTraceability,SpecialtyCoffee,sangrAI`;
    window.open(twUrl, '_blank', 'noopener,noreferrer');
  };

  // Facebook
  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  // Telegram
  const shareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  // LinkedIn
  const shareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer');
  };

  // Native Web Share API (for Mobile: WhatsApp, Instagram, TikTok, AirDrop)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
      } catch (err) {
        // User cancelled or share failed, fallback silently
        console.log('Share dismissed or cancelled:', err);
      }
    } else {
      handleCopyText();
    }
  };

  // Copy full message with link
  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="w-full space-y-2.5 print:hidden">
      {/* Toggle Bar / Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-100 to-amber-500/10 border border-amber-300/70 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-stone-900">Bagikan Barcode ke Sosmed</span>
              <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded-full font-bold">
                Viral &amp; Transparan
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Kirim tautan barcode ini ke WhatsApp, media sosial, atau mitra pembeli Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {hasNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Gunakan Menu Share HP (Instagram, TikTok, WhatsApp, dll.)"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Share HP</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyText}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              copied
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white border-stone-300 hover:bg-stone-50 text-stone-800'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
          </button>
        </div>
      </div>

      {/* Social Media Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {/* WhatsApp */}
        <button
          type="button"
          onClick={shareWhatsApp}
          className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2 transition hover:-translate-y-0.5 shadow-2xs cursor-pointer group"
          title="Bagikan ke WhatsApp Chat / Status"
        >
          <svg className="w-4 h-4 fill-emerald-600 group-hover:scale-110 transition" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>WhatsApp</span>
        </button>

        {/* X / Twitter */}
        <button
          type="button"
          onClick={shareTwitter}
          className="p-2.5 rounded-xl border border-stone-200 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition hover:-translate-y-0.5 shadow-2xs cursor-pointer group"
          title="Post ke X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X / Tweet</span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={shareFacebook}
          className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-bold flex items-center justify-center gap-2 transition hover:-translate-y-0.5 shadow-2xs cursor-pointer group"
          title="Bagikan ke Facebook Feed / Group"
        >
          <svg className="w-4 h-4 fill-blue-600 group-hover:scale-110 transition" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>

        {/* Telegram */}
        <button
          type="button"
          onClick={shareTelegram}
          className="p-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-bold flex items-center justify-center gap-2 transition hover:-translate-y-0.5 shadow-2xs cursor-pointer group"
          title="Kirim ke Telegram Channel / Group"
        >
          <svg className="w-4 h-4 fill-sky-600 group-hover:scale-110 transition" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          <span>Telegram</span>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={shareLinkedIn}
          className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs font-bold flex items-center justify-center gap-2 transition hover:-translate-y-0.5 shadow-2xs cursor-pointer group"
          title="Share ke LinkedIn Professional Network"
        >
          <svg className="w-4 h-4 fill-[#0A66C2] group-hover:scale-110 transition" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
          <span>LinkedIn</span>
        </button>
      </div>
    </div>
  );
};
