import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Award,
  DollarSign,
  User,
  Send,
  Building,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { SalesOrder, WholesaleCustomer, SOItem } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { INITIAL_WHOLESALE_CUSTOMERS } from '../../data/mockRoasterErpData';

export const SellingModule: React.FC = () => {
  const { salesOrders, createSalesOrder, dispatchSalesOrder, roastedLots } = useCoffee();

  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateSoOpen, setIsCreateSoOpen] = useState(false);
  const [customers, setCustomers] = useState<WholesaleCustomer[]>(INITIAL_WHOLESALE_CUSTOMERS);

  // Form State for Sales Order
  const [soCustomerName, setSoCustomerName] = useState('Seduh Teduh Specialty Coffee Shop');
  const [soDueDate, setSoDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [soItemName, setSoItemName] = useState('Java Frinsa Anaerobic Natural 250g');
  const [soItemRoastLevel, setSoItemRoastLevel] = useState('Light Roast');
  const [soPackageSize, setSoPackageSize] = useState('Pack 250g');
  const [soQuantity, setSoQuantity] = useState<number>(30);
  const [soUnitPrice, setSoUnitPrice] = useState<number>(95000);
  const [soShippingCost, setSoShippingCost] = useState<number>(75000);
  const [soNotes, setSoNotes] = useState('Pesanan rutin mingguan untuk barista bar.');

  // Metrics
  const totalRevenue = salesOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const inProductionCount = salesOrders.filter(
    (s) => s.status === 'in_production' || s.status === 'confirmed'
  ).length;
  const dispatchedCount = salesOrders.filter((s) => s.status === 'dispatched').length;

  const handleCreateSoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemTotal = soQuantity * soUnitPrice;

    const newItem: SOItem = {
      id: `soi-${Date.now().toString().slice(-4)}`,
      productName: soItemName,
      roastLevel: soItemRoastLevel,
      packageSize: soPackageSize,
      quantity: Number(soQuantity),
      unitPrice: Number(soUnitPrice),
      totalPrice: itemTotal,
    };

    createSalesOrder({
      customerId: 'cust-1',
      customerName: soCustomerName,
      dueDate: soDueDate,
      status: 'confirmed',
      items: [newItem],
      subtotal: itemTotal,
      taxAmount: 0,
      shippingCost: Number(soShippingCost),
      totalAmount: itemTotal + Number(soShippingCost),
      paymentStatus: 'paid',
      notes: soNotes,
    });

    setIsCreateSoOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Omzet Penjualan (SO)"
          value={`Rp ${totalRevenue.toLocaleString()}`}
          subtitle={`${salesOrders.length} Pesanan Wholesale`}
          trend={{ value: '+24.5% MoM', isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Pesanan Sedang Diproduksi"
          value={`${inProductionCount} Order`}
          subtitle="Terkoneksi ke Antrean Work Order"
          trend={{ value: 'Prioritas Sangrai', isPositive: true }}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Pesanan Terkirim (Dispatched)"
          value={`${dispatchedCount} Selesai`}
          subtitle="Sertifikat Traceability Terbit"
          trend={{ value: '100% On Time', isPositive: true }}
          icon={<Truck className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Klien Cafe Mitra (B2B)"
          value={`${customers.length} Akun`}
          subtitle="Coffee Shop Partner Direct Trade"
          trend={{ value: 'Repeat Order Tinggi', isPositive: true }}
          icon={<Building className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Tabs & Add SO */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Sales Orders Wholesale ({salesOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'customers'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building className="w-4 h-4 text-amber-600" />
            <span>Klien Cafe & CRM ({customers.length})</span>
          </button>
        </div>

        {activeTab === 'orders' && (
          <button
            onClick={() => setIsCreateSoOpen(true)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Buat Sales Order Baru</span>
          </button>
        )}
      </div>

      {/* TAB 1: SALES ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. SO</th>
                  <th className="py-3.5 px-4">Customer Cafe</th>
                  <th className="py-3.5 px-4">Item Produk & Kemasan</th>
                  <th className="py-3.5 px-4">Total Qty (Packs)</th>
                  <th className="py-3.5 px-4">Nilai Pesanan (Rp)</th>
                  <th className="py-3.5 px-4">Status Pemenuhan</th>
                  <th className="py-3.5 px-4 text-right">Aksi Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {salesOrders.map((so) => {
                  const totalPacks = so.items.reduce((acc, i) => acc + i.quantity, 0);
                  return (
                    <tr key={so.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-stone-900">{so.soNumber}</div>
                        <div className="text-[10px] text-stone-400">Due: {so.dueDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{so.customerName}</div>
                        <div className="text-[10px] text-stone-400">Wholesale Account</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {so.items.map((item, idx) => (
                            <div key={idx} className="font-medium text-stone-800">
                              {item.productName} ({item.quantity} {item.packageSize})
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900 text-sm">
                        {totalPacks} Pack
                      </td>

                      <td className="py-3.5 px-4 font-black text-stone-900">
                        Rp {so.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {so.status === 'dispatched' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 flex items-center gap-1 w-fit">
                            <Truck className="w-3 h-3" /> Terkirim ke Cafe
                          </span>
                        )}
                        {so.status === 'in_production' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" /> Sedang Disangrai
                          </span>
                        )}
                        {so.status === 'confirmed' && (
                          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Terkonfirmasi
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {so.status !== 'dispatched' ? (
                          <button
                            onClick={() => dispatchSalesOrder(so.id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-xs flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Kirim ke Cafe
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WHOLESALE CUSTOMERS CRM */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {customers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {cust.tier === 'tier_1_vip' ? '⭐ VIP Account' : 'Regular Wholesale'}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Diskon: {cust.discountPercent}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">{cust.businessName}</h3>
                <p className="text-xs text-stone-500 mt-0.5">PIC: <strong>{cust.contactPerson}</strong></p>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs space-y-1.5 mt-4">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{cust.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">Direct Trade Partner</span>
                <button
                  onClick={() => {
                    setSoCustomerName(cust.businessName);
                    setIsCreateSoOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] transition-colors"
                >
                  + Buat Pesanan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SALES ORDER MODAL */}
      {isCreateSoOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900">
            <button
              onClick={() => setIsCreateSoOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-2.5 rounded-xl bg-stone-900 text-white">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Buat Sales Order Wholesale Cafe</h3>
                <p className="text-xs text-stone-500">Kirim pasokan biji sangrai langsung ke coffee shop partner.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSoSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Customer Cafe
                  </label>
                  <input
                    type="text"
                    required
                    value={soCustomerName}
                    onChange={(e) => setSoCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Target Tanggal Pengiriman
                  </label>
                  <input
                    type="date"
                    required
                    value={soDueDate}
                    onChange={(e) => setSoDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Produk Biji Sangrai
                  </label>
                  <input
                    type="text"
                    required
                    value={soItemName}
                    onChange={(e) => setSoItemName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Format Kemasan
                  </label>
                  <select
                    value={soPackageSize}
                    onChange={(e) => setSoPackageSize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pack 200g">Pack 200g Tin Can</option>
                    <option value="Pack 250g">Pack 250g Standing Pouch</option>
                    <option value="Bag 500g">Bag 500g Pouch</option>
                    <option value="Bag 1kg">Bag 1kg Wholesale Valve</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Jumlah Pesanan (Packs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={soQuantity}
                    onChange={(e) => setSoQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={soUnitPrice}
                    onChange={(e) => setSoUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-black focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Pesanan:</span>
                  <span className="text-sm font-black text-emerald-950">{soQuantity} {soPackageSize}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Invoice:</span>
                  <span className="text-sm font-black text-emerald-950">
                    Rp {((soQuantity * soUnitPrice) + Number(soShippingCost)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateSoOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Sales Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
