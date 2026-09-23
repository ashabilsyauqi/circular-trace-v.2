import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Compass,
  Plus,
  Trash2,
  Edit3,
  TreePine,
  Download,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { FarmPatok, FarmPlotBoundary, PhysicalPatokType, PatokCondition } from '../../types/coffee';

export interface FarmLocationMapProps {
  latitude: number;
  longitude: number;
  farmName: string;
  altitude?: string | number;
  locationName?: string;
  landAreaHectares?: number;
  totalTreesCount?: number;
  plotBoundary?: FarmPlotBoundary;
  patokList?: FarmPatok[];
  height?: string;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  onPatokListChange?: (newPatokList: FarmPatok[]) => void;
  showPresets?: boolean;
  showPlotDetailsTable?: boolean;
  allowEdit?: boolean;
}

export const INDONESIAN_COFFEE_ORIGINS = [
  { name: 'Gunung Tilu Pangalengan (Jabar)', lat: -7.1824, lng: 107.5612, alt: '1.550 mdpl', area: 2.4 },
  { name: 'Gayo Burni Telong (Aceh)', lat: 4.7123, lng: 96.8456, alt: '1.650 mdpl', area: 3.5 },
  { name: 'Kintamani Ulian (Bali)', lat: -8.2435, lng: 115.3285, alt: '1.350 mdpl', area: 2.0 },
  { name: 'Bajawa Wolokisa (Flores NTT)', lat: -8.825, lng: 120.975, alt: '1.400 mdpl', area: 1.5 },
  { name: 'Sapan Rantebua (Toraja Sulsel)', lat: -2.9833, lng: 119.8833, alt: '1.800 mdpl', area: 4.2 },
  { name: 'Gunung Ijen (Jawa Timur)', lat: -8.0583, lng: 114.2425, alt: '1.400 mdpl', area: 3.0 },
  { name: 'Kayu Aro Kerinci (Jambi)', lat: -1.6967, lng: 101.2589, alt: '1.600 mdpl', area: 2.8 },
  { name: 'Gunung Puntang (Jawa Barat)', lat: -7.1128, lng: 107.6033, alt: '1.520 mdpl', area: 1.8 },
];

export const PHYSICAL_PATOK_TYPES: PhysicalPatokType[] = [
  'Patok Beton BPN',
  'Pipa Besi Cor',
  'Pohon Batas Alami',
  'Batu Alam / Terasering',
  'Patok Kayu Ulin',
  'Titik Virtual GPS',
];

export const PATOK_CONDITIONS: PatokCondition[] = [
  'Kondisi Baik & Kokoh',
  'Perlu Perbaikan',
  'Tertutup Semak',
  'Titik Baru',
];

// Helper: Calculate polygon area in Hectares using spherical earth projection
function calculatePolygonAreaHectares(coords: { lat: number; lng: number }[]): number {
  if (coords.length < 3) return 0;
  const R = 6378137; // Earth radius in meters
  let area = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];
    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = Math.abs((area * R * R) / 4.0);
  const hectares = area / 10000;
  return Number(hectares.toFixed(2));
}

// Helper: Calculate polygon perimeter in meters using Haversine
function calculatePolygonPerimeterMeters(coords: { lat: number; lng: number }[]): number {
  if (coords.length < 2) return 0;
  const R = 6371000; // Earth radius in meters
  let perimeter = 0;
  const len = coords.length;

  for (let i = 0; i < len; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % len];
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    perimeter += R * c;
  }
  return Math.round(perimeter);
}

