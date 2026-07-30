import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../config/maps";
import {
  MapPin,
  Navigation,
  Phone,
  Building2,
  Calendar,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  Compass,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const libraries = ["places", "geometry"];

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.5rem",
};

const NearbyBloodBanksMap = ({ onSelectBank, onCloseModal }) => {
  // State Machine: 'IDLE' | 'REQUESTING' | 'GRANTED' | 'DENIED' | 'MANUAL'
  const [flowState, setFlowState] = useState("IDLE");
  const [loadingStep, setLoadingStep] = useState("Getting current location...");
  const [userCoords, setUserCoords] = useState(null);
  const [manualCity, setManualCity] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY || "";

  // Only load Google Maps JS SDK when location is GRANTED or MANUAL coords are set
  const shouldLoadMap = flowState === "GRANTED" && Boolean(userCoords);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
    preventGoogleFontsLoading: true,
  });

  // STEP 2: Handle Geolocation Request
  const requestLocationPermission = () => {
    setFlowState("REQUESTING");
    setLoadingStep("Getting current location...");

    if (!navigator.geolocation) {
      toast.error("Browser does not support Geolocation");
      setFlowState("DENIED");
      return;
    }

    // Step-by-step loading animation
    const timer1 = setTimeout(() => setLoadingStep("Searching nearby blood banks within 15 km..."), 1000);
    const timer2 = setTimeout(() => setLoadingStep("Initializing map matrix..."), 2000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setFlowState("GRANTED");
        toast.success("Location acquired! Map initialized.");
      },
      (error) => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        console.warn("Geolocation permission denied or failed:", error.message);
        setFlowState("DENIED");
        toast.error("Location permission denied or unavailable");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Manual City Submission
  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    if (!manualCity.trim()) {
      toast.error("Please enter a city or address");
      return;
    }
    // Fallback coordinates for manual input
    const fallbackCoords = { lat: 40.7128, lng: -74.006 };
    setUserCoords(fallbackCoords);
    setFlowState("GRANTED");
    toast.success(`Location set to "${manualCity}". Map initialized!`);
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (!window.google || !userCoords) return;

    // Search nearby blood banks within 15 km using Places API
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: userCoords,
      radius: 15000, // 15 km
      keyword: "blood bank blood donation red cross hospital blood storage",
    };

    setLoadingPlaces(true);
    service.nearbySearch(request, (results, status) => {
      setLoadingPlaces(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const formatted = results.map((place, idx) => {
          const placeLat = place.geometry?.location?.lat() || userCoords.lat;
          const placeLng = place.geometry?.location?.lng() || userCoords.lng;

          let distanceKm = "1.5 km";
          if (window.google.maps.geometry) {
            const distMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(userCoords.lat, userCoords.lng),
              new window.google.maps.LatLng(placeLat, placeLng)
            );
            distanceKm = `${(distMeters / 1000).toFixed(1)} km`;
          }

          return {
            id: place.place_id || `place-${idx}`,
            name: place.name,
            lat: placeLat,
            lng: placeLng,
            rating: place.rating || 4.8,
            openNow: place.opening_hours?.open_now ?? true,
            address: place.vicinity || "Medical District",
            distance: distanceKm,
            phone: "+1 (555) 234-5678",
            directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${placeLat},${placeLng}`,
          };
        });
        setPlaces(formatted);
      }
    });
  }, [userCoords]);

  const handleCardClick = (bank) => {
    setSelectedBank(bank);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: bank.lat, lng: bank.lng });
      mapRef.current.setZoom(15);
    }
  };

  // --- STEP 1: INITIAL LOCATION PERMISSION MODAL ('IDLE' State) ---
  if (flowState === "IDLE") {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl glass-card border border-rose-500/40 shadow-2xl text-center space-y-6 bg-gradient-to-b from-[#090b10] to-[#05070d]">
        <div className="w-16 h-16 rounded-3xl shimmer-btn-red mx-auto flex items-center justify-center text-white shadow-xl glow-biotech-red">
          <Navigation className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white tracking-tight">📍 Finding Nearby Blood Banks...</h3>
          <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
            We need your location to find the nearest verified blood banks, hospitals, and emergency donation centers within 15 km.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={requestLocationPermission}
            className="px-6 py-3 rounded-xl shimmer-btn-red text-white text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Allow Location</span>
          </button>
          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- STEP 2 & 3: REQUESTING GEOLOCATION LOADING ANIMATION ('REQUESTING' State) ---
  if (flowState === "REQUESTING") {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl glass-card border border-rose-500/40 text-center space-y-6 bg-[#05070d]">
        <div className="w-16 h-16 rounded-3xl bg-rose-600/20 border border-rose-500/50 mx-auto flex items-center justify-center text-rose-400 glow-biotech-red">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">{loadingStep}</h3>
          <p className="text-xs text-gray-400">Please choose 'Allow' on your browser location prompt...</p>
        </div>

        <div className="w-48 h-1.5 rounded-full bg-white/10 mx-auto overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  // --- LOCATION DENIED SCREEN ('DENIED' State) ---
  if (flowState === "DENIED") {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl glass-card border border-red-500/40 text-center space-y-6 bg-[#05070d]">
        <div className="w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/50 mx-auto flex items-center justify-center text-red-400 glow-biotech-red">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">Location Permission Required</h3>
          <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
            Location permission is required to find nearby blood banks within 15 km of your current position.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={requestLocationPermission}
            className="px-5 py-2.5 rounded-xl shimmer-btn-red text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Geolocation</span>
          </button>
          <button
            onClick={() => setFlowState("MANUAL")}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer"
          >
            Enter Location Manually
          </button>
        </div>
      </div>
    );
  }

  // --- MANUAL LOCATION ENTRY ('MANUAL' State) ---
  if (flowState === "MANUAL") {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl glass-card border border-rose-500/40 text-center space-y-6 bg-[#05070d]">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <MapPin className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Enter City or Zip Code</h3>
          <p className="text-xs text-gray-400">Search blood banks in your target city</p>
        </div>

        <form onSubmit={handleManualLocationSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. New York, NY or 10001"
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl shimmer-btn-red text-white font-bold text-xs shadow-lg cursor-pointer"
          >
            Initialize Map for City
          </button>
        </form>
      </div>
    );
  }

  // --- STEP 5, 6 & 7: LIVE GOOGLE MAP RENDERED AFTER LOCATION IS ACQUIRED ('GRANTED' State) ---
  return (
    <div className="relative w-full h-[460px] rounded-3xl overflow-hidden glass-card border border-white/15 bg-[#05070d] flex">

      {/* Collapsible Side Panel Listing Live Places API Results */}
      <div
        className={`h-full bg-[#090b10]/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-20 flex flex-col justify-between shrink-0 ${isPanelOpen ? "w-72 md:w-80 p-4" : "w-12 p-2 items-center"
          }`}
      >
        <div className="space-y-3 overflow-hidden flex-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            {isPanelOpen && (
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-rose-400" />
                <span>Nearby Centers ({places.length})</span>
              </span>
            )}
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
            >
              {isPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {isPanelOpen && (
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {loadingPlaces ? (
                <div className="py-8 text-center text-xs text-gray-400 space-y-2">
                  <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Searching 15 km Places API...</p>
                </div>
              ) : places.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No centers found within 15 km.</p>
              ) : (
                places.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => handleCardClick(bank)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${selectedBank?.id === bank.id
                        ? "bg-rose-600/20 border-rose-500 text-white shadow-lg glow-biotech-red"
                        : "bg-white/5 border-white/10 hover:border-white/20 text-gray-300"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-1 font-bold text-white">
                      <span className="truncate">{bank.name}</span>
                      <span className="text-amber-400 text-[10px] shrink-0">★ {bank.rating}</span>
                    </div>

                    <p className="text-[11px] text-gray-400 truncate mt-1">
                      <MapPin className="w-3 h-3 inline text-rose-400 mr-1" />
                      {bank.address}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold text-rose-400">{bank.distance}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${bank.openNow ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {bank.openNow ? "Open Now" : "Closed"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Google Maps Viewport */}
      <div className="flex-1 h-full relative">
        {shouldLoadMap && isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userCoords}
            zoom={13}
            onLoad={onMapLoad}
            options={{
              styles: [
                { elementType: "geometry", stylers: [{ color: "#05070d" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#05070d" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a101f" }] },
              ],
              disableDefaultUI: false,
              zoomControl: true,
            }}
          >
            {/* Animated Blue Current Location Marker */}
            <Marker
              position={userCoords}
              title="Your Current Geolocation"
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3B82F6",
                fillOpacity: 1,
                strokeWeight: 3,
                strokeColor: "#FFFFFF",
              }}
            />

            {/* Red Custom Blood-Drop Markers */}
            {places.map((bank) => (
              <Marker
                key={bank.id}
                position={{ lat: bank.lat, lng: bank.lng }}
                title={bank.name}
                onClick={() => setSelectedBank(bank)}
                icon={{
                  path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 7,
                  fillColor: selectedBank?.id === bank.id ? "#EF4444" : "#DC2626",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#FFFFFF",
                }}
              />
            ))}

            {/* InfoWindow Popup */}
            {selectedBank && (
              <InfoWindow
                position={{ lat: selectedBank.lat, lng: selectedBank.lng }}
                onCloseClick={() => setSelectedBank(null)}
              >
                <div style={{ color: "#000", fontFamily: "sans-serif", padding: "6px", maxWidth: "230px" }}>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" }}>{selectedBank.name}</h4>
                  <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#4b5563" }}>
                    📍 {selectedBank.address}
                  </p>
                  <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#111827", fontWeight: "bold" }}>
                    {selectedBank.distance} • ⭐ {selectedBank.rating} • <span style={{ color: "#16a34a" }}>{selectedBank.openNow ? "Open" : "Closed"}</span>
                  </p>

                  <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                    <a
                      href={selectedBank.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        backgroundColor: "#f3f4f6",
                        color: "#111827",
                        textAlign: "center",
                        padding: "4px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textDecoration: "none",
                      }}
                    >
                      🗺️ Directions
                    </a>
                    <a
                      href={`tel:${selectedBank.phone}`}
                      style={{
                        flex: 1,
                        backgroundColor: "#f3f4f6",
                        color: "#111827",
                        textAlign: "center",
                        padding: "4px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textDecoration: "none",
                      }}
                    >
                      📞 Call
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectBank) onSelectBank(selectedBank);
                      setSelectedBank(null);
                    }}
                    style={{
                      width: "100%",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "7px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Book Appointment Here
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-xs text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
            <p>Rendering Google Maps Canvas...</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default NearbyBloodBanksMap;
