import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Search, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface InteractiveMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    addressText: string;
  }) => void;
}

// Custom styled Leaflet Pin icon using SVG
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; items-center; justify-content: center;">
        <div style="position: absolute; width: 36px; height: 36px; background: rgba(234, 88, 12, 0.3); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; background: #ea580c; border: 3px solid #ffffff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialLat = 17.9757,
  initialLng = 102.6133,
  onLocationSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [addressPreview, setAddressPreview] = useState<string>('ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital, Laos)');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([initialLat, initialLng], {
        icon: createCustomIcon(),
        draggable: true,
      }).addTo(map);

      marker.bindPopup('<strong style="color: #052114;">📍 ຈຸດຈັດສົ່ງສິນຄ້າ</strong><br/>ລາກ ຫຼື ກົດເທິງແຜນທີ່ເພື່ອປັບຕຳແໜ່ງ').openPopup();

      // Handle marker drag end
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        handleUpdatePosition(position.lat, position.lng, true);
      });

      // Handle map click
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleUpdatePosition(lat, lng, true);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=lo,en`,
        {
          headers: {
            'User-Agent': 'BadmintonStoreApp/1.0',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const displayName = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddressPreview(displayName);
        onLocationSelect({
          lat,
          lng,
          addressText: displayName,
        });
        return displayName;
      }
    } catch {
      // Fallback
    }
    const fallbackText = `ພິກັດ GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setAddressPreview(fallbackText);
    onLocationSelect({
      lat,
      lng,
      addressText: fallbackText,
    });
    return fallbackText;
  };

  const handleUpdatePosition = async (lat: number, lng: number, fetchAddress: boolean = true) => {
    setCurrentCoords({ lat, lng });
    setErrorMessage(null);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapRef.current) {
      mapRef.current.panTo([lat, lng]);
    }
    if (fetchAddress) {
      await reverseGeocode(lat, lng);
    }
  };

  // Get My Location via HTML5 Geolocation API
  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('ບຣາວເຊີຂອງທ່ານບໍ່ຮອງຮັບລະບົບ GPS (HTML5 Geolocation)');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setIsLocating(false);

        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 16, { animate: true });
        }
        handleUpdatePosition(lat, lng, true);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error.message);
        setErrorMessage(
          'ບໍ່ສາມາດດຶງ GPS ໄດ້ (ກະລຸນາອະນຸຍາດໃຫ້ເຂົ້າເຖິງ Location ຫຼື ເລືອກເທິງແຜນທີ່ໂດຍກົງ)'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Search Address / Landmark
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Laos'
        )}&limit=1&accept-language=lo,en`,
        {
          headers: {
            'User-Agent': 'BadmintonStoreApp/1.0',
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lng = parseFloat(results[0].lon);
          const name = results[0].display_name;

          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 15, { animate: true });
          }
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }
          setCurrentCoords({ lat, lng });
          setAddressPreview(name);
          onLocationSelect({ lat, lng, addressText: name });
        } else {
          setErrorMessage('ບໍ່ພົບສະຖານທີ່ນີ້ ກະລຸນາກົດປັກໝຸດເທິງແຜນທີ່ໂດຍກົງ');
        }
      }
    } catch {
      setErrorMessage('ເກີດຂໍ້ຜິດພາດໃນການຄົ້ນຫາ ກະລຸນາກົດປັກໝຸດເທິງແຜນທີ່');
    } finally {
      setIsSearching(false);
    }
  };

  // Quick Vientiane / Laos locations for instant convenience
  const quickLocations = [
    { name: 'ປະຕູໄຊ (Patuxay)', lat: 17.9702, lng: 102.6186 },
    { name: 'ດົງໂດກ ມຊ (Dongdok)', lat: 18.0382, lng: 102.6368 },
    { name: 'ທາດຫຼວງ (Pha That Luang)', lat: 17.9767, lng: 102.6364 },
    { name: 'ສີໂຄດຕະບອງ (Sikhottabong)', lat: 17.9622, lng: 102.5855 },
    { name: 'ຕະຫຼາດເຊົ້າ (Morning Market)', lat: 17.9645, lng: 102.6135 },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Search and Get Location Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearchLocation} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ຄົ້ນຫາສະຖານທີ່ (ເຊັ່ນ: ດົງໂດກ, ທາດຫຼວງ, ຖະໜົນ...)"
              className="w-full bg-[#03150c] border border-emerald-800/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-600/70 focus:outline-none focus:border-orange-500"
            />
          </div>
          {/* Blue Search Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            ຄົ້ນຫາ
          </button>
        </form>

        {/* Blue "Get My Location" Button as specifically requested */}
        <button
          type="button"
          onClick={handleGetMyLocation}
          disabled={isLocating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>ກຳລັງດຶງ GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 text-white" />
              <span>Get My Location (ດຶງ GPS)</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-emerald-300/80">
        <span className="text-slate-400">ຈຸດຍອດນິຍົມ:</span>
        {quickLocations.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => handleUpdatePosition(loc.lat, loc.lng, true)}
            className="px-2 py-0.5 bg-emerald-900/60 hover:bg-orange-600 hover:text-white border border-emerald-700/50 rounded text-slate-200 transition-colors"
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-700 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Map Display Container */}
      <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden border-2 border-emerald-800 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute top-2 right-2 z-20 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] text-orange-300 font-mono border border-orange-500/40">
          📍 Lat: {currentCoords.lat.toFixed(4)}, Lng: {currentCoords.lng.toFixed(4)}
        </div>
      </div>

      {/* Selected location summary */}
      <div className="p-2.5 rounded-lg bg-[#03150c] border border-emerald-800/80 flex items-start gap-2.5">
        <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
            <span>ຕຳແໜ່ງປັກໝຸດຈັດສົ່ງ</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-[12px] text-slate-300 truncate mt-0.5" title={addressPreview}>
            {addressPreview}
          </p>
          <p className="text-[10px] text-emerald-400/80 mt-0.5">
            * ທ່ານສາມາດກົດ ຫຼື ລາກໝຸດສີສົ້ມເທິງແຜນທີ່ເພື່ອປັບຈຸດທີ່ຢູ່ຈັດສົ່ງໃຫ້ຊັດເຈນທີ່ສຸດ
          </p>
        </div>
      </div>
    </div>
  );
};
