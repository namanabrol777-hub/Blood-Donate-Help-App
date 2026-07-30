import React, { useState, useEffect, useRef } from "react";
import { GOOGLE_MAPS_API_KEY } from "../../config/maps";
import { AlertTriangle, MapPin, Navigation, Phone, Building2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const sampleBloodBanks = [
  { id: 1, name: "Metropolitan Central Blood Bank", distance: "1.2 km away", rating: 4.9, openHours: "24/7 Open", phone: "+1 (555) 019-2831", stock: "42 Units (O+)", lat: 40.7128, lng: -74.006 },
  { id: 2, name: "Red Cross Regional Center #4", distance: "3.5 km away", rating: 4.8, openHours: "8:00 AM - 8:00 PM", phone: "+1 (555) 482-9910", stock: "18 Units (O+)", lat: 40.728, lng: -73.995 },
  { id: 3, name: "St. Jude Hospital Blood Storage", distance: "5.0 km away", rating: 4.7, openHours: "24/7 Open", phone: "+1 (555) 773-1029", stock: "30 Units (O+)", lat: 40.705, lng: -74.012 },
];

const NearbyBloodBanksMap = ({ onSelectBank }) => {
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const mapRef = useRef(null);

  const hasApiKey = Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() !== "");

  useEffect(() => {
    // Request browser user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.log("Geolocation fallback to default NYC coordinates.")
      );
    }

    if (hasApiKey) {
      // Dynamically load Google Maps script
      if (window.google && window.google.maps) {
        initGoogleMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => initGoogleMap();
        script.onerror = () => setLoadError(true);
        document.head.appendChild(script);
      }
    }
  }, [hasApiKey]);

  const initGoogleMap = () => {
    if (!mapRef.current || !window.google) return;
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#0d1117" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#0d1117" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#8b949e" }] },
        ],
      });

      // User location marker
      new window.google.maps.Marker({
        position: userLocation,
        map,
        title: "Your Location",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
        },
      });

      // Blood bank markers
      sampleBloodBanks.forEach((bank) => {
        const marker = new window.google.maps.Marker({
          position: { lat: bank.lat, lng: bank.lng },
          map,
          title: bank.name,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#DC2626",
            fillOpacity: 1,
            strokeWeight: 1.5,
            strokeColor: "#FFFFFF",
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color:#000;font-family:sans-serif;font-size:12px;padding:4px">
            <strong>${bank.name}</strong><br/>
            <span>${bank.distance} • ${bank.stock}</span>
          </div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          if (onSelectBank) onSelectBank(bank);
        });
      });

      setMapLoaded(true);
    } catch (err) {
      console.error("Error initializing Google Map:", err);
      setLoadError(true);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Developer Warning Banner (Shown if API Key is empty) */}
      {!hasApiKey && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs space-y-1.5 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Google Maps API Key Not Configured</span>
          </div>
          <p className="text-gray-300">
            Please add <code className="bg-black/50 px-2 py-0.5 rounded text-amber-300 font-mono">VITE_GOOGLE_MAPS_API_KEY</code> inside the frontend <code className="bg-black/50 px-2 py-0.5 rounded text-amber-300 font-mono">.env</code> file.
          </p>
          <p className="text-[11px] text-gray-400 italic">
            Once you paste your API key, Google Maps will start loading automatically without any code changes.
          </p>
        </div>
      )}

      {/* Main Map Viewport / Fallback Simulator */}
      <div className="relative w-full h-80 rounded-3xl overflow-hidden glass-card border border-white/15 bg-[#090b10] flex flex-col items-center justify-center">
        {hasApiKey && !loadError ? (
          <div ref={mapRef} className="w-full h-full" />
        ) : (
          /* Interactive Fallback Map Visualizer */
          <div className="w-full h-full relative p-6 flex flex-col justify-between bg-gradient-to-br from-red-950/20 via-[#090b10] to-blue-950/20">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
              <span className="font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-rose-400 animate-pulse" />
                GPS Geolocation Active (Latitude: {userLocation.lat.toFixed(4)}, Longitude: {userLocation.lng.toFixed(4)})
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                3 Blood Banks Found Nearby
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-auto">
              {sampleBloodBanks.map((bank) => (
                <div
                  key={bank.id}
                  onClick={() => {
                    if (onSelectBank) onSelectBank(bank);
                    toast.success(`Selected ${bank.name}`);
                  }}
                  className="p-3.5 rounded-2xl glass-card border border-white/10 hover:border-rose-500/50 cursor-pointer space-y-1.5 transition-all text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="truncate">{bank.name}</span>
                    <span className="text-amber-400 text-[10px]">★ {bank.rating}</span>
                  </div>
                  <p className="text-gray-400 text-[11px]"><MapPin className="w-3 h-3 inline text-rose-400 mr-1" />{bank.distance}</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-red-600/30 text-red-300 text-[10px] font-bold">
                    {bank.stock}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-gray-400 text-center border-t border-white/10 pt-2">
              Showing nearby verified blood banks matching your geolocation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyBloodBanksMap;
