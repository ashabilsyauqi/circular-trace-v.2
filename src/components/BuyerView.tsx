import React, { useState, useMemo, useEffect } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { ALL_INDONESIAN_PROVINCES } from '../constants/provinces';
import {
  ShoppingCart,
  Wallet,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  Store,
  Receipt,
  QrCode,
  Truck,
  CreditCard,
  User,
  Building2,
  Phone,
  Mail,
  Tag,
  Trash2,
  Minus,
  X,
  Heart,
  Award,
  Sparkles,
  Leaf,
  ChevronRight,
  Search,
  Filter,
  Share2,
  Copy,
  AlertCircle,
  Edit2
} from 'lucide-react';
import { UnifiedMarketplace } from './UnifiedMarketplace';
import { TokopediaCartModal, CartItem } from './buyer/TokopediaCartModal';
import { BuyerPassportQrModal } from './buyer/BuyerPassportQrModal';
import { WhatsAppIcon } from '../utils/whatsapp';

export interface BuyerAddress {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  notes?: string;
  isPrimary: boolean;
}

export type OrderStatus = 'unpaid' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export interface BuyerOrderRecord {
  id: string;
  invoiceNo: string;
  date: string;
  status: OrderStatus;
  statusLabel: string;
  sellerName: string;
  sellerOrg: string;
  sellerPhone: string;
  courier: string;
  resiNo: string;
  totalAmount: number;
  items: {
    title: string;
    variety: string;
    origin: string;
    quantity: number;
    unit: string;
    price: number;
    subtotal: number;
    photoUrl: string;
    batchId: string;
  }[];
}

export interface WishlistItem {
  id: string;
  title: string;
  origin: string;
  variety: string;
  processMethod: string;
  scaScore: number;
  price: number;
  priceUnit: string;
  photoUrl: string;
  sellerName: string;
  sellerPhone: string;
}

const INITIAL_ADDRESSES: BuyerAddress[] = [
  {
    id: 'addr-1',
    title: 'Rumah Utama (Default)',
    recipientName: 'Siti Rahma',
    phone: '0812-3456-7890',
    province: 'Sumatera Barat',
    city: 'Kota Padang',
    postalCode: '25173',
    street: 'Jl. Khatib Sulaiman No. 42, Kel. Ulak Karang Selatan, Kec. Padang Utara',
    notes: 'Pagar warna hitam, samping minimarket',
    isPrimary: true,
  },
  {
    id: 'addr-2',
    title: 'Kafe & Roastery Hub Padang',
    recipientName: 'Siti Rahma / Barista Staff',
    phone: '0813-8821-4455',
    province: 'Sumatera Barat',
    city: 'Kota Padang',
    postalCode: '25114',
    street: 'Jl. Ahmad Yani No. 18, Kampung Pondok',
    notes: 'Titip di meja kasir coffee shop',
    isPrimary: false,
  },
  {
    id: 'addr-3',
    title: 'Kantor Perwakilan Jakarta',
    recipientName: 'Budi Hartono (Logistik)',
    phone: '0811-9876-5432',
    province: 'DKI Jakarta',
    city: 'Kota Jakarta Selatan',
    postalCode: '12950',
    street: 'Gedung Wisma Kopi Lt. 4, Jl. Gatot Subroto No. Kav 22',
    notes: 'Bongkar muat barang via loading dock B2',
    isPrimary: false,
  },
];

