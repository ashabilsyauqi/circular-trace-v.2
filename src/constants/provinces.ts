export interface CoffeeOriginPreset {
  id: string;
  name: string;
  regionLabel: string;
  farmName: string;
  location: string;
  province: string;
  altitudeMeters: number;
  altitudeDisplay: string;
  latitude: number;
  longitude: number;
  varieties: string;
  soilType: 'Andosol Vulkanik' | 'Latosol Humus' | 'Regosol Pegunungan' | 'Humus Aluvial';
  shadeTrees: string;
  weatherCondition: 'Cerah Berawan' | 'Hujan Ringan' | 'Berkabut Tebal' | 'Cerah Terik' | 'Hujan Lebat' | 'Sejuk Berangin';
}

export const INDONESIAN_PROVINCES_BY_REGION = [
  {
    region: 'Sumatera (Sentra Kopi Terbesar)',
    provinces: [
      'Sumatera Barat',
      'Aceh',
      'Sumatera Utara',
      'Jambi',
      'Sumatera Selatan',
      'Bengkulu',
      'Lampung',
      'Riau',
      'Kepulauan Riau',
      'Kepulauan Bangka Belitung',
    ],
  },
  {
    region: 'Jawa',
    provinces: [
      'Jawa Barat',
      'Jawa Tengah',
      'Jawa Timur',
      'D.I. Yogyakarta',
      'Banten',
      'DKI Jakarta',
    ],
  },
  {
    region: 'Bali & Nusa Tenggara',
    provinces: [
      'Bali',
      'Nusa Tenggara Timur',
      'Nusa Tenggara Barat',
    ],
  },
  {
    region: 'Sulawesi',
    provinces: [
      'Sulawesi Selatan',
      'Sulawesi Barat',
      'Sulawesi Tengah',
      'Sulawesi Tenggara',
      'Sulawesi Utara',
      'Gorontalo',
    ],
  },
  {
    region: 'Kalimantan',
    provinces: [
      'Kalimantan Barat',
      'Kalimantan Timur',
      'Kalimantan Selatan',
      'Kalimantan Tengah',
      'Kalimantan Utara',
    ],
  },
  {
    region: 'Maluku & Papua',
    provinces: [
      'Papua',
      'Papua Pegunungan',
      'Papua Tengah',
      'Papua Selatan',
      'Papua Barat',
      'Papua Barat Daya',
      'Maluku',
      'Maluku Utara',
    ],
  },
];

export const ALL_INDONESIAN_PROVINCES = INDONESIAN_PROVINCES_BY_REGION.flatMap(
  (r) => r.provinces
);

