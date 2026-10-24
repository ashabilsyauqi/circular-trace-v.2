import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check, X, Camera, Sparkles } from 'lucide-react';

interface ProductImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  categoryHint?: 'cherry' | 'green_bean' | 'roasted_bean' | 'cafe' | 'all';
}

const PRESET_COFFEE_PHOTOS = [
  {
    title: 'Ceri Merah Matang (Harvest)',
    tag: 'Ceri Kopi',
    url: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Biji Green Bean Olahan (Mill)',
    tag: 'Green Bean',
    url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Biji Sangrai Utuh (Roasted)',
    tag: 'Roastery',
    url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Kemasan Pouch Artisan 250g',
    tag: 'Kemasan',
    url: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Seduhan Cangkir Specialty',
    tag: 'Cafe Brew',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Drip Bag Sachet Travel',
    tag: 'Retail Cafe',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
  },
];

export const ProductImageField: React.FC<ProductImageFieldProps> = ({
  value,
  onChange,
  label = 'Foto / Gambar Produk',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
        setUrlInput('');
      }
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
  };

  const handleSelectPreset = (url: string) => {
    onChange(url);
    setUrlInput('');
  };

  const handleClearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-stone-800 tracking-tight flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>{label}</span>
          <span className="text-rose-500 font-bold">*</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClearImage}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Hapus Gambar</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-stone-900 font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-amber-600" />
          <span>Upload File (HP / PC)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-white text-stone-900 font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Paste URL Gambar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-white text-stone-900 font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Foto Kopi Pilihan</span>
        </button>
      </div>

      {/* Tab 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="product-image-upload-input"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/40 p-4 rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-500 group-hover:text-amber-600 group-hover:scale-105 transition-all">
              <Camera className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-stone-800">
              Klik untuk pilih gambar dari galeri HP atau komputer
            </p>
            <p className="text-[10px] text-stone-500">Mendukung format JPG, PNG, WEBP (Maksimal 5 MB)</p>
          </div>
          {uploadError && <p className="text-xs text-rose-600 font-medium">{uploadError}</p>}
        </div>
      )}

      {/* Tab 2: URL Input */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/... atau tautan gambar Google"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shrink-0 transition-colors"
            >
              Terapkan
            </button>
          </div>
          <p className="text-[10px] text-stone-500">
            Anda dapat mengambil tautan foto bebas dari Google Images atau Unsplash lalu tempelkan di atas.
          </p>
        </div>
      )}

      {/* Tab 3: Preset Curated Photos */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <p className="text-[11px] text-stone-500 font-medium">
            Pilih foto bertema kopi specialty berkualitas tinggi di bawah ini:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_COFFEE_PHOTOS.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-16 object-cover" />
                  <div className="p-1.5 bg-white text-[10px] font-bold text-stone-800 truncate">
                    {preset.title}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Image Preview Box */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950/5">
          <div className="aspect-video w-full max-h-48 overflow-hidden bg-stone-900">
            <img src={value} alt="Preview Produk" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Pratinjau Foto Marketplace</span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Belum ada foto yang dipilih. Silakan upload file atau pilih salah satu foto di atas.</span>
        </div>
      )}
    </div>
  );
};