const INITIAL_ORDERS: BuyerOrderRecord[] = [
  {
    id: 'ord-sim-001',
    invoiceNo: 'INV/20261109/CT/BND-92410',
    date: '09 Nov 2026, 14:15 WIB',
    status: 'processing',
    statusLabel: 'Diproses Roastery (Karsa Craft)',
    sellerName: 'Karsa Craft Roastery',
    sellerOrg: 'Karsa Craft Roastery (Bandung)',
    sellerPhone: '6281234567890',
    courier: 'J&T Cargo Express',
    resiNo: 'JNT-20261109-881',
    totalAmount: 190000,
    items: [
      {
        title: 'Biji Sangrai: Pangalengan Java Preanger - Typica Java Preanger',
        variety: 'Typica Java Preanger (SCA 87.5)',
        origin: 'Pangalengan Java Preanger (Gn. Tilu, 1.600 mdpl)',
        quantity: 2,
        unit: 'Pack (250g)',
        price: 95000,
        subtotal: 190000,
        photoUrl: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&auto=format&fit=crop&q=80',
        batchId: 'RST-KRS-001',
      },
    ],
  },
  {
    id: 'ord-sim-002',
    invoiceNo: 'INV/20261108/CT/BND-78150',
    date: '08 Nov 2026, 10:20 WIB',
    status: 'completed',
    statusLabel: 'Selesai & Diterima Pembeli',
    sellerName: 'CV Malabar Wet & Dry Mill Station',
    sellerOrg: 'CV Malabar Mill (Pangalengan)',
    sellerPhone: '6281388991122',
    courier: 'SiCepat Cargo',
    resiNo: 'SC-20261108-552',
    totalAmount: 625000,
    items: [
      {
        title: 'Green Bean: Ateng Super & Sigarar Utang (Anaerobic Natural)',
        variety: 'Ateng Super & Sigarar Utang',
        origin: 'Pangalengan, Gn. Tilu, Jawa Barat (1.550 mdpl)',
        quantity: 5,
        unit: 'Kg',
        price: 125000,
        subtotal: 625000,
        photoUrl: 'https://images.unsplash.com/photo-1791570923483-648a8f84290f?w=600&auto=format&fit=crop&q=80',
        batchId: 'GB-MLB-001',
      },
    ],
  },
  {
    id: 'ord-sim-003',
    invoiceNo: 'INV/20261107/CT/BND-61022',
    date: '07 Nov 2026, 16:45 WIB',
    status: 'shipping',
    statusLabel: 'Dalam Pengiriman Kurir',
    sellerName: 'Sentosa Specialty Coffee Roastery',
    sellerOrg: 'Sentosa Roastery (Yogyakarta)',
    sellerPhone: '6281311223344',
    courier: 'JNE Trucking',
    resiNo: 'JTR-20261107-119',
    totalAmount: 110000,
    items: [
      {
        title: 'Biji Sangrai: Gayo Natural Anaerobik 250g',
        variety: 'Tim-Tim & Abyssinia (SCA 86.8)',
        origin: 'Burni Telong, Aceh Gayo (1.650 mdpl)',
        quantity: 1,
        unit: 'Pack (250g)',
        price: 110000,
        subtotal: 110000,
        photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        batchId: 'RST-STS-002',
      },
    ],
  },
  {
    id: 'ord-101',
    invoiceNo: 'INV/20261105/CT/88219',
    date: '05 Nov 2026, 14:20 WIB',
    status: 'unpaid',
    statusLabel: 'Menunggu Pembayaran WA',
    sellerName: 'Koperasi Solok Radjo',
    sellerOrg: 'Koperasi Serba Usaha Solok Radjo',
    sellerPhone: '6281234567890',
    courier: 'J&T Cargo',
    resiNo: 'Menunggu Konfirmasi WA',
    totalAmount: 750000,
    items: [
      {
        title: 'Arabica Solok Radjo - Natural Anaerobic',
        variety: 'Typica & Kartika',
        origin: 'Aie Dingin, Solok (1.450 mdpl)',
        quantity: 5,
        unit: 'Kg',
        price: 150000,
        subtotal: 750000,
        photoUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&auto=format&fit=crop&q=80',
        batchId: 'BATCH-SLK-2026-ANA01',
      },
    ],
  },
  {
    id: 'ord-102',
    invoiceNo: 'INV/20261102/CT/87912',
    date: '02 Nov 2026, 09:45 WIB',
    status: 'processing',
    statusLabel: 'Diproses Penjual (Milling / Roasting)',
    sellerName: 'Prosesor Kopi Ranah Minang',
    sellerOrg: 'CV Ranah Minang Specialty',
    sellerPhone: '6281234567890',
    courier: 'J&T Cargo',
    resiNo: 'JT981023812',
    totalAmount: 820000,
    items: [
      {
        title: 'Robusta Pesisir Selatan - Honey Process',
        variety: 'Robusta Fine',
        origin: 'Bayang, Pesisir Selatan (600 mdpl)',
        quantity: 10,
        unit: 'Kg',
        price: 82000,
        subtotal: 820000,
        photoUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=300&auto=format&fit=crop&q=80',
        batchId: 'BATCH-PSS-2026-HNY02',
      },
    ],
  },
  {
    id: 'ord-103',
    invoiceNo: 'INV/20261028/CT/86540',
    date: '28 Okt 2026, 16:10 WIB',
    status: 'shipping',
    statusLabel: 'Sedang Dikirim',
    sellerName: 'Gayo Agro Specialty Mill',
    sellerOrg: 'Koperasi Baitul Qiradh Baburrayyan',
    sellerPhone: '6281234567890',
    courier: 'SiCepat Cargo',
    resiNo: 'SC8901239841',
    totalAmount: 480000,
    items: [
      {
        title: 'Gayo Mountain Organic Specialty Arabica',
        variety: 'Ateng Super & Bourbon',
        origin: 'Takengon, Aceh Tengah (1.500 mdpl)',
        quantity: 3,
        unit: 'Kg',
        price: 160000,
        subtotal: 480000,
        photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
        batchId: 'BATCH-GYO-2026-ORG04',
      },
    ],
  },
  {
    id: 'ord-104',
    invoiceNo: 'INV/20261015/CT/85102',
    date: '15 Okt 2026, 11:30 WIB',
    status: 'completed',
    statusLabel: 'Selesai',
    sellerName: 'Kerinci Specialty Coffee Agro',
    sellerOrg: 'Koperasi ALKO Kerinci',
    sellerPhone: '6281234567890',
    courier: 'JNE Trucking',
    resiNo: 'JTR771239912',
    totalAmount: 1950000,
    items: [
      {
        title: 'Kerinci Kayu Aro Wet Hulled Micro-lot',
        variety: 'Andungsari & Sigararutang',
        origin: 'Kayu Aro, Kerinci (1.600 mdpl)',
        quantity: 15,
        unit: 'Kg',
        price: 130000,
        subtotal: 1950000,
        photoUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&auto=format&fit=crop&q=80',
        batchId: 'BATCH-KRC-2026-WET09',
      },
    ],
  },
];

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'wish-1',
    title: 'Arabica Solok Radjo - Natural Anaerobic 96 Jam',
    origin: 'Solok Radjo, Sumatera Barat (1.450 mdpl)',
    variety: 'Typica & Kartika',
    processMethod: 'Natural Anaerobic 96h',
    scaScore: 87.5,
    price: 150000,
    priceUnit: '/ kg',
    photoUrl: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&auto=format&fit=crop&q=80',
    sellerName: 'Koperasi Solok Radjo',
    sellerPhone: '6281234567890',
  },
  {
    id: 'wish-2',
    title: 'Kerinci Honey Process Micro-lot SCA 86+',
    origin: 'Gunung Tujuh, Kayu Aro (1.550 mdpl)',
    variety: 'Sigararutang',
    processMethod: 'Yellow Honey Process',
    scaScore: 86.75,
    price: 145000,
    priceUnit: '/ kg',
    photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    sellerName: 'Koperasi ALKO Kerinci',
    sellerPhone: '6281234567890',
  },
  {
    id: 'wish-3',
    title: 'Gayo Wine Process Experimental Lot',
    origin: 'Bener Meriah, Aceh (1.400 mdpl)',
    variety: 'Bourbon & Timtim',
    processMethod: 'Wine Extended Fermentation',
    scaScore: 88.0,
    price: 185000,
    priceUnit: '/ kg',
    photoUrl: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&auto=format&fit=crop&q=80',
    sellerName: 'Gayo Agro Specialty Mill',
    sellerPhone: '6281234567890',
  },
];


