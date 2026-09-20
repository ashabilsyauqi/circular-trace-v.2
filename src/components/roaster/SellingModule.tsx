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
  Calendar,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { SalesOrder, WholesaleCustomer, SOItem } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { INITIAL_WHOLESALE_CUSTOMERS } from '../../data/mockRoasterErpData';
import { OdooControlPanel } from '../odoo/OdooControlPanel';
import { OdooStatusPipeline, OdooPipelineStage } from '../odoo/OdooStatusPipeline';
import { OdooSmartStatButton } from '../odoo/OdooSmartStatButton';
import { OdooChatter } from '../odoo/OdooChatter';

const SO_PIPELINE_STAGES: OdooPipelineStage[] = [
  { id: 'quotation', label: 'Penawaran (Quote)' },
  { id: 'confirmed', label: 'Terkonfirmasi' },
  { id: 'in_production', label: 'Produksi Sangrai' },
  { id: 'dispatched', label: 'Terkirim ke Cafe' },
];

export const SellingModule: React.FC = () => {
  const { salesOrders, createSalesOrder, dispatchSalesOrder, roastedLots } = useCoffee();

  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateSoOpen, setIsCreateSoOpen] = useState(false);
  const [detailModalSO, setDetailModalSO] = useState<SalesOrder | null>(null);
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

  const filteredSOs = salesOrders.filter((so) => {
    const matchesQuery =
      so.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      so.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      so.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || so.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Subtab Toggle Buttons */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Sales Orders Wholesale ({salesOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Mitra Cafe CRM ({customers.length})</span>
        </button>
      </div>

      {/* Odoo 19 Control Panel */}
      <OdooControlPanel
        breadcrumbs={[
          { label: 'Penjualan & Distribusi' },
          { label: activeTab === 'orders' ? 'Sales Orders' : 'Klien Cafe' },
        ]}
        primaryActionLabel={activeTab === 'orders' ? '+ Sales Order' : undefined}
        onPrimaryAction={activeTab === 'orders' ? () => setIsCreateSoOpen(true) : undefined}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={
          activeTab === 'orders'
            ? [
                { id: 'all', label: 'Semua Status' },
                { id: 'confirmed', label: 'Terkonfirmasi' },
                { id: 'in_production', label: 'Sedang Disangrai' },
                { id: 'dispatched', label: 'Terkirim ke Cafe' },
              ]
            : []
        }
        recordCount={activeTab === 'orders' ? filteredSOs.length : filteredCustomers.length}
      />

      {/* TAB 1: SALES ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
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
                {filteredSOs.map((so) => {
                  const totalPacks = so.items.reduce((acc, i) => acc + i.quantity, 0);
                  return (
                    <tr
                      key={so.id}
                      onClick={() => setDetailModalSO(so)}
                      className="hover:bg-stone-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#714B67] group-hover:underline">
                          {so.soNumber}
                        </div>
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

                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {so.status !== 'dispatched' ? (
                          <button
                            onClick={() => dispatchSalesOrder(so.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Kirim ke Cafe
                          </button>
                        ) : (
                          <button
                            onClick={() => setDetailModalSO(so)}
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition-colors"
                          >
                            Detail SO
                          </button>
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
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4"
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

                <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-stone-200/80 text-xs space-y-1.5 mt-4">
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
                  className="px-3 py-1.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white font-bold text-[11px] transition-colors shadow-2xs"
                >
                  + Buat Pesanan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ODOO 19 SO DETAIL & INSPECTION MODAL */}
      {detailModalSO && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-[#F8F9FA] px-6 py-4 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#714B67] text-white">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 font-mono">{detailModalSO.soNumber}</h3>
                  <p className="text-[10px] text-stone-500">
                    Klien: {detailModalSO.customerName} • Target Kirim: {detailModalSO.dueDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <OdooStatusPipeline
                  stages={SO_PIPELINE_STAGES}
                  currentStageId={detailModalSO.status}
                />
                <button
                  onClick={() => setDetailModalSO(null)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Smart Stat Buttons */}
            <div className="px-6 py-3 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <OdooSmartStatButton
                icon={<Package className="w-4 h-4" />}
                value={`${detailModalSO.items.reduce((acc, i) => acc + i.quantity, 0)} Pack`}
                label="Volume Pesanan"
                color="purple"
              />
              <OdooSmartStatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${(detailModalSO.totalAmount / 1000).toLocaleString()}k`}
                label="Invoice Total"
                color="emerald"
              />
              <OdooSmartStatButton
                icon={<Truck className="w-4 h-4" />}
                value={detailModalSO.status === 'dispatched' ? 'Terkirim' : 'Siap Kirim'}
                label="Status Kurir"
                color="blue"
              />
              <OdooSmartStatButton
                icon={<ShieldCheck className="w-4 h-4" />}
                value="QR QRIS Lunas"
                label="Pembayaran"
                color="amber"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#714B67]" /> Rincian Produk Biji Sangrai
                </h4>
                {detailModalSO.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-200/60 last:border-0">
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{item.productName}</div>
                      <div className="text-[11px] text-stone-500">
                        {item.roastLevel} • Format: {item.packageSize}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-900">
                        {item.quantity} Pack @ Rp {item.unitPrice.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-bold text-[#714B67]">
                        = Rp {item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {detailModalSO.status !== 'dispatched' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      dispatchSalesOrder(detailModalSO.id);
                      setDetailModalSO(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    Kirim Pesanan & Terbitkan Sertifikat Silsilah
                  </button>
                </div>
              )}

              {/* Odoo Chatter */}
              <div className="pt-4 border-t border-stone-200">
                <OdooChatter
                  documentTitle={`Sales Order #${detailModalSO.soNumber}`}
                  initialMessages={[
                    {
                      id: 'so-msg-1',
                      author: detailModalSO.customerName,
                      type: 'message',
                      content: `Pesanan wholesale diterima. Catatan pengiriman: ${detailModalSO.notes}`,
                      timestamp: detailModalSO.dueDate,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
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
              <div className="p-2.5 rounded-xl bg-[#714B67]/10 text-[#714B67]">
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Format Kemasan
                  </label>
                  <select
                    value={soPackageSize}
                    onChange={(e) => setSoPackageSize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-black focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              <div className="bg-[#714B67]/5 p-3 rounded-2xl border border-[#714B67]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-600 uppercase font-bold block">Total Pesanan:</span>
                  <span className="text-sm font-black text-[#714B67]">{soQuantity} {soPackageSize}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-600 uppercase font-bold block">Total Invoice:</span>
                  <span className="text-sm font-black text-[#714B67]">
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
                  className="px-6 py-2.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
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
