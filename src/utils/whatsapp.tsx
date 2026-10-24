import React from 'react';
import { UnifiedMarketplaceItem } from '../types/coffee';
import { MOCK_USERS } from '../data/mockData';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.889-9.885 9.889m0-18.066c-4.502 0-8.164 3.663-8.167 8.166a8.13 8.13 0 001.272 4.368l.192.308-.598 2.188 2.238-.587.298.177a8.14 8.14 0 004.765 1.396h.003c4.5 0 8.163-3.664 8.166-8.167a8.11 8.11 0 00-2.39-5.776 8.11 8.11 0 00-5.748-2.275" />
  </svg>
);

export const getSellerWhatsAppNumber = (
  item: UnifiedMarketplaceItem
): { phoneDisplay: string; waNumber: string } => {
  const seller = MOCK_USERS.find(
    (u) =>
      u.name.toLowerCase() === item.sellerName.toLowerCase() ||
      (item.sellerOrg && u.organization && u.organization.toLowerCase().includes(item.sellerOrg.toLowerCase())) ||
      (item.sellerRole && u.role === item.sellerRole)
  );

  const phoneDisplay = seller?.phone || '0812-9988-7766';
  const clean = phoneDisplay.replace(/[^0-9]/g, '');
  const waNumber = clean.startsWith('62')
    ? clean
    : clean.startsWith('0')
    ? '62' + clean.slice(1)
    : '62' + clean;

  return { phoneDisplay, waNumber };
};

export interface OrderWhatsAppParams {
  item: UnifiedMarketplaceItem;
  quantity?: number;
  buyerName?: string;
  buyerOrg?: string;
  buyerRole?: string;
}

export const createOrderWhatsAppUrl = ({
  item,
  quantity = 1,
  buyerName = 'Calon Pembeli',
  buyerOrg = 'Umum',
  buyerRole = 'Buyer',
}: OrderWhatsAppParams): { url: string; waNumber: string; phoneDisplay: string } => {
  const { phoneDisplay, waNumber } = getSellerWhatsAppNumber(item);
  const totalAmount = (quantity * item.price).toLocaleString('id-ID');

  const lines = [
    `Halo kak *${item.sellerName}* (${item.sellerOrg}),`,
    '',
    `Saya tertarik memesan produk dari *Marketplace sangrAI*:`,
    `☕ *Produk:* ${item.title}`,
    `🏷️ *ID Lot / Batch:* ${item.id}`,
    `📦 *Kategori:* ${item.categoryLabel}`,
    `📍 *Asal:* ${item.origin} (${item.variety})`,
    ...(item.processMethod ? [`⚙️ *Metode Olah:* ${item.processMethod}`] : []),
    ...(item.scaScore ? [`🏆 *SCA Score:* ${item.scaScore}`] : []),
    `📊 *Jumlah Dipesan:* ${quantity} ${item.stockUnit}`,
    `💰 *Harga Satuan:* Rp ${item.price.toLocaleString('id-ID')} ${item.priceUnit}`,
    `💵 *Total Tagihan:* Rp ${totalAmount}`,
    '',
    `👤 *Data Pemesan:*`,
    `- Nama: ${buyerName}`,
    `- Organisasi: ${buyerOrg}`,
    `- Peran: ${buyerRole.toUpperCase()}`,
    '',
    `Apakah stok masih tersedia dan bisa diproses pengirimannya? Terima kasih!`,
  ];

  const text = encodeURIComponent(lines.join('\n'));
  return {
    url: `https://wa.me/${waNumber}?text=${text}`,
    waNumber,
    phoneDisplay,
  };
};

export const openOrderWhatsApp = (params: OrderWhatsAppParams): void => {
  const { url } = createOrderWhatsAppUrl(params);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