export const COFFEE_ORIGIN_PRESETS: CoffeeOriginPreset[] = [
  {
    id: 'preset-solok-radjo',
    name: 'Solok Radjo, Lembah Gumanti',
    regionLabel: 'Sumatera Barat (Solok)',
    farmName: 'Kebun Kopi Solok Radjo Lestari',
    location: 'Desa Aie Dingin, Kec. Lembah Gumanti, Kab. Solok',
    province: 'Sumatera Barat',
    altitudeMeters: 1450,
    altitudeDisplay: '1.400 - 1.550 mdpl',
    latitude: -1.0423,
    longitude: 100.7381,
    varieties: 'Sigarar Utang, Kartika, Andungsari',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Kayu Manis (Cassiavera), Alpukat, Suri',
    weatherCondition: 'Sejuk Berangin',
  },
  {
    id: 'preset-agam-singgalang',
    name: 'Agam, Lereng Singgalang',
    regionLabel: 'Sumatera Barat (Agam)',
    farmName: 'Kebun Blok Singgalang Koto Tuo',
    location: 'Nagari Koto Tuo, Kec. IV Koto, Kab. Agam',
    province: 'Sumatera Barat',
    altitudeMeters: 1280,
    altitudeDisplay: '1.200 - 1.350 mdpl',
    latitude: -0.285,
    longitude: 100.32,
    varieties: 'Typica Koto Tuo, Kartika, Lini S-795',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Kayu Manis, Alpukat, Pohon Dadap',
    weatherCondition: 'Berkabut Tebal',
  },
  {
    id: 'preset-tanah-datar',
    name: 'Tanah Datar, Lereng Marapi',
    regionLabel: 'Sumatera Barat (Tanah Datar)',
    farmName: 'Kebun Kopi Lembah Marapi Indah',
    location: 'Nagari Batipuah, Kec. Batipuh, Kab. Tanah Datar',
    province: 'Sumatera Barat',
    altitudeMeters: 1320,
    altitudeDisplay: '1.250 - 1.400 mdpl',
    latitude: -0.4521,
    longitude: 100.4852,
    varieties: 'Sigarar Utang, Ateng Super',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Kayu Manis, Lamtoro, Kina',
    weatherCondition: 'Sejuk Berangin',
  },
  {
    id: 'preset-pangalengan',
    name: 'Pangalengan Gunung Tilu',
    regionLabel: 'Jawa Barat (Bandung)',
    farmName: 'Kebun Blok Pasir Kunci Gn. Tilu',
    location: 'Desa Margamukti, Kec. Pangalengan, Kab. Bandung',
    province: 'Jawa Barat',
    altitudeMeters: 1550,
    altitudeDisplay: '1.500 - 1.620 mdpl',
    latitude: -7.1824,
    longitude: 107.5612,
    varieties: 'Sigarar Utang, Ateng Super, Kartika',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Pohon Sengon, Lamtoro, Alpukat',
    weatherCondition: 'Berkabut Tebal',
  },
  {
    id: 'preset-gayo',
    name: 'Gayo Burni Telong',
    regionLabel: 'Aceh (Bener Meriah)',
    farmName: 'Kebun Lembah Burni Telong Gayo',
    location: 'Kec. Wih Pesam, Kab. Bener Meriah',
    province: 'Aceh',
    altitudeMeters: 1650,
    altitudeDisplay: '1.600 - 1.700 mdpl',
    latitude: 4.7123,
    longitude: 96.8456,
    varieties: 'Tim-Tim, Gayo 1, Abyssinia',
    soilType: 'Latosol Humus',
    shadeTrees: 'Alpukat Gayo, Lamtoro, Jeruk Keprok',
    weatherCondition: 'Sejuk Berangin',
  },
  {
    id: 'preset-kerinci',
    name: 'Kayu Aro Kerinci',
    regionLabel: 'Jambi (Kerinci)',
    farmName: 'Kebun Lereng Gunung Kerinci',
    location: 'Kec. Kayu Aro, Kab. Kerinci',
    province: 'Jambi',
    altitudeMeters: 1600,
    altitudeDisplay: '1.500 - 1.700 mdpl',
    latitude: -1.6967,
    longitude: 101.2589,
    varieties: 'Andungsari, Sigarar Utang, S-795',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Lamtoro, Kayu Manis, Alpukat',
    weatherCondition: 'Berkabut Tebal',
  },
  {
    id: 'preset-kintamani',
    name: 'Kintamani Ulian',
    regionLabel: 'Bali (Bangli)',
    farmName: 'Kebun Desa Ulian Kintamani',
    location: 'Desa Ulian, Kec. Kintamani, Kab. Bangli',
    province: 'Bali',
    altitudeMeters: 1350,
    altitudeDisplay: '1.300 - 1.450 mdpl',
    latitude: -8.2435,
    longitude: 115.3285,
    varieties: 'Kopyol, Kartika, USDA 762',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Jeruk Kintamani, Erythrina',
    weatherCondition: 'Cerah Berawan',
  },
  {
    id: 'preset-bajawa',
    name: 'Bajawa Wolokisa',
    regionLabel: 'NTT (Ngada)',
    farmName: 'Kebun Dataran Tinggi Bajawa',
    location: 'Desa Wolokisa, Kec. Bajawa, Kab. Ngada',
    province: 'Nusa Tenggara Timur',
    altitudeMeters: 1400,
    altitudeDisplay: '1.350 - 1.500 mdpl',
    latitude: -8.825,
    longitude: 120.975,
    varieties: 'Kartika, S-795, Yellow Caturra',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Pohon Kasi, Lamtoro',
    weatherCondition: 'Sejuk Berangin',
  },
  {
    id: 'preset-toraja',
    name: 'Sapan Rantebua Toraja',
    regionLabel: 'Sulawesi Selatan (Toraja)',
    farmName: 'Kebun Sapan Rantebua',
    location: 'Kec. Rantebua, Kab. Toraja Utara',
    province: 'Sulawesi Selatan',
    altitudeMeters: 1800,
    altitudeDisplay: '1.700 - 1.950 mdpl',
    latitude: -2.9833,
    longitude: 119.8833,
    varieties: 'S-795, Typica Toraja',
    soilType: 'Andosol Vulkanik',
    shadeTrees: 'Pohon Cengkeh, Lamtoro, Pinus',
    weatherCondition: 'Sejuk Berangin',
  },
];