export const BuyerView: React.FC = () => {
  const { currentUser, setCurrentUser, transactions, addTransaction, setActiveView } = useCoffee();

  // Navigation tab in Tokopedia Left Sidebar
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist' | 'passport' | 'cart' | 'marketplace'>('orders');

  // Orders filter & search
  const [orderFilterStatus, setOrderFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Local states
  const [orders, setOrders] = useState<BuyerOrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cct_buyer_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = new Set(parsed.map((p: any) => p.id));
          const missingInitial = INITIAL_ORDERS.filter((init) => !ids.has(init.id));
          return [...missingInitial, ...parsed];
        }
      }
    } catch (e) {
      console.error('Error loading buyer orders:', e);
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    const handleOrderCreated = (e: any) => {
      if (e.detail) {
        setOrders((prev) => [e.detail, ...prev.filter((o) => o.id !== e.detail.id)]);
      }
    };
    window.addEventListener('cct_order_created', handleOrderCreated);
    return () => window.removeEventListener('cct_order_created', handleOrderCreated);
  }, []);
  const [addresses, setAddresses] = useState<BuyerAddress[]>(INITIAL_ADDRESSES);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [traceModalOrder, setTraceModalOrder] = useState<BuyerOrderRecord | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<'jnt' | 'jne' | 'sicepat'>('jnt');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');

  // Top up & toast notification
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(5000000);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formAddressTitle, setFormAddressTitle] = useState('Rumah Utama');
  const [formRecipient, setFormRecipient] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formProvince, setFormProvince] = useState('Sumatera Barat');
  const [formCity, setFormCity] = useState('Kota Padang');
  const [formPostalCode, setFormPostalCode] = useState('25173');
  const [formStreet, setFormStreet] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formIsPrimary, setFormIsPrimary] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || 'Siti Rahma');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'siti.rahma@circularcoffee.id');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '0812-3456-7890');
  const [profileBirthDate, setProfileBirthDate] = useState('1994-08-17');
  const [profileGender, setProfileGender] = useState<'female' | 'male' | 'other'>('female');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || 'Pegiat kopi specialty & pendukung rantai pasok kopi berkelanjutan ramah lingkungan (Zero Waste & EUDR Compliant).');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80');

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const activeAddress = useMemo(() => {
    return addresses.find((a) => a.id === selectedAddressId) || addresses.find((a) => a.isPrimary) || addresses[0];
  }, [addresses, selectedAddressId]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderFilterStatus === 'all' ? true : o.status === orderFilterStatus;
      const matchSearch =
        orderSearchQuery.trim() === '' ||
        o.invoiceNo.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.sellerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.items.some((i) => i.title.toLowerCase().includes(orderSearchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [orders, orderFilterStatus, orderSearchQuery]);

  // Courier pricing
  const courierDetails = useMemo(() => {
    switch (selectedCourier) {
      case 'jnt':
        return { name: 'J&T Cargo (Spesialis Biji Kopi Bulk)', cost: 25000, etd: '1-3 Hari Kerja' };
      case 'jne':
        return { name: 'JNE Trucking (JTR)', cost: 32000, etd: '2-4 Hari Kerja' };
      case 'sicepat':
        return { name: 'SiCepat Cargo Hemat', cost: 28000, etd: '2-3 Hari Kerja' };
    }
  }, [selectedCourier]);

  // Handlers for Address Book
  const handleOpenNewAddressModal = () => {
    setEditingAddressId(null);
    setFormAddressTitle('Alamat Baru');
    setFormRecipient(profileName);
    setFormPhone(profilePhone);
    setFormProvince('Sumatera Barat');
    setFormCity('Kota Padang');
    setFormPostalCode('');
    setFormStreet('');
    setFormNotes('');
    setFormIsPrimary(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddressModal = (addr: BuyerAddress) => {
    setEditingAddressId(addr.id);
    setFormAddressTitle(addr.title);
    setFormRecipient(addr.recipientName);
    setFormPhone(addr.phone);
    setFormProvince(addr.province);
    setFormCity(addr.city);
    setFormPostalCode(addr.postalCode);
    setFormStreet(addr.street);
    setFormNotes(addr.notes || '');
    setFormIsPrimary(addr.isPrimary);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRecipient.trim() || !formStreet.trim() || !formCity.trim()) {
      alert('Harap lengkapi nama penerima, kota, dan alamat jalan.');
      return;
    }

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingAddressId) {
            return {
              ...a,
              title: formAddressTitle,
              recipientName: formRecipient,
              phone: formPhone,
              province: formProvince,
              city: formCity,
              postalCode: formPostalCode,
              street: formStreet,
              notes: formNotes,
              isPrimary: formIsPrimary,
            };
          }
          return formIsPrimary ? { ...a, isPrimary: false } : a;
        })
      );
      showToast('Alamat berhasil diperbarui!');
    } else {
      const newAddr: BuyerAddress = {
        id: 'addr-' + Date.now(),
        title: formAddressTitle,
        recipientName: formRecipient,
        phone: formPhone,
        province: formProvince,
        city: formCity,
        postalCode: formPostalCode,
        street: formStreet,
        notes: formNotes,
        isPrimary: formIsPrimary || addresses.length === 0,
      };

      setAddresses((prev) => {
        const list = formIsPrimary ? prev.map((a) => ({ ...a, isPrimary: false })) : [...prev];
        return [newAddr, ...list];
      });
      setSelectedAddressId(newAddr.id);
      showToast('Alamat baru berhasil ditambahkan!');
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Alamat telah dihapus.');
    }
  };

  const handleSetPrimaryAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }))
    );
    setSelectedAddressId(id);
    showToast('Alamat utama berhasil diubah!');
  };

  // Handlers for Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
        avatar: profileAvatar,
        bio: profileBio,
      });
    }
    showToast('Profil akun berhasil disimpan!');
  };

  // Handlers for Wishlist
  const handleRemoveWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
    showToast('Kopi dihapus dari wishlist.');
  };

  const handleWishlistDirectWA = (item: WishlistItem) => {
    const lines = [
      'Halo kak Admin ' + item.sellerName + ' 🌿☕,',
      '',
      'Saya melihat kopi specialty ini di *Wishlist CircularTrace Tokopedia* saya:',
      '☕ *Produk:* ' + item.title,
      '📍 *Asal:* ' + item.origin,
      '⚙️ *Proses:* ' + item.processMethod,
      '🏆 *SCA Score:* ' + item.scaScore,
      '💰 *Harga:* Rp ' + item.price.toLocaleString('id-ID') + ' ' + item.priceUnit,
      '',
      '👤 *Data Pembeli:* ' + profileName + ' (' + profilePhone + ')',
      '📍 *Alamat Pengiriman:* ' + (activeAddress ? activeAddress.street + ', ' + activeAddress.city : 'Kota Padang'),
      '',
      'Saya ingin memesan langsung produk ini. Apakah stoknya tersedia dan bisa dibayar via transfer / QRIS? Terima kasih!',
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const url = 'https://wa.me/' + item.sellerPhone + '?text=' + text;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // WhatsApp Order Checkout Flow (Tokopedia Style Direct-to-WA)
  const handleCheckoutViaWhatsApp = () => {
    if (cartItems.length === 0) {
      alert('Keranjang belanja Anda masih kosong. Silakan tambahkan kopi dari Marketplace.');
      return;
    }

    const orderId = 'INV/' + new Date().getFullYear() + '/TKP-CT-' + Math.floor(10000 + Math.random() * 90000);
    const subtotal = cartItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    const courierFee = courierDetails.cost;
    const circularDiscount = 15000;
    const grandTotal = Math.max(0, subtotal + courierFee - circularDiscount);

    const targetPhone = '6281234567890'; // Penjual / Admin CircularTrace

    const lines = [
      'Halo Admin *CircularTrace Coffee*! 🌿☕',
      'Saya ingin menyelesaikan pesanan belanja kopi Tokopedia-style:',
      '',
      '🧾 *NO. INVOICE:* ' + orderId,
      '📅 *TANGGAL:* ' + new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }),
      '',
      '👤 *DATA PEMBELI:*',
      '- Nama: ' + profileName,
      '- No. HP/WA: ' + profilePhone,
      '- Alamat: ' + (activeAddress ? activeAddress.street + ', ' + activeAddress.city + ', ' + activeAddress.province + ' (' + activeAddress.postalCode + ')' : 'Kota Padang'),
      '- Catatan Kurir: ' + (activeAddress?.notes || '-'),
      '',
      '🚚 *PILIHAN EKSPEDISI:* ' + courierDetails.name + ' (' + courierDetails.etd + ')',
      '',
      '📦 *RINCIAN KOPI DIPESAN:*',
      ...cartItems.map(
        (c, idx) =>
          (idx + 1) + '. *' + c.item.title + '* (' + c.item.variety + ')\n' +
          '   Asal: ' + c.item.origin + '\n' +
          '   Jumlah: ' + c.quantity + ' ' + (c.item.stockUnit || 'Kg') + ' x Rp ' + c.item.price.toLocaleString('id-ID') + '\n' +
          '   Subtotal: Rp ' + (c.item.price * c.quantity).toLocaleString('id-ID')
      ),
      '',
      '💰 *RINGKASAN BIAYA:*',
      '- Subtotal Kopi: Rp ' + subtotal.toLocaleString('id-ID'),
      '- Ongkos Kirim: Rp ' + courierFee.toLocaleString('id-ID'),
      '- Diskon Komunitas Sirkular: -Rp ' + circularDiscount.toLocaleString('id-ID'),
      '⭐ *TOTAL TAGIHAN PEMBAYARAN:* Rp ' + grandTotal.toLocaleString('id-ID'),
      '',
      'Mohon kirimkan nomor rekening / barcode QRIS untuk pelunasan pembayaran pesanan ini. Terima kasih! 🙏☕'
    ];

    const waText = encodeURIComponent(lines.join('\n'));
    const waUrl = 'https://wa.me/' + targetPhone + '?text=' + waText;

    // Tambahkan pesanan baru ke state orders dengan status unpaid (Menunggu Pembayaran WA)
    const newOrderRecord: BuyerOrderRecord = {
      id: 'ord-' + Date.now(),
      invoiceNo: orderId,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      status: 'unpaid',
      statusLabel: 'Menunggu Pembayaran WA',
      sellerName: cartItems[0]?.item.sellerName || 'Koperasi Solok Radjo',
      sellerOrg: cartItems[0]?.item.sellerOrg || 'CircularTrace Official',
      sellerPhone: targetPhone,
      courier: courierDetails.name.split(' (')[0],
      resiNo: 'Menunggu Konfirmasi WA',
      totalAmount: grandTotal,
      items: cartItems.map((c) => ({
        title: c.item.title,
        variety: c.item.variety,
        origin: c.item.origin,
        quantity: c.quantity,
        unit: c.item.stockUnit || 'Kg',
        price: c.item.price,
        subtotal: c.item.price * c.quantity,
        photoUrl: c.item.photoUrl,
        batchId: c.item.id,
      })),
    };

    setOrders((prev) => [newOrderRecord, ...prev]);
    setCartItems([]);
    setActiveTab('orders');
    showToast('Pesanan dibuat! Membuka WhatsApp untuk konfirmasi pembayaran...');

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyResi = (resi: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resi);
      showToast('Nomor resi ' + resi + ' disalin ke clipboard!');
    }
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || topUpAmount <= 0) return;
    const newBal = (currentUser.balance || 0) + topUpAmount;
    setCurrentUser({
      ...currentUser,
      balance: newBal,
    });
    setTopUpModalOpen(false);
    showToast('Top-up saldo belanja Rp ' + topUpAmount.toLocaleString() + ' berhasil!');
  };

