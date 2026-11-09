import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { UnifiedMarketplaceItem } from '../../types/coffee';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Receipt,
  Printer,
  ArrowRight,
  ExternalLink,
  Tag
} from 'lucide-react';

export interface CartItem {
  item: UnifiedMarketplaceItem;
  quantity: number;
}

export interface TokopediaCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onSuccessOrder?: (orderId: string) => void;
}

export const TokopediaCartModal: React.FC<TokopediaCartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSuccessOrder,
}) => {
  const { currentUser, setCurrentUser, addTransaction } = useCoffee();

  // Checkout states
  const [step, setStep] = useState<'cart' | 'receipt'>('cart');
  const [selectedCourier, setSelectedCourier] = useState<'jnt_cargo' | 'jne_reg' | 'sicepat'>('jnt_cargo');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'qris' | 'va'>('wallet');
  const [receiptData, setReceiptData] = useState<any | null>(null);

  if (!isOpen) return null;

  // Courier Pricing & Estimation
  const courierMap = {
    jnt_cargo: { name: 'J&T Cargo (Spesialis Kopi & Karung Goni)', cost: 25000, etd: '2-3 Hari Kerja' },
    jne_reg: { name: 'JNE Reguler Express', cost: 18000, etd: '1-2 Hari Kerja' },
    sicepat: { name: 'SiCepat Cargo B2B Nusantara', cost: 22000, etd: '2-3 Hari Kerja' },
  };

  const courierInfo = courierMap[selectedCourier];
  const itemsSubtotal = cartItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const shippingCost = cartItems.length > 0 ? courierInfo.cost : 0;
  // Biaya Layanan Pembeli / Buyer Platform Charge (Sesuai Arahan Om Novizar)
  const platformBuyerFee = cartItems.length > 0 ? 2500 : 0;
  const grandTotal = itemsSubtotal + shippingCost + platformBuyerFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const orderId = 'INV/' + new Date().getFullYear() + '/TKP-CCT-' + Math.floor(1000 + Math.random() * 9000);
    const trackingNo = 'JNT-' + Date.now().toString().slice(-8);

    // If paying with e-wallet, deduct balance
    if (paymentMethod === 'wallet' && currentUser) {
      if ((currentUser.balance || 0) < grandTotal) {
        alert(`Saldo E-Wallet Anda (Rp ${(currentUser.balance || 0).toLocaleString()}) tidak mencukupi untuk pembayaran Rp ${grandTotal.toLocaleString()}. Silakan gunakan QRIS / VA.`);
        return;
      }
      const updatedUser = {
        ...currentUser,
        balance: (currentUser.balance || 0) - grandTotal,
      };
      setCurrentUser(updatedUser);
    }

    // Record transactions for each cart item
    cartItems.forEach((c, idx) => {
      addTransaction({
        id: `TRX-BUY-${Date.now()}-${idx + 1}`,
        date: new Date().toISOString().split('T')[0],
        fromRole: c.item.sellerRole as any,
        fromName: c.item.sellerName,
        toRole: 'buyer',
        toName: currentUser?.name || 'Siti Rahma (Pembeli)',
        itemName: `${c.item.title} (${c.item.variety})`,
        quantity: `${c.quantity} ${c.item.priceUnit || 'Kg'}`,
        totalAmount: c.item.price * c.quantity,
        status: 'Diproses',
      });
    });

    const receiptObj = {
      orderId,
      trackingNo,
      date: new Date().toLocaleString('id-ID'),
      buyerName: currentUser?.name || 'Siti Rahma',
      buyerOrg: currentUser?.organization || 'Komunitas Penikmat Kopi Nusantara',
      buyerAddress: currentUser?.location || 'Jl. Khatib Sulaiman No. 42, Kota Padang, Sumatera Barat',
      courierName: courierInfo.name,
      items: [...cartItems],
      itemsSubtotal,
      shippingCost,
      platformBuyerFee,
      grandTotal,
      paymentMethod: paymentMethod === 'wallet' ? 'Saldo E-Wallet Circular Trace' : paymentMethod === 'qris' ? 'QRIS Real-Time' : 'Virtual Account Bank',
    };

    // Save to local buyer order records & trigger reactive update
    const newOrderRecord = {
      id: 'ord-' + Date.now(),
      invoiceNo: orderId,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'processing',
      statusLabel: 'Diproses Penjual (Milling / Roasting)',
      sellerName: cartItems[0]?.item.sellerName || 'Penjual sangrAI',
      sellerOrg: cartItems[0]?.item.sellerOrg || 'Mitra sangrAI Terverifikasi',
      sellerPhone: '6281234567890',
      courier: courierInfo.name,
      resiNo: trackingNo,
      totalAmount: grandTotal,
      items: cartItems.map((c) => ({
        title: c.item.title,
        variety: c.item.variety || 'Arabica Specialty',
        origin: c.item.origin || 'Indonesia',
        quantity: c.quantity,
        unit: c.item.stockUnit || 'Kg',
        price: c.item.price,
        subtotal: c.item.price * c.quantity,
        photoUrl: c.item.photoUrl || '',
        batchId: c.item.id,
      })),
    };

    try {
      const existingStr = localStorage.getItem('cct_buyer_orders');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('cct_buyer_orders', JSON.stringify([newOrderRecord, ...existing]));
      window.dispatchEvent(new CustomEvent('cct_order_created', { detail: newOrderRecord }));
    } catch (e) {
      console.error(e);
    }

    setReceiptData(receiptObj);
    setStep('receipt');
    onClearCart();
    if (onSuccessOrder) onSuccessOrder(orderId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Tokopedia Green Top Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-[#00AA5B] to-teal-700 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black shadow-xs">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200 font-extrabold block">
                Keranjang Belanja Pembeli &bull; Circular Trace
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {step === 'cart' ? `Keranjang Belanja Pembeli (${cartItems.length} Produk)` : 'Faktur Bukti Pembelian & Resi Pengiriman'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'cart' && (
            <>
              {/* Delivery Address Card (Tokopedia Style) */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1 text-xs">
                <div className="flex items-center justify-between text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-black">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Alamat Pengiriman Pembeli Terdaftar</span>
                  </span>
                  <span className="text-emerald-700 font-bold">Utama</span>
                </div>
                <div className="font-extrabold text-stone-900 dark:text-white text-sm">
                  {currentUser?.name || 'Siti Rahma'} &bull; <span className="font-mono text-xs font-normal text-stone-600 dark:text-stone-400">{currentUser?.phone || '0812-9988-7711'}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {currentUser?.location || 'Jl. Khatib Sulaiman No. 42, Kota Padang, Sumatera Barat'}
                </p>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                  <span>Daftar Komoditas yang Dibeli:</span>
                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-[11px] text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
                    >
                      Kosongkan Keranjang
                    </button>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div className="p-8 text-center text-stone-400 border border-dashed rounded-2xl">
                    <ShoppingCart className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                    <p className="font-bold text-stone-700 dark:text-stone-300 text-sm">Keranjang Belanja Anda Kosong</p>
                    <p className="text-xs text-stone-400 mt-1">Silakan pilih produk dari katalog marketplace.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                    {cartItems.map(({ item, quantity }) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 bg-white dark:bg-stone-900">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.photoUrl || (item as any).imageUrl || "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120&auto=format&fit=crop&q=80"}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              {item.variety}
                            </span>
                            <h4 className="font-bold text-stone-900 dark:text-white text-xs truncate mt-0.5">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 truncate">
                              Penjual: <strong>{item.sellerName}</strong> &bull; {item.origin}
                            </p>
                            <p className="text-xs font-black text-amber-900 dark:text-amber-400 mt-0.5">
                              Rp {item.price.toLocaleString()} /{item.priceUnit}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-800">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-stone-900 dark:text-white">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Hapus dari keranjang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Courier Selection */}
              {cartItems.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Pilihan Ekspedisi Pengiriman Kopi:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'jnt_cargo', name: 'J&T Cargo (Kopi & Karung)', cost: 25000, etd: '2-3 Hari' },
                      { id: 'jne_reg', name: 'JNE Reguler Express', cost: 18000, etd: '1-2 Hari' },
                      { id: 'sicepat', name: 'SiCepat Cargo B2B', cost: 22000, etd: '2-3 Hari' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCourier(c.id as any)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedCourier === c.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600'
                        }`}
                      >
                        <div className="font-extrabold text-[11px] truncate">{c.name}</div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                          Rp {c.cost.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-500">{c.etd}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Method Selector */}
              {cartItems.length > 0 && (
                <div className="space-y-2 text-xs">
                  <label className="block font-bold text-stone-700 dark:text-stone-300">
                    Pilih Metode Pembayaran:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'wallet'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Saldo E-Wallet</span>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        Saldo: Rp {(currentUser?.balance || 0).toLocaleString()}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'qris'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        <span>QRIS Real-Time</span>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">BCA, GoPay, OVO, Shopee</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('va')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'va'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Virtual Account</span>
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">Mandiri, BCA, BRI, BSI</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Tokopedia Ringkasan Belanja Box */}
              {cartItems.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                  <div className="font-black text-stone-900 dark:text-white uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200 dark:border-stone-800">
                    Ringkasan Belanja Pembeli
                  </div>

                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Total Harga ({cartItems.reduce((acc, c) => acc + c.quantity, 0)} Barang):</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      Rp {itemsSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Total Ongkos Kirim ({courierInfo.name.split(' ')[0]}):</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                      Rp {shippingCost.toLocaleString()}
                    </span>
                  </div>

                  {/* Buyer Platform Fee (Om Novizar: "Buyer kena charge juga") */}
                  <div className="flex justify-between text-amber-800 dark:text-amber-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Biaya Layanan Pembeli (Platform Fee Circular Trace):</span>
                    </span>
                    <span className="font-mono">
                      Rp {platformBuyerFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span>TOTAL TAGIHAN:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-base font-mono">
                      Rp {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout Action Button */}
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#00AA5B] hover:bg-[#03AC0E] active:bg-[#008f4c] text-white font-black text-sm shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Bayar Sekarang (Rp {grandTotal.toLocaleString()}) &rarr;</span>
                </button>
              )}
            </>
          )}

          {/* STEP 2: RECEIPT / BUKTI PEMBELIAN RESMI */}
          {step === 'receipt' && receiptData && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-black text-base text-emerald-950">Pesanan Kopi Berhasil Dibuat!</h3>
                <p className="text-xs text-emerald-800">
                  Pembayaran lunas terverifikasi. Komoditas kopi Anda sedang dipersiapkan oleh penjual.
                </p>
              </div>

              {/* Receipt Details Box */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 font-mono">
                <div className="flex justify-between pb-2 border-b border-stone-200 font-sans">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold block">NOMOR PESANAN:</span>
                    <span className="font-black text-stone-900 text-sm">{receiptData.orderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 font-bold block">NO. RESI KURIR:</span>
                    <span className="font-black text-emerald-700 text-sm">{receiptData.trackingNo}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-stone-700 font-sans">
                  <div><strong>Penerima:</strong> {receiptData.buyerName} ({receiptData.buyerOrg})</div>
                  <div><strong>Alamat Pengiriman:</strong> {receiptData.buyerAddress}</div>
                  <div><strong>Ekspedisi:</strong> {receiptData.courierName}</div>
                  <div><strong>Metode Bayar:</strong> {receiptData.paymentMethod}</div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-stone-900 font-sans">
                  <div className="font-bold mb-1">Rincian Barang:</div>
                  {receiptData.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] text-stone-600">
                      <span>{it.quantity}x {it.item.title}</span>
                      <span className="font-mono">Rp {(it.item.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-[11px] text-stone-600 pt-1">
                    <span>Ongkos Kirim Kurir:</span>
                    <span className="font-mono">Rp {receiptData.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-amber-800 font-bold">
                    <span>Biaya Layanan Pembeli (Platform Charge):</span>
                    <span className="font-mono">Rp {receiptData.platformBuyerFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-2 border-t border-stone-200 text-stone-900">
                    <span>TOTAL DIBAYAR:</span>
                    <span className="text-emerald-700 font-mono text-base">
                      Rp {receiptData.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-stone-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>Cetak Faktur PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Selesai &bull; Tutup</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
          <span>&copy; 2026 sangrAI &bull; Transaksi Terjamin Sah Kemenkumham RI</span>
          <span className="text-emerald-700 font-bold">Traceability Passport Active</span>
        </div>
      </div>
    </div>
  );
};
