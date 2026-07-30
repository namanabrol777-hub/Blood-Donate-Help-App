import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../../config/maps";
import { MapPin, Navigation, Phone, Building2, Calendar, Star, Clock, ChevronRight, ChevronLeft, Compass, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const libraries = ["places", "geometry"];

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1.5rem",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const NearbyBloodBanksMap = ({ onSelectBank }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [selectedBank, setSelectedBank] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
  });

  // Request user GPS geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(userCoords);
        },
        (err) => {
          console.log("Geolocation permission fallback to default coordinates.");
        }
      );
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (!window.google) return;

    // Search nearby blood banks within 15 km using Places API
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: center,
      radius: 15000, // 15 km
      keyword: "blood bank blood donation red cross hospital blood storage",
    };

    setLoadingPlaces(true);
    service.nearbySearch(request, (results, status) => {
      setLoadingPlaces(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const formatted = results.map((place, idx) => {
          const placeLat = place.geometry?.location?.lat() || center.lat;
          const placeLng = place.geometry?.location?.lng() || center.lng;

          // Calculate distance from user center
          let distanceKm = "1.5 km";
          if (window.google.maps.geometry) {
            const distMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(center.lat, center.lng),
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
  }, [center]);

  const handleCardClick = (bank) => {
    setSelectedBank(bank);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: bank.lat, lng: bank.lng });
      mapRef.current.setZoom(15);
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-80 rounded-3xl glass-card border border-red-500/30 flex items-center justify-center p-6 text-center text-red-400 text-xs">
        Failed to load Google Maps JS SDK. Please verify your internet connection.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] rounded-3xl overflow-hidden glass-card border border-white/15 bg-[#05070d] flex">
      
      {/* Collapsible Side Panel Listing Live Places Results */}
      <div
        className={`h-full bg-[#090b10]/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-20 flex flex-col justify-between shrink-0 ${
          isPanelOpen ? "w-72 md:w-80 p-4" : "w-12 p-2 items-center"
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
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedBank?.id === bank.id
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
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
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
              position={center}
              title="Your Current Location"
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
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p>Initializing Google Maps JS SDK...</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default NearbyBloodBanksMap;