﻿  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 border border-emerald-400">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button
            onClick={() => setToastNotice(null)}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header Banner - Tokopedia Buyer Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-[#00AA5B] to-teal-900 text-white shadow-xl relative overflow-hidden border border-emerald-600/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Buyer Profile Info */}
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={profileAvatar}
              alt={profileName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-white/80 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Akun Pembeli Resmi &bull; CircularTrace</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-200 text-[10px] font-bold">
                  Tokopedia Experience (Om Novizar)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{profileName}</span>
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>{'Akun Pembeli'}</span>
                <span className="text-emerald-300">&bull;</span>
                <MapPin className="w-4 h-4 text-emerald-200 shrink-0" />
                <span className="truncate max-w-xs">{activeAddress?.city || 'Kota Padang'}, Sumatera Barat</span>
              </p>
            </div>
          </div>

          {/* Right: Saldo E-Wallet & Keranjang Belanja */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Saldo Belanja */}
            <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/40 backdrop-blur-md min-w-[220px]">
              <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
                <span className="flex items-center gap-1 font-bold uppercase tracking-wider text-[11px]">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saldo Dompet Belanja</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-800 text-[10px] font-extrabold text-white">
                  Instan
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                Rp {(currentUser?.balance || 25000000).toLocaleString()}
              </div>
              <button
                type="button"
                onClick={() => setTopUpModalOpen(true)}
                className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Top Up Saldo Belanja</span>
              </button>
            </div>

            {/* Tombol Keranjang Belanja Cepat */}
            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className="bg-white hover:bg-emerald-50 text-emerald-900 p-4 rounded-2xl shadow-lg border border-white/80 transition-all cursor-pointer flex flex-col items-center justify-center min-w-[130px] group"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-[#00AA5B] group-hover:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {cartItems.reduce((acc, c) => acc + c.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="font-black text-xs mt-1">Keranjang</span>
              <span className="text-[10px] text-stone-500 font-bold">{cartItems.length} Produk</span>
            </button>
          </div>
        </div>
      </div>

﻿      {/* Main 2-Column Layout: Tokopedia Left Sidebar + Right Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT SIDEBAR: Tokopedia Account Navigation */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            {/* User Mini Summary Card */}
            <div className="flex items-center gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="relative">
                <img
                  src={profileAvatar}
                  alt={profileName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00AA5B]"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00AA5B] border-2 border-white dark:border-stone-900 rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-900 dark:text-white text-sm truncate">{profileName}</h4>
                <div className="flex items-center gap-1 text-[11px] text-[#00AA5B] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Akun Pembeli</span>
                </div>
              </div>
            </div>

            {/* Circular Impact Metric in Sidebar */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Dampak Sirkular</span>
                </span>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.5 rounded-md font-black">
                  189.2 kg CO₂e
                </span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Anda telah menyelamatkan <strong>33 kg</strong> ampas kopi dari landfill emisi metana.
              </p>
            </div>

            {/* Navigation Menu Links */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 px-3">
                Aktivitas Belanja
              </span>
              {[
                { id: 'orders', label: 'Daftar Pesanan & Status', icon: Package, badge: orders.length },
                { id: 'cart', label: 'Keranjang Belanja', icon: ShoppingCart, badge: cartItems.length },
                { id: 'wishlist', label: 'Wishlist Kopi Favorit', icon: Heart, badge: wishlist.length },
                { id: 'marketplace', label: 'Katalog Marketplace', icon: Store, badge: null },
              ].map((menu) => {
                const Icon = menu.icon;
                const isSelected = activeTab === menu.id;
                return (
                  <button
                    key={menu.id}
                    onClick={() => setActiveTab(menu.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00AA5B] text-white shadow-sm'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                      <span>{menu.label}</span>
                    </div>
                    {menu.badge !== null && menu.badge > 0 && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white text-[#00AA5B]'
                            : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                        }`}
                      >
                        {menu.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Menu Links: Akun & Profil */}
            <div className="space-y-1 pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 px-3">
                Profil & Pengaturan
              </span>
              {[
                { id: 'profile', label: 'Biodata Diri & Akun', icon: User, badge: null },
                { id: 'addresses', label: 'Buku Alamat Pengiriman', icon: MapPin, badge: addresses.length },
                { id: 'passport', label: 'Circular Coffee Passport', icon: Award, badge: null },
              ].map((menu) => {
                const Icon = menu.icon;
                const isSelected = activeTab === menu.id;
                return (
                  <button
                    key={menu.id}
                    onClick={() => setActiveTab(menu.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00AA5B] text-white shadow-sm'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                      <span>{menu.label}</span>
                    </div>
                    {menu.badge !== null && menu.badge > 0 && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-white text-[#00AA5B]'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {menu.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* WhatsApp Direct Help Center */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl p-5 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
              <WhatsAppIcon className="w-4 h-4 text-emerald-600 fill-current" />
              <span>Bantuan Pesanan & Pembayaran WA</span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Ada kendala pengiriman atau butuh verifikasi invoice secara manual?
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20CircularTrace,%20saya%20butuh%20bantuan%20pesanan%20kopi"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-white fill-current" />
              <span>Chat CS WhatsApp (+62 812)</span>
            </a>
          </div>
        </div>

        {/* RIGHT CONTENT PANEL: Dynamic Tokopedia Section */}
        <div className="flex-1 min-w-0 space-y-6">

﻿          {/* TAB 1: DAFTAR PESANAN & STATUS PENGIRIMAN (ORDERS) */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Header Box */}
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#00AA5B]" />
                      <span>Daftar Transaksi Pesanan Kopi</span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Pantau proses milling, roasting, status pembayaran WhatsApp, dan resi kurir pengiriman.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="px-4 py-2 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Belanja Kopi Baru</span>
                  </button>
                </div>

                {/* Sub-status Filter Tabs (Tokopedia Style) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    { id: 'all', label: 'Semua Status' },
                    { id: 'unpaid', label: 'Menunggu Pembayaran (WA)' },
                    { id: 'processing', label: 'Diproses' },
                    { id: 'shipping', label: 'Sedang Dikirim' },
                    { id: 'completed', label: 'Selesai' },
                    { id: 'cancelled', label: 'Dibatalkan' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setOrderFilterStatus(st.id as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        orderFilterStatus === st.id
                          ? 'bg-[#00AA5B] text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nomor invoice, nama produk kopi, atau nama petani / penjual..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B] text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-stone-200 dark:border-stone-800 space-y-3">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">Tidak ada transaksi ditemukan</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Anda belum memiliki pesanan dengan filter status ini. Silakan jelajahi katalog kopi kami.
                  </p>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="mt-2 px-4 py-2 bg-[#00AA5B] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Buka Marketplace
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const statusColor =
                      ord.status === 'unpaid'
                        ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                        : ord.status === 'processing'
                        ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700'
                        : ord.status === 'shipping'
                        ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-700'
                        : ord.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                        : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-700';

                    return (
                      <div
                        key={ord.id}
                        className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                      >
                        {/* Header: Date, Invoice, Store, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-extrabold text-stone-900 dark:text-white flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-[#00AA5B]" />
                              <span>{ord.sellerName}</span>
                            </span>
                            <span className="text-stone-300">&bull;</span>
                            <span className="font-mono text-stone-500 font-bold">{ord.invoiceNo}</span>
                            <span className="text-stone-300">&bull;</span>
                            <span className="text-stone-500">{ord.date}</span>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${statusColor}`}
                          >
                            {ord.statusLabel}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4">
                              <img
                                src={item.photoUrl}
                                alt={item.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <h4 className="font-bold text-stone-900 dark:text-white text-sm line-clamp-1">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                  Varietas: <strong>{item.variety}</strong> &bull; {item.origin}
                                </p>
                                <div className="text-xs text-stone-600 dark:text-stone-300">
                                  {item.quantity} {item.unit} &times; Rp {item.price.toLocaleString('id-ID')}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] text-stone-400 block">Total Harga</span>
                                <span className="font-black text-stone-900 dark:text-white text-sm font-mono">
                                  Rp {item.subtotal.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Delivery & Tracking Info */}
                        <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-stone-800 dark:text-stone-200">
                              Kurir: {ord.courier}
                            </span>
                            <span className="text-stone-400">&bull;</span>
                            <span className="text-stone-500 font-mono">No. Resi: <strong>{ord.resiNo}</strong></span>
                            {ord.resiNo && !ord.resiNo.includes('Menunggu') && (
                              <button
                                onClick={() => handleCopyResi(ord.resiNo)}
                                className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-500 cursor-pointer"
                                title="Salin No Resi"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            {ord.status === 'unpaid'
                              ? 'Segera selesaikan pembayaran via WhatsApp agar penjual dapat memproses pengiriman.'
                              : ord.status === 'processing'
                              ? 'Penjual sedang menyiapkan & melakukan quality check lot kopi Anda.'
                              : ord.status === 'shipping'
                              ? 'Paket dalam perjalanan via kargo menuju alamat Anda.'
                              : 'Pesanan telah diterima dengan baik.'}
                          </div>
                        </div>

                        {/* Card Footer: Total & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div>
                            <span className="text-[10px] text-stone-400 font-bold block">Total Tagihan Pesanan:</span>
                            <span className="text-lg font-black text-stone-900 dark:text-white font-mono">
                              Rp {ord.totalAmount.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Tombol Chat WA Penjual */}
                            <a
                              href={`https://wa.me/${ord.sellerPhone}?text=${encodeURIComponent(
                                'Halo ' + ord.sellerName + ' 🌿☕, saya ingin menanyakan status pesanan saya dengan nomor invoice: ' + ord.invoiceNo + ' senilai Rp ' + ord.totalAmount.toLocaleString('id-ID') + '. Mohon informasinya, terima kasih!'
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                              <span>Chat WA Penjual</span>
                            </a>

                            {/* Tombol Lacak Traceability QR */}
                            <button
                              onClick={() => setTraceModalOrder(ord)}
                              className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5 text-stone-600" />
                              <span>Lacak QR Trace</span>
                            </button>

                            {ord.status === 'unpaid' ? (
                              <a
                                href={`https://wa.me/${ord.sellerPhone}?text=${encodeURIComponent(
                                  'Halo ' + ord.sellerName + ', saya ingin melakukan pembayaran untuk pesanan: ' + ord.invoiceNo + ' sebesar Rp ' + ord.totalAmount.toLocaleString('id-ID') + '. Tolong kirimkan nomor rekening / QRIS pembayaran. Terima kasih!'
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5 fill-current text-white" />
                                <span>Bayar via WA</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => {
                                  showToast('Item telah ditambahkan kembali ke keranjang!');
                                  setActiveTab('cart');
                                }}
                                className="px-4 py-2 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Beli Lagi</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

﻿          {/* TAB 2: PENGATURAN AKUN & BIODATA DIRI (PROFILE) */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
                <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00AA5B]" />
                  <span>Pengaturan Biodata Diri & Profil Pembeli</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Kelola informasi akun Anda untuk memudahkan proses konfirmasi pesanan dan pengiriman kopi.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Photo & Basic details */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <img
                    src={profileAvatar}
                    alt={profileName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#00AA5B] shadow-sm shrink-0"
                  />
                  <div className="space-y-2 flex-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      URL Foto Profil
                    </label>
                    <input
                      type="url"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                    />
                    <span className="text-[10px] text-stone-400">
                      Format gambar: JPG, PNG, atau link Unsplash resolusi tinggi.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                      <span>Nomor Telepon / WhatsApp</span>
                      <span className="text-[10px] text-[#00AA5B] font-bold">Terverifikasi</span>
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={profileBirthDate}
                      onChange={(e) => setProfileBirthDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Jenis Kelamin
                  </label>
                  <div className="flex items-center gap-4">
                    {[
                      { id: 'female', label: 'Perempuan' },
                      { id: 'male', label: 'Laki-Laki' },
                      { id: 'other', label: 'Lainnya' },
                    ].map((g) => (
                      <label key={g.id} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          checked={profileGender === g.id}
                          onChange={() => setProfileGender(g.id as any)}
                          className="accent-[#00AA5B]"
                        />
                        <span>{g.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Bio Singkat / Minat Kopi
                  </label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: BUKU ALAMAT PENGIRIMAN (ADDRESSES) */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#00AA5B]" />
                    <span>Buku Alamat Pengiriman Anda</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Kelola daftar alamat pengiriman multi-lokasi (Rumah, Roastery, Kafe, Kantor) untuk pesanan logistik kopi.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewAddressModal}
                  className="px-4 py-2.5 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Alamat Baru</span>
                </button>
              </div>

              {/* Address Cards List */}
              <div className="space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      addr.isPrimary
                        ? 'border-[#00AA5B] bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-stone-900 dark:text-white text-sm">
                          {addr.title}
                        </span>
                        {addr.isPrimary && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#00AA5B] text-white text-[10px] font-black uppercase tracking-wider">
                            Alamat Utama
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        {!addr.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryAddress(addr.id)}
                            className="text-[#00AA5B] hover:underline font-bold cursor-pointer"
                          >
                            Jadikan Utama
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddressModal(addr)}
                          className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>
                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                      <p className="font-bold">
                        {addr.recipientName}{' '}
                        <span className="font-normal text-stone-500">({addr.phone})</span>
                      </p>
                      <p className="leading-relaxed">
                        {addr.street}, {addr.city}, {addr.province} - {addr.postalCode}
                      </p>
                      {addr.notes && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                          Catatan Kurir: "{addr.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

﻿          {/* TAB 4: WISHLIST KOPI FAVORIT (WISHLIST) */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <span>Wishlist Kopi Specialty Pilihan Anda</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Daftar komoditas kopi specialty yang Anda simpan untuk dibeli atau dipesan via WhatsApp.
                  </p>
                </div>

                <span className="text-xs font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl">
                  {wishlist.length} Kopi Tersimpan
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">Wishlist Anda masih kosong</h4>
                  <p className="text-xs text-stone-400">
                    Jelajahi katalog marketplace dan klik ikon hati untuk menyimpan kopi favorit.
                  </p>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="px-4 py-2 bg-[#00AA5B] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Buka Katalog Kopi
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden flex flex-col hover:border-emerald-400 transition-all group"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-black border border-emerald-500/40 backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>SCA {item.scaScore}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/50 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          title="Hapus dari Wishlist"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">
                            {item.origin}
                          </span>
                          <h4 className="font-black text-stone-900 dark:text-white text-sm leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            Metode Olah: <strong>{item.processMethod}</strong> &bull; {item.variety}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                          <div>
                            <span className="text-[10px] text-stone-400 block">Harga Penjual:</span>
                            <span className="text-base font-black text-stone-900 dark:text-white font-mono">
                              Rp {item.price.toLocaleString('id-ID')} <span className="text-xs font-normal text-stone-500">{item.priceUnit}</span>
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleWishlistDirectWA(item)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                            <span>Pesan via WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CIRCULAR COFFEE PASSPORT (PASSPORT) */}
          {activeTab === 'passport' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black uppercase">
                    Blockchain-Inspired Lineage
                  </span>
                </div>
                <h3 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2 mt-1">
                  <Award className="w-6 h-6 text-[#00AA5B]" />
                  <span>Circular Trace Coffee Passport &bull; Konsumen Hijau</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Paspor digital kontribusi Anda terhadap rantai pasok kopi sirkular bebas deforestasi (EUDR) dan daur ulang limbah ampas/kulit kopi.
                </p>
              </div>

              {/* Impact Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                    Emisi Metana Dihindari
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-900 dark:text-emerald-100 font-mono">
                    189.2 <span className="text-sm font-sans">kg CO₂e</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Dihitung berdasarkan 33 kg ampas kopi yang diolah menjadi briket &amp; bio-kompos.
                  </p>
                </div>

                <div className="bg-teal-50 dark:bg-teal-950/40 p-5 rounded-2xl border border-teal-200 dark:border-teal-800 space-y-1">
                  <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
                    Kopi Bersertifikat EUDR
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-100 font-mono">
                    33.0 <span className="text-sm font-sans">Kg Biji Kopi</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    100% terlacak poligon geolokasi kebun bebas deforestasi.
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                    Petani Lokal Terdampak
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-900 dark:text-amber-100 font-mono">
                    12 <span className="text-sm font-sans">Keluarga Petani</span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Mendapatkan premi harga wajar (Fair Trade &amp; Direct Sourcing).
                  </p>
                </div>
              </div>

              {/* Lencana Kehormatan Konsumen Sirkular */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-stone-900 dark:text-white text-sm">
                  Lencana Apresiasi Sirkularitas Anda
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: 'EUDR Compliance Supporter', desc: 'Membeli lot kopi dengan verifikasi poligon kebun bebas deforestasi', icon: ShieldCheck, color: 'text-emerald-600' },
                    { title: 'Zero-Waste Husk Champion', desc: 'Mendukung daur ulang 100% cascara & pupuk kompos organik', icon: Leaf, color: 'text-teal-600' },
                    { title: 'Direct Farm Connoisseur', desc: 'Membeli langsung dari koperasi tani Solok Radjo & Kerinci', icon: Award, color: 'text-amber-600' },
                  ].map((badge, idx) => {
                    const BIcon = badge.icon;
                    return (
                      <div key={idx} className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-start gap-3 bg-stone-50 dark:bg-stone-800/40">
                        <BIcon className={`w-5 h-5 shrink-0 ${badge.color}`} />
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-xs text-stone-900 dark:text-white">{badge.title}</h5>
                          <p className="text-[11px] text-stone-500 leading-snug">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

﻿          {/* TAB 6: KERANJANG BELANJA & CHECKOUT WA (CART) */}
          {activeTab === 'cart' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#00AA5B]" />
                    <span>Keranjang Belanja Kopi (Tokopedia Direct Checkout)</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Pilih kuantitas kopi, kurir kargo, alamat pengiriman, dan selesaikan transaksi langsung via WhatsApp Penjual.
                  </p>
                </div>

                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCartItems([])}
                    className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                  >
                    Kosongkan Keranjang
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">Keranjang belanja Anda masih kosong</h4>
                  <p className="text-xs text-stone-400">
                    Silakan pilih kopi specialty dari petani &amp; roastery di katalog Marketplace kami.
                  </p>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className="px-4 py-2 bg-[#00AA5B] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Mulai Belanja Kopi
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Cart Item List & Logistics options */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Items List */}
                    <div className="space-y-3">
                      {cartItems.map((c) => (
                        <div
                          key={c.item.id}
                          className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={c.item.photoUrl}
                              alt={c.item.title}
                              className="w-16 h-16 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                                {c.item.title}
                              </h5>
                              <p className="text-[11px] text-stone-500">
                                {c.item.origin} &bull; {c.item.variety}
                              </p>
                              <span className="font-bold text-xs text-[#00AA5B] font-mono">
                                Rp {c.item.price.toLocaleString('id-ID')} / {c.item.priceUnit || 'Kg'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => {
                                  if (c.quantity > 1) {
                                    setCartItems((prev) =>
                                      prev.map((i) => (i.item.id === c.item.id ? { ...i, quantity: i.quantity - 1 } : i))
                                    );
                                  }
                                }}
                                className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 flex items-center justify-center text-stone-700 dark:text-stone-300 text-xs font-bold cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-stone-900 dark:text-white font-mono">
                                {c.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setCartItems((prev) =>
                                    prev.map((i) => (i.item.id === c.item.id ? { ...i, quantity: i.quantity + 1 } : i))
                                  );
                                }}
                                className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 flex items-center justify-center text-stone-700 dark:text-stone-300 text-xs font-bold cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => setCartItems((prev) => prev.filter((i) => i.item.id !== c.item.id))}
                              className="p-2 text-stone-400 hover:text-red-500 cursor-pointer"
                              title="Hapus Barang"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Address Selector for Delivery */}
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#00AA5B]" />
                          <span>Alamat Pengiriman Terpilih</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('addresses')}
                          className="text-[#00AA5B] hover:underline cursor-pointer"
                        >
                          Kelola Alamat
                        </button>
                      </div>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                      >
                        {addresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.title} - {a.recipientName} ({a.city}, {a.province})
                          </option>
                        ))}
                      </select>
                      {activeAddress && (
                        <p className="text-[11px] text-stone-500 leading-snug">
                          {activeAddress.street}, {activeAddress.city}, {activeAddress.province} - {activeAddress.postalCode} (Penerima: {activeAddress.recipientName} / {activeAddress.phone})
                        </p>
                      )}
                    </div>

                    {/* Courier Selector */}
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Pilihan Kurir Ekspedisi Kargo</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'jnt', name: 'J&T Cargo', etd: '1-3 hari', fee: 25000, desc: 'Spesialis Kopi Bulk' },
                          { id: 'jne', name: 'JNE Trucking (JTR)', etd: '2-4 hari', fee: 32000, desc: 'Kargo Jalur Darat' },
                          { id: 'sicepat', name: 'SiCepat Cargo', etd: '2-3 hari', fee: 28000, desc: 'Cepat & Hemat' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCourier(c.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedCourier === c.id
                                ? 'border-[#00AA5B] bg-emerald-50 dark:bg-emerald-950/40 shadow-xs'
                                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'
                            }`}
                          >
                            <span className="font-bold text-xs block text-stone-900 dark:text-white">{c.name}</span>
                            <span className="text-[11px] text-[#00AA5B] font-mono font-bold block">
                              Rp {c.fee.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-stone-400 block">{c.etd} &bull; {c.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Col: Ringkasan Belanja & Tombol WhatsApp */}
                  <div className="bg-stone-50 dark:bg-stone-800/40 p-5 rounded-3xl border border-stone-200 dark:border-stone-700 space-y-4 h-fit">
                    <h4 className="font-black text-sm text-stone-900 dark:text-white pb-3 border-b border-stone-200 dark:border-stone-700">
                      Ringkasan Belanja
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-stone-600 dark:text-stone-400">
                        <span>Total Harga ({cartItems.reduce((acc, c) => acc + c.quantity, 0)} barang)</span>
                        <span className="font-mono text-stone-900 dark:text-white font-bold">
                          Rp {cartItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex justify-between text-stone-600 dark:text-stone-400">
                        <span>Ongkos Kirim ({courierDetails.name.split(' (')[0]})</span>
                        <span className="font-mono text-stone-900 dark:text-white font-bold">
                          Rp {courierDetails.cost.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>Diskon Komunitas Sirkular</span>
                        <span className="font-mono">-Rp 15.000</span>
                      </div>

                      <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center text-sm">
                        <span className="font-black text-stone-900 dark:text-white">Total Tagihan</span>
                        <span className="font-black text-base sm:text-lg text-[#00AA5B] font-mono">
                          Rp {Math.max(
                            0,
                            cartItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0) +
                              courierDetails.cost -
                              15000
                          ).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Checkout Button - USER REQUEST: Direct ke WA dulu */}
                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCheckoutViaWhatsApp}
                        className="w-full py-3 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 group"
                      >
                        <WhatsAppIcon className="w-5 h-5 fill-current text-white group-hover:scale-110 transition-transform" />
                        <span>Konfirmasi &amp; Bayar via WhatsApp</span>
                      </button>
                      <p className="text-[10px] text-stone-500 text-center leading-relaxed">
                        Saat diklik, Anda akan langsung diarahkan ke WhatsApp Admin/Penjual dengan rincian invoice lengkap untuk instruksi transfer/QRIS.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: KATALOG BELANJA MARKETPLACE (MARKETPLACE) */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Sebagai <strong>Akun Pembeli</strong>, Anda dapat langsung memesan komoditas kopi specialty langsung dari petani &amp; prosesor terverifikasi tanpa biaya langganan.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('cart')}
                  className="px-3.5 py-1.5 bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Lihat Keranjang ({cartItems.length})</span>
                </button>
              </div>

              <UnifiedMarketplace />
            </div>
          )}

        </div>
      </div>

﻿      {/* MODAL TAMBAH / UBAH ALAMAT PENGIRIMAN */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h4 className="font-black text-stone-900 dark:text-white text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00AA5B]" />
                <span>{editingAddressId ? 'Ubah Alamat Pengiriman' : 'Tambah Alamat Pengiriman Baru'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 flex items-center justify-center text-stone-600 dark:text-stone-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Label Alamat (Contoh: Rumah, Kantor, Toko Kopi)
                </label>
                <input
                  type="text"
                  value={formAddressTitle}
                  onChange={(e) => setFormAddressTitle(e.target.value)}
                  placeholder="Misal: Rumah Utama, Kafe Cabang Padang"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Nama Penerima
                  </label>
                  <input
                    type="text"
                    value={formRecipient}
                    onChange={(e) => setFormRecipient(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Provinsi (38 Provinsi Indonesia)
                  </label>
                  <select
                    value={formProvince}
                    onChange={(e) => setFormProvince(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                  >
                    {ALL_INDONESIAN_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    value={formPostalCode}
                    onChange={(e) => setFormPostalCode(e.target.value)}
                    placeholder="25173"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Kota / Kabupaten
                </label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  placeholder="Misal: Kota Padang, Kab. Solok"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Alamat Lengkap &amp; Patokan
                </label>
                <textarea
                  rows={2}
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  placeholder="Nama jalan, nomor rumah/ruko, RT/RW, kelurahan, kecamatan"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Catatan untuk Kurir Logistik (Opsional)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Titipkan di pos satpam depan gerbang"
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formIsPrimary}
                  onChange={(e) => setFormIsPrimary(e.target.checked)}
                  className="accent-[#00AA5B]"
                />
                <span className="font-bold">Jadikan sebagai alamat pengiriman utama</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00AA5B] hover:bg-[#03AC0E] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Alamat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TOP UP SALDO */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h4 className="font-black text-stone-900 dark:text-white text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#00AA5B]" />
                <span>Top Up Saldo Belanja E-Wallet</span>
              </h4>
              <button
                type="button"
                onClick={() => setTopUpModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 flex items-center justify-center text-stone-600 dark:text-stone-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Pilih Nominal Top Up
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[1000000, 2500000, 5000000, 10000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`p-3 rounded-xl border text-center font-mono font-bold text-xs transition-all cursor-pointer ${
                        topUpAmount === amt
                          ? 'border-[#00AA5B] bg-emerald-50 dark:bg-emerald-950/40 text-[#00AA5B]'
                          : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Nominal Kustom (Rp)
                </label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono focus:outline-none focus:border-[#00AA5B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setTopUpModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00AA5B] hover:bg-[#03AC0E] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Isi Saldo Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOKOPEDIA CART MODAL IF OPEN */}
      {isCartModalOpen && (
        <TokopediaCartModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={(itemId, newQty) => {
            setCartItems((prev) =>
              prev.map((c) => (c.item.id === itemId ? { ...c, quantity: newQty } : c))
            );
          }}
          onRemoveItem={(itemId) => {
            setCartItems((prev) => prev.filter((c) => c.item.id !== itemId));
          }}
          onClearCart={() => setCartItems([])}
          onSuccessOrder={(orderId) => {
            showToast('Pesanan ' + orderId + ' berhasil diproses!');
            setActiveTab('orders');
          }}
        />
      )}

      {/* BUYER PASSPORT & BARCODE / QR MODAL */}
      <BuyerPassportQrModal
        isOpen={!!traceModalOrder}
        onClose={() => setTraceModalOrder(null)}
        order={traceModalOrder}
      />
    </div>
  );
};