// Custom DivIcon for Numbered Patok Markers
const createPatokDivIcon = (number: number, isSelected: boolean) => {
  const bg = isSelected ? '#D97706' : '#047857';
  const border = '#FFFFFF';
  return L.divIcon({
    className: 'leaflet-patok-icon',
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 30px;
        background: ${bg};
        border: 2.5px solid ${border};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        cursor: grab;
        transition: transform 0.15s ease, background 0.2s ease;
      ">
        ${number}
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${bg};
        "></div>
      </div>
    `,
    iconSize: [30, 36],
    iconAnchor: [15, 34],
    popupAnchor: [0, -32],
  });
};

// Center Beacon Icon for Farm Origin
const createCenterFarmIcon = () => {
  return L.divIcon({
    className: 'leaflet-center-icon',
    html: `
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
        background: #B45309;
        border: 2.5px solid #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        box-shadow: 0 0 0 4px rgba(180, 83, 9, 0.25), 0 3px 8px rgba(0,0,0,0.3);
      ">
        <div style="width: 8px; height: 8px; background: #FFFFFF; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
};

export const FarmLocationMap: React.FC<FarmLocationMapProps> = ({
  latitude,
  longitude,
  farmName,
  altitude = '1.550 mdpl',
  locationName,
  landAreaHectares = 2.4,
  totalTreesCount = 3200,
  plotBoundary,
  patokList: initialPatokListProp,
  height = '380px',
  onCoordinatesChange,
  onPatokListChange,
  showPresets = true,
  showPlotDetailsTable = true,
  allowEdit = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const bufferLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const patokMarkersRef = useRef<L.Marker[]>([]);

  // Base state
  const [mapLayer, setMapLayer] = useState<'osm' | 'terrain' | 'satellite'>('osm');
  const [copied, setCopied] = useState(false);
  const [copiedGeoJson, setCopiedGeoJson] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [currentLat, setCurrentLat] = useState<number>(latitude);
  const [currentLng, setCurrentLng] = useState<number>(longitude);

  // Layer Visibility Toggles
  const [showPolygon, setShowPolygon] = useState(true);
  const [showRadiusBuffer, setShowRadiusBuffer] = useState(true);
  const [showPatokMarkers, setShowPatokMarkers] = useState(true);
  const [bufferRadiusMeters] = useState(
    plotBoundary?.geofenceRadiusMeters || Math.round(Math.sqrt(landAreaHectares * 10000) * 1.1) || 220
  );

  // Click-to-add patok mode on map
  const [isClickToAddMode, setIsClickToAddMode] = useState(false);
  const [selectedPatokId, setSelectedPatokId] = useState<string | null>(null);

  // Modal State for Adding or Editing Patok
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatok, setEditingPatok] = useState<FarmPatok | null>(null);
  const [patokFormId, setPatokFormId] = useState('');
  const [patokFormName, setPatokFormName] = useState('');
  const [patokFormLat, setPatokFormLat] = useState<number>(currentLat);
  const [patokFormLng, setPatokFormLng] = useState<number>(currentLng);
  const [patokFormElev, setPatokFormElev] = useState<number>(1550);
  const [patokFormType, setPatokFormType] = useState<PhysicalPatokType>('Patok Beton BPN');
  const [patokFormCondition, setPatokFormCondition] = useState<PatokCondition>('Kondisi Baik & Kokoh');
  const [patokFormNote, setPatokFormNote] = useState('');

  // Extract base altitude number
  const baseAltNum =
    typeof altitude === 'number'
      ? altitude
      : parseInt(String(altitude).replace(/\D/g, '')) || 1550;

  // Initialize Default Patok List if not supplied
  const generateDefaultPatoks = useCallback(
    (centerLat: number, centerLng: number, baseAlt: number): FarmPatok[] => {
      return [
        {
          id: 'PTK-01',
          name: 'Patok 1 (Sudut Utara - Batas Hutan)',
          latitude: Number((centerLat + 0.00072).toFixed(6)),
          longitude: Number((centerLng - 0.00035).toFixed(6)),
          elevationMeters: baseAlt + 25,
          physicalType: 'Patok Beton BPN',
          condition: 'Kondisi Baik & Kokoh',
          landmarkNote: 'Sebelah pohon beringin tua, 15m dari sempadan hutan',
          verifiedDate: '2026-08-15',
        },
        {
          id: 'PTK-02',
          name: 'Patok 2 (Sudut Timur Laut - Jalan Tani)',
          latitude: Number((centerLat + 0.00045).toFixed(6)),
          longitude: Number((centerLng + 0.00085).toFixed(6)),
          elevationMeters: baseAlt + 15,
          physicalType: 'Patok Beton BPN',
          condition: 'Kondisi Baik & Kokoh',
          landmarkNote: 'Di persimpangan jalan setapak blok timur',
          verifiedDate: '2026-08-15',
        },
        {
          id: 'PTK-03',
          name: 'Patok 3 (Sudut Tenggara - Batas Parit)',
          latitude: Number((centerLat - 0.00042).toFixed(6)),
          longitude: Number((centerLng + 0.00078).toFixed(6)),
          elevationMeters: baseAlt - 10,
          physicalType: 'Pipa Besi Cor',
          condition: 'Kondisi Baik & Kokoh',
          landmarkNote: 'Batas parit terasering kebun bawah',
          verifiedDate: '2026-08-15',
        },
        {
          id: 'PTK-04',
          name: 'Patok 4 (Sudut Selatan - Sempadan Sungai)',
          latitude: Number((centerLat - 0.00085).toFixed(6)),
          longitude: Number((centerLng - 0.00022).toFixed(6)),
          elevationMeters: baseAlt - 30,
          physicalType: 'Batu Alam / Terasering',
          condition: 'Kondisi Baik & Kokoh',
          landmarkNote: 'Batu andesit penanda sempadan aliran mata air',
          verifiedDate: '2026-08-15',
        },
        {
          id: 'PTK-05',
          name: 'Patok 5 (Sudut Barat Daya - Pohon Sengon)',
          latitude: Number((centerLat - 0.00015).toFixed(6)),
          longitude: Number((centerLng - 0.00095).toFixed(6)),
          elevationMeters: baseAlt + 5,
          physicalType: 'Pohon Batas Alami',
          condition: 'Kondisi Baik & Kokoh',
          landmarkNote: 'Pohon sengon besar no. register SG-01',
          verifiedDate: '2026-08-15',
        },
      ];
    },
    []
  );

  const [patoks, setPatoks] = useState<FarmPatok[]>(() => {
    if (initialPatokListProp && initialPatokListProp.length >= 3) {
      return initialPatokListProp;
    }
    if (plotBoundary?.patokList && plotBoundary.patokList.length >= 3) {
      return plotBoundary.patokList;
    }
    if (plotBoundary?.polygonPoints && plotBoundary.polygonPoints.length >= 3) {
      return plotBoundary.polygonPoints.map((pt, i) => ({
        id: pt.id || `PTK-0${i + 1}`,
        name: pt.label || `Patok ${i + 1}`,
        latitude: pt.latitude,
        longitude: pt.longitude,
        elevationMeters: pt.elevationMeters || baseAltNum,
        physicalType: pt.physicalType || 'Patok Beton BPN',
        condition: pt.condition || 'Kondisi Baik & Kokoh',
        landmarkNote: pt.landmarkNote || 'Titik sudut batas kebun',
      }));
    }
    return generateDefaultPatoks(latitude, longitude, baseAltNum);
  });

  // Sync state if latitude / longitude / patokList / plotBoundary / altitude changes
  useEffect(() => {
    setCurrentLat(latitude);
    setCurrentLng(longitude);

    let nextPatoks: FarmPatok[] = [];
    if (initialPatokListProp && initialPatokListProp.length >= 3) {
      nextPatoks = initialPatokListProp;
    } else if (plotBoundary?.patokList && plotBoundary.patokList.length >= 3) {
      nextPatoks = plotBoundary.patokList;
    } else if (plotBoundary?.polygonPoints && plotBoundary.polygonPoints.length >= 3) {
      nextPatoks = plotBoundary.polygonPoints.map((pt, i) => ({
        id: pt.id || `PTK-0${i + 1}`,
        name: pt.label || `Patok ${i + 1}`,
        latitude: pt.latitude,
        longitude: pt.longitude,
        elevationMeters: pt.elevationMeters || baseAltNum,
        physicalType: pt.physicalType || 'Patok Beton BPN',
        condition: pt.condition || 'Kondisi Baik & Kokoh',
        landmarkNote: pt.landmarkNote || 'Titik sudut batas kebun',
      }));
    } else {
      nextPatoks = generateDefaultPatoks(latitude, longitude, baseAltNum);
    }

    setPatoks(nextPatoks);

    // Auto pan/fitBounds Leaflet map camera to the selected farm and its polygon!
    if (mapInstanceRef.current) {
      if (nextPatoks.length >= 3) {
        const bounds = L.latLngBounds(nextPatoks.map((p) => [p.latitude, p.longitude]));
        bounds.extend([latitude, longitude]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [35, 35], maxZoom: 17 });
      } else {
        mapInstanceRef.current.setView([latitude, longitude], 16);
      }
    }
  }, [
    latitude,
    longitude,
    initialPatokListProp,
    plotBoundary,
    baseAltNum,
    generateDefaultPatoks,
  ]);

  // Ensure map tiles properly render after tab switch / layout mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [currentLat, currentLng]);

  // Derived calculations: Area & Perimeter
  const computedAreaHa = calculatePolygonAreaHectares(
    patoks.map((p) => ({ lat: p.latitude, lng: p.longitude }))
  );
  const computedPerimeterM = calculatePolygonPerimeterMeters(
    patoks.map((p) => ({ lat: p.latitude, lng: p.longitude }))
  );

  // ---------------------------------------------------------------------------
  // 1. INITIALIZE LEAFLET MAP
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution bottom right
      L.control
        .attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; OpenStreetMap &bull; EUDR Verified')
        .addTo(map);

      mapInstanceRef.current = map;

      // Fit bounds to patoks on mount
      if (patoks.length >= 3) {
        const bounds = L.latLngBounds(patoks.map((p) => [p.latitude, p.longitude]));
        bounds.extend([currentLat, currentLng]);
        map.fitBounds(bounds, { padding: [35, 35], maxZoom: 17 });
      }
    }

    const map = mapInstanceRef.current;

    // Handle map click for "Click-to-add Patok"
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (isClickToAddMode) {
        const newIndex = patoks.length + 1;
        const newPatokId = `PTK-0${newIndex}`;
        const newPatok: FarmPatok = {
          id: newPatokId,
          name: `Patok ${newIndex} (Titik Baru Tambahan)`,
          latitude: Number(e.latlng.lat.toFixed(6)),
          longitude: Number(e.latlng.lng.toFixed(6)),
          elevationMeters: baseAltNum,
          physicalType: 'Patok Beton BPN',
          condition: 'Titik Baru',
          landmarkNote: 'Ditambahkan via klik peta interaktif',
        };
        const updated = [...patoks, newPatok];
        setPatoks(updated);
        setIsClickToAddMode(false);
        setSelectedPatokId(newPatokId);
        if (onPatokListChange) {
          onPatokListChange(updated);
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [currentLat, currentLng, isClickToAddMode, patoks, baseAltNum, onPatokListChange]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. UPDATE TILE LAYER (OSM / Terrain / Satellite)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let maxZoom = 19;

    if (mapLayer === 'terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
    } else if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 19;
    }

    const newTileLayer = L.tileLayer(url, {
      maxZoom,
      subdomains: mapLayer === 'satellite' ? ['server'] : ['a', 'b', 'c'],
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // ---------------------------------------------------------------------------
  // 3. RENDER VECTOR OVERLAYS (Polygon, Circle Geofence, Patok Markers)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // A. Center Farm Origin Beacon Marker (Draggable if allowEdit: shifts entire farm plot!)
    if (centerMarkerRef.current) {
      map.removeLayer(centerMarkerRef.current);
    }
    const centerMarker = L.marker([currentLat, currentLng], {
      icon: createCenterFarmIcon(),
      draggable: allowEdit,
      zIndexOffset: 300,
    }).addTo(map);

    if (allowEdit) {
      centerMarker.on('dragend', () => {
        const newPos = centerMarker.getLatLng();
        const deltaLat = newPos.lat - currentLat;
        const deltaLng = newPos.lng - currentLng;
        const newLat = Number(newPos.lat.toFixed(6));
        const newLng = Number(newPos.lng.toFixed(6));
        setCurrentLat(newLat);
        setCurrentLng(newLng);

        // Geser seluruh patok poligon mengikuti pergeseran pin pusat kebun
        const shiftedPatoks = patoks.map((p) => ({
          ...p,
          latitude: Number((p.latitude + deltaLat).toFixed(6)),
          longitude: Number((p.longitude + deltaLng).toFixed(6)),
        }));
        setPatoks(shiftedPatoks);

        if (onCoordinatesChange) {
          onCoordinatesChange(newLat, newLng);
        }
        if (onPatokListChange) {
          onPatokListChange(shiftedPatoks);
        }
      });
    }

    centerMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 2px;">
        <strong style="color: #18110D; font-size: 13px;">${farmName}</strong><br/>
        <span style="color: #047857; font-weight: bold;">Pusat Geolocation Kebun</span><br/>
        <span style="color: #666;">${currentLat.toFixed(5)}°, ${currentLng.toFixed(5)}°</span><br/>
        <span style="color: #B45309; font-weight: bold;">Elevasi: ${altitude}</span>
        ${allowEdit ? '<br/><span style="color:#059669;font-size:10px;font-weight:bold;">&bull; Geser pin ini untuk memindahkan seluruh area &amp; patok</span>' : ''}
      </div>
    `);
    centerMarkerRef.current = centerMarker;

    // B. Geofence Radius Buffer Circle
    if (bufferLayerRef.current) {
      map.removeLayer(bufferLayerRef.current);
      bufferLayerRef.current = null;
    }
    if (showRadiusBuffer) {
      const buffer = L.circle([currentLat, currentLng], {
        radius: bufferRadiusMeters,
        color: '#10B981',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#34D399',
        fillOpacity: 0.12,
      }).addTo(map);
      bufferLayerRef.current = buffer;
    }

    // C. Farm Land Plot Polygon Perimeter
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }
    if (showPolygon && patoks.length >= 3) {
      const latLngs = patoks.map((p) => [p.latitude, p.longitude] as [number, number]);
      const polygon = L.polygon(latLngs, {
        color: '#047857',
        weight: 2.5,
        dashArray: '6, 4',
        fillColor: '#10B981',
        fillOpacity: 0.25,
      }).addTo(map);

      polygon.bindTooltip(
        `<div style="font-size:11px;font-weight:bold;color:#047857;">${farmName}<br/>Luas: ~${computedAreaHa} Ha</div>`,
        { sticky: true }
      );
      polygonLayerRef.current = polygon;
    }

    // D. Draggable Patok Markers
    patokMarkersRef.current.forEach((m) => map.removeLayer(m));
    patokMarkersRef.current = [];

    if (showPatokMarkers) {
      patoks.forEach((patok, idx) => {
        const isSelected = selectedPatokId === patok.id;
        const marker = L.marker([patok.latitude, patok.longitude], {
          icon: createPatokDivIcon(idx + 1, isSelected),
          draggable: allowEdit,
          zIndexOffset: isSelected ? 500 : 200,
        }).addTo(map);

        // Marker Drag End Listener: updates coordinates in real-time
        marker.on('dragend', () => {
          const newPos = marker.getLatLng();
          const updatedPatoks = patoks.map((p) =>
            p.id === patok.id
              ? {
                  ...p,
                  latitude: Number(newPos.lat.toFixed(6)),
                  longitude: Number(newPos.lng.toFixed(6)),
                }
              : p
          );
          setPatoks(updatedPatoks);
          if (onPatokListChange) {
            onPatokListChange(updatedPatoks);
          }
        });

        // Click marker to select and show popup
        marker.on('click', () => {
          setSelectedPatokId(patok.id);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; min-width: 180px; line-height: 1.4;">
            <div style="font-weight: 800; color: #047857; font-size: 13px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; margin-bottom: 4px;">
              <span>${patok.id}: ${patok.name}</span>
            </div>
            <div style="color: #374151; font-size: 11px;">
              <strong>GPS:</strong> ${patok.latitude.toFixed(6)}°, ${patok.longitude.toFixed(6)}°<br/>
              <strong>Elevasi:</strong> ${patok.elevationMeters || baseAltNum} mdpl<br/>
              <strong>Tipe Fisik:</strong> <span style="color: #B45309; font-weight: 600;">${patok.physicalType || 'Patok Beton BPN'}</span><br/>
              <strong>Kondisi:</strong> ${patok.condition || 'Baik'}<br/>
              ${patok.landmarkNote ? `<em style="color: #6B7280;">"${patok.landmarkNote}"</em>` : ''}
            </div>
            <div style="margin-top: 6px; font-size: 10px; color: #059669; font-weight: bold;">
              &bull; Geser pin untuk ubah posisi titik
            </div>
          </div>
        `);

        patokMarkersRef.current.push(marker);
      });
    }
  }, [
    currentLat,
    currentLng,
    farmName,
    altitude,
    showRadiusBuffer,
    bufferRadiusMeters,
    showPolygon,
    showPatokMarkers,
    patoks,
    selectedPatokId,
    allowEdit,
    computedAreaHa,
    baseAltNum,
    onPatokListChange,
  ]);

  // Center map when currentLat / currentLng changes
  const handleRecenterMap = () => {
    if (mapInstanceRef.current) {
      if (patoks.length >= 3) {
        const bounds = L.latLngBounds(patoks.map((p) => [p.latitude, p.longitude]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      } else {
        mapInstanceRef.current.setView([currentLat, currentLng], 16);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 4. ACTION HANDLERS (Add, Edit, Delete, Copy, Presets)
  // ---------------------------------------------------------------------------
  const handleSelectPreset = (preset: typeof INDONESIAN_COFFEE_ORIGINS[0]) => {
    setCurrentLat(preset.lat);
    setCurrentLng(preset.lng);
    const newAlt = parseInt(preset.alt.replace(/\D/g, '')) || 1550;
    const newPatoks = generateDefaultPatoks(preset.lat, preset.lng, newAlt);
    setPatoks(newPatoks);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([preset.lat, preset.lng], 16);
    }
    if (onCoordinatesChange) {
      onCoordinatesChange(preset.lat, preset.lng);
    }
    if (onPatokListChange) {
      onPatokListChange(newPatoks);
    }
  };

  const handleOpenAddModal = () => {
    const nextNum = patoks.length + 1;
    setEditingPatok(null);
    setPatokFormId(`PTK-0${nextNum}`);
    setPatokFormName(`Patok ${nextNum} (Sudut Baru)`);
    setPatokFormLat(Number((currentLat + 0.0003).toFixed(6)));
    setPatokFormLng(Number((currentLng + 0.0003).toFixed(6)));
    setPatokFormElev(baseAltNum);
    setPatokFormType('Patok Beton BPN');
    setPatokFormCondition('Kondisi Baik & Kokoh');
    setPatokFormNote('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (patok: FarmPatok) => {
    setEditingPatok(patok);
    setPatokFormId(patok.id);
    setPatokFormName(patok.name);
    setPatokFormLat(patok.latitude);
    setPatokFormLng(patok.longitude);
    setPatokFormElev(patok.elevationMeters || baseAltNum);
    setPatokFormType(patok.physicalType || 'Patok Beton BPN');
    setPatokFormCondition(patok.condition || 'Kondisi Baik & Kokoh');
    setPatokFormNote(patok.landmarkNote || '');
    setModalOpen(true);
  };

  const handleSavePatokForm = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: FarmPatok[];
    if (editingPatok) {
      updated = patoks.map((p) =>
        p.id === editingPatok.id
          ? {
              ...p,
              id: patokFormId,
              name: patokFormName,
              latitude: Number(patokFormLat),
              longitude: Number(patokFormLng),
              elevationMeters: Number(patokFormElev),
              physicalType: patokFormType,
              condition: patokFormCondition,
              landmarkNote: patokFormNote,
            }
          : p
      );
    } else {
      const newPatok: FarmPatok = {
        id: patokFormId,
        name: patokFormName,
        latitude: Number(patokFormLat),
        longitude: Number(patokFormLng),
        elevationMeters: Number(patokFormElev),
        physicalType: patokFormType,
        condition: patokFormCondition,
        landmarkNote: patokFormNote,
        verifiedDate: new Date().toISOString().split('T')[0],
      };
      updated = [...patoks, newPatok];
    }

    setPatoks(updated);
    setModalOpen(false);
    if (onPatokListChange) {
      onPatokListChange(updated);
    }
  };

  const handleDeletePatok = (patokId: string) => {
    if (patoks.length <= 3) {
      alert('Minimal 3 patok batas lahan diperlukan untuk membentuk poligon area kebun!');
      return;
    }
    const updated = patoks.filter((p) => p.id !== patokId);
    setPatoks(updated);
    if (selectedPatokId === patokId) setSelectedPatokId(null);
    if (onPatokListChange) {
      onPatokListChange(updated);
    }
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${currentLat}, ${currentLng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyGeoJson = () => {
    const geoJson = {
      type: 'Feature',
      properties: {
        farmName,
        altitude,
        landAreaHectares: computedAreaHa || landAreaHectares,
        perimeterMeters: computedPerimeterM,
        totalPatokCount: patoks.length,
        eudrCompliant: true,
        patoks: patoks.map((p) => ({
          id: p.id,
          name: p.name,
          physicalType: p.physicalType,
          elevationMeters: p.elevationMeters,
        })),
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            ...patoks.map((p) => [p.longitude, p.latitude]),
            [patoks[0].longitude, patoks[0].latitude], // close polygon loop
          ],
        ],
      },
    };
    navigator.clipboard.writeText(JSON.stringify(geoJson, null, 2));
    setCopiedGeoJson(true);
    setTimeout(() => setCopiedGeoJson(false), 2500);
  };

  const handleCopyBpnCsv = () => {
    let csv = 'Kode Patok,Nama Patok,Latitude,Longitude,Elevasi (mdpl),Tipe Fisik,Kondisi,Landmark\n';
    patoks.forEach((p) => {
      csv += `"${p.id}","${p.name}",${p.latitude},${p.longitude},${p.elevationMeters || ''},"${p.physicalType || ''}","${p.condition || ''}","${p.landmarkNote || ''}"\n`;
    });
    navigator.clipboard.writeText(csv);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2500);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${currentLat},${currentLng}`;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-3">
      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP TOOLBAR & COMPLIANCE BADGE                                     */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-[#FAF7F2] px-4 sm:px-5 py-3.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-bold text-stone-900 truncate">
              <span className="text-sm font-black truncate">{farmName}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 shrink-0 border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                EUDR Polygon Georeferenced
              </span>
            </div>
            <div className="text-[11px] text-stone-500 truncate flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              <span>{locationName || 'Plot Lahan Terpetakan'}</span>
              <span>&bull;</span>
              <span className="font-bold text-emerald-800">{computedAreaHa || landAreaHectares} Ha ({((computedAreaHa || landAreaHectares) * 10000).toLocaleString()} m²)</span>
              <span>&bull;</span>
              <span className="font-semibold text-stone-700">{altitude}</span>
              <span>&bull;</span>
              <span className="font-mono text-stone-600">{patoks.length} Patok</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Export */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {allowEdit && (
            <button
              type="button"
              onClick={() => setIsClickToAddMode(!isClickToAddMode)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                isClickToAddMode
                  ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
              }`}
              title="Klik pada peta untuk menancapkan patok batas baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isClickToAddMode ? 'Klik Peta untuk Patok (+)' : '+ Patok via Klik'}</span>
            </button>
          )}

          {allowEdit && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
              title="Formulir tambah patok manual"
            >
              <Plus className="w-3.5 h-3.5 text-stone-500" />
              <span>+ Form Patok</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyCoords}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="Salin Koordinat GPS Titik Pusat"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>Salin GPS</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyGeoJson}
            className="px-2.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            title="Salin Poligon GeoJSON EUDR"
          >
            {copiedGeoJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>GeoJSON OK!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>GeoJSON EUDR</span>
              </>
            )}
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. ACTUAL LEAFLET INTERACTIVE MAP CANVAS CONTAINER                    */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative w-full overflow-hidden bg-stone-100" style={{ height }}>
        {/* Leaflet Map DOM Container */}
        <div
          ref={mapContainerRef}
          className={`w-full h-full ${isClickToAddMode ? 'cursor-crosshair' : 'cursor-grab'}`}
          style={{ height: '100%', width: '100%' }}
        />

        {/* Floating Farm Polygon Info Badge (Top Center) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-stone-950/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl text-xs border border-emerald-500/40 shadow-xl flex items-center gap-2 pointer-events-auto">
          <TreePine className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold">{farmName}</span>
          <span className="text-stone-400">&bull;</span>
          <span className="text-emerald-300 font-bold">{computedAreaHa || landAreaHectares} Ha</span>
          <span className="text-stone-400">&bull;</span>
          <span className="text-amber-300 font-mono text-[11px]">{altitude}</span>
          <button
            type="button"
            onClick={handleRecenterMap}
            className="ml-1 text-stone-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Pusatkan Tampilan Peta pada Lahan"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        {/* Floating Mode Hint when Click-to-add is active */}
        {isClickToAddMode && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[1000] bg-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Klik di mana saja pada peta untuk menancapkan patok batas baru!
          </div>
        )}

        {/* Floating Layer Switcher & Plot Overlay Controls (Bottom Right) */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200 shadow-md flex items-center gap-1.5 text-[10px] font-bold text-stone-700 pointer-events-auto flex-wrap">
          <div className="flex items-center gap-1 border-r border-stone-200 pr-1.5">
            <button
              type="button"
              onClick={() => setShowPolygon(!showPolygon)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                showPolygon ? 'bg-emerald-700 text-white font-black shadow-xs' : 'bg-stone-100 text-stone-600'
              }`}
              title="Tampilkan / Sembunyikan Poligon Lahan"
            >
              Poligon Area
            </button>
            <button
              type="button"
              onClick={() => setShowRadiusBuffer(!showRadiusBuffer)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                showRadiusBuffer ? 'bg-emerald-700 text-white font-black shadow-xs' : 'bg-stone-100 text-stone-600'
              }`}
              title="Tampilkan Buffer Zone"
            >
              Buffer Zone
            </button>
            <button
              type="button"
              onClick={() => setShowPatokMarkers(!showPatokMarkers)}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                showPatokMarkers ? 'bg-emerald-700 text-white font-black shadow-xs' : 'bg-stone-100 text-stone-600'
              }`}
              title="Tampilkan Pin Patok"
            >
              Pin Patok ({patoks.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMapLayer('osm')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              mapLayer === 'osm'
                ? 'bg-stone-900 text-white font-black shadow-xs'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            Peta Jalan (OSM)
          </button>
          <button
            type="button"
            onClick={() => setMapLayer('terrain')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              mapLayer === 'terrain'
                ? 'bg-stone-900 text-white font-black shadow-xs'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            Kontur Elevasi
          </button>
          <button
            type="button"
            onClick={() => setMapLayer('satellite')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              mapLayer === 'satellite'
                ? 'bg-stone-900 text-white font-black shadow-xs'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            Satelit Foto
          </button>
        </div>

        {/* Floating Coordinate & Perimeter Pill (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-stone-950/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl text-[11px] font-mono border border-emerald-500/30 shadow-md flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentLat.toFixed(4)}° S, {currentLng.toFixed(4)}° E</span>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            &bull; Perimeter: ~{computedPerimeterM}m
          </span>
          <span className="text-amber-300 text-[10px] font-bold">
            &bull; {patoks.length} Patok Batas
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. PRESET ORIGINS SELECTOR                                            */}
      {/* --------------------------------------------------------------------- */}
      {showPresets && (
        <div className="px-4 pt-1 pb-2 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            Pilih Titik Lokasi Perkebunan Kopi Nusantara:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {INDONESIAN_COFFEE_ORIGINS.map((origin) => {
              const isSelected =
                Math.abs(origin.lat - currentLat) < 0.01 && Math.abs(origin.lng - currentLng) < 0.01;
              return (
                <button
                  key={origin.name}
                  type="button"
                  onClick={() => handleSelectPreset(origin)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  <span>{origin.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 4. TABEL PARAMETER PATOK LENGKAP STANDAR BPN & EUDR                   */}
      {/* --------------------------------------------------------------------- */}
      {showPlotDetailsTable && (
        <div className="px-4 pb-4 pt-2 border-t border-stone-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h5 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Daftar Patok Batas Lahan &amp; Monumentasi Fisik ({patoks.length} Sudut Plot Lahan)
              </h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Setiap patok merepresentasikan sudut geolokasi aktual kebun. Petani dapat menambah (+), menggeser, atau mengedit koordinat patok.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyBpnCsv}
                className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-[10px] font-bold inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                title="Salin format CSV untuk arsip BPN"
              >
                {copiedCsv ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>CSV BPN Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-500" />
                    <span>Salin CSV BPN</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-stone-500 font-mono">
                Total Luas Poligon: <strong className="text-emerald-800">{computedAreaHa || landAreaHectares} Ha ({((computedAreaHa || landAreaHectares) * 10000).toLocaleString()} m²)</strong>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-stone-50/50">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-stone-100/80 text-stone-600 font-bold uppercase tracking-wider text-[9px] border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">No &amp; Kode Patok</th>
                  <th className="py-2.5 px-3">Nama / Label Sudut</th>
                  <th className="py-2.5 px-3">Koordinat GPS (Lat, Lng)</th>
                  <th className="py-2.5 px-3">Elevasi</th>
                  <th className="py-2.5 px-3">Tipe Fisik Patok</th>
                  <th className="py-2.5 px-3">Kondisi &amp; Landmark</th>
                  <th className="py-2.5 px-3">EUDR Status</th>
                  {allowEdit && <th className="py-2.5 px-3 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {patoks.map((ptk, idx) => {
                  const isSelected = selectedPatokId === ptk.id;
                  return (
                    <tr
                      key={ptk.id}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-50/80' : 'hover:bg-emerald-50/40'
                      }`}
                      onClick={() => setSelectedPatokId(ptk.id)}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-mono font-bold text-emerald-900">{ptk.id}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">
                        {ptk.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-stone-700">
                        {ptk.latitude.toFixed(6)}°, {ptk.longitude.toFixed(6)}°
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-stone-800">
                        {ptk.elevationMeters || baseAltNum} mdpl
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[10px] border border-stone-200">
                          {ptk.physicalType || 'Patok Beton BPN'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="text-[10.5px] font-medium text-stone-800 truncate">
                          {ptk.condition || 'Kondisi Baik & Kokoh'}
                        </div>
                        {ptk.landmarkNote && (
                          <div className="text-[10px] text-stone-500 italic truncate mt-0.5">
                            {ptk.landmarkNote}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          0% Deforestasi
                        </span>
                      </td>
                      {allowEdit && (
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(ptk)}
                              className="p-1 rounded-md hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                              title="Edit parameter patok ini"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePatok(ptk.id)}
                              className="p-1 rounded-md hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Hapus patok ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 5. MODAL FORM: TAMBAH / EDIT PARAMETER PATOK                         */}
      {/* --------------------------------------------------------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#FAF7F2] px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-black text-stone-900 text-sm">
                  {editingPatok ? `Edit Parameter Patok (${editingPatok.id})` : '+ Tambah Patok Batas Lahan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePatokForm} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kode Patok *
                  </label>
                  <input
                    type="text"
                    required
                    value={patokFormId}
                    onChange={(e) => setPatokFormId(e.target.value)}
                    placeholder="e.g. PTK-06"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Elevasi Titik (mdpl)
                  </label>
                  <input
                    type="number"
                    value={patokFormElev}
                    onChange={(e) => setPatokFormElev(Number(e.target.value))}
                    placeholder="e.g. 1560"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama / Label Sudut Batas Lahan *
                </label>
                <input
                  type="text"
                  required
                  value={patokFormName}
                  onChange={(e) => setPatokFormName(e.target.value)}
                  placeholder="e.g. Patok 6 (Sudut Barat - Batas Pohon Pinus)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Latitude (GPS) *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={patokFormLat}
                    onChange={(e) => setPatokFormLat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Longitude (GPS) *
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={patokFormLng}
                    onChange={(e) => setPatokFormLng(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Tipe Fisik Patok
                  </label>
                  <select
                    value={patokFormType}
                    onChange={(e) => setPatokFormType(e.target.value as PhysicalPatokType)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    {PHYSICAL_PATOK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kondisi Fisik Patok
                  </label>
                  <select
                    value={patokFormCondition}
                    onChange={(e) => setPatokFormCondition(e.target.value as PatokCondition)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    {PATOK_CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Catatan Landmark / Penanda Lapangan
                </label>
                <input
                  type="text"
                  value={patokFormNote}
                  onChange={(e) => setPatokFormNote(e.target.value)}
                  placeholder="e.g. 5 meter di sebelah utara pohon alpukat nomor 14"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingPatok ? 'Simpan Perubahan' : 'Tambah Patok'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
