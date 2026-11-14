import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  TreePine,
  ArrowLeft,
  Compass,
  MapPin,
  Mountain,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Edit2,
  ExternalLink,
  Users,
} from 'lucide-react';
import { FarmLocationMap } from '../../components/shared/FarmLocationMap';

export const MasterKebunMapPage: React.FC = () => {
  const { farmId } = useParams<{ farmId?: string }>();
  const { coffeeFarms } = useCoffee();

  const farm = coffeeFarms.find((f) => f.id === farmId);

  if (!farm) {
    return <Navigate to="/admin/kebun" replace />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Navigation Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/admin/kebun"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-700 bg-white px-3 py-2 rounded-md border border-[#d2d6de] shadow-2xs transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Lahan Kebun</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/kebun/edit/${farm.id}`}
            className="px-3 py-2 bg-white border border-[#d2d6de] hover:bg-stone-50 text-stone-700 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Edit Data Lahan</span>
          </Link>
          <Link
            to={`/admin/panen/tambah?farmId=${farm.id}`}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span>+ Catat Panen di Sini</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Info Banner */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Peta Geolokasi & Poligon EUDR: {farm.farmName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>EUDR Deforestation-Free Verified</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-stone-700 font-medium">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              {farm.farmerName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {farm.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-700 font-mono">
              <Mountain className="w-3.5 h-3.5 text-blue-600" />
              {farm.altitudeDisplay || `${farm.altitudeMeters} mdpl`}
            </span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-stone-400 uppercase font-bold">Total Luas & Patok</div>
          <div className="text-lg font-black text-stone-900">
            {farm.landAreaHectares} Ha •{' '}
            <span className="text-amber-700 font-mono">{farm.patokList?.length || 4} Titik Batas</span>
          </div>
        </div>
      </div>

      {/* 3. Full-Sized Interactive Farm Map */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        <div className="p-4 border-b border-[#e3e6f0] bg-stone-50 flex items-center justify-between">
          <h2 className="font-bold text-sm text-stone-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Peta Batas Kebun & Layer Satelit</span>
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            Pusat: {farm.coordinates?.latitude?.toFixed(6) || -7.1824}° S,{' '}
            {farm.coordinates?.longitude?.toFixed(6) || 107.5612}° E
          </span>
        </div>

        <div className="p-3">
          <FarmLocationMap
            latitude={farm.coordinates?.latitude || -7.1824}
            longitude={farm.coordinates?.longitude || 107.5612}
            altitude={farm.altitudeDisplay || `${farm.altitudeMeters || 1550} mdpl`}
            farmName={farm.farmName}
            locationName={farm.location}
            patokList={farm.patokList}
            allowEdit={false}
          />
        </div>
      </div>

      {/* 4. Table of Corner Coordinates (Patok BPN) */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        <div className="p-4 border-b border-[#e3e6f0] bg-stone-50 flex items-center justify-between">
          <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Daftar Patok Sudut Batas Fisik Lahan ({farm.patokList?.length || 0} Patok)</span>
          </h3>
          <span className="text-xs text-stone-400">
            Sesuai register pengukuran tapal batas kelompok tani
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#f4f6f9] text-stone-600 border-b border-[#d2d6de] font-bold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4 whitespace-nowrap">Kode &amp; Nama Patok</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Tipe Patok Fisik</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Koordinat Latitude</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Koordinat Longitude</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Kondisi Fisik</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Catatan Landmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {farm.patokList && farm.patokList.length > 0 ? (
                farm.patokList.map((patok, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">{patok.name}</td>
                    <td className="py-3 px-4 text-stone-700 whitespace-nowrap">{patok.physicalType || 'Patok Beton BPN'}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-stone-800 whitespace-nowrap">
                      {patok.latitude.toFixed(6)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-stone-800 whitespace-nowrap">
                      {patok.longitude.toFixed(6)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                        {patok.condition || 'Kondisi Baik'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">{patok.landmarkNote || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-400 text-xs">
                    Belum ada detail patok sudut tersimpan untuk kebun ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MasterKebunMapPage;
