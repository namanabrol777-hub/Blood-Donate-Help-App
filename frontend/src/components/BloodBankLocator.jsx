import { useEffect, useState } from 'react';
import useBloodDonationStore from '../stores/useAppointmentStore';

const BloodBankLocator = () => {
  const { 
    userLocation, 
    setUserLocation, 
    fetchNearbyBloodBanks, 
    nearbyBloodBanks, 
    isLoadingBloodBanks, 
    bloodBankError, 
    selectBloodBank 
  } = useBloodDonationStore();
  
  const [locationError, setLocationError] = useState('');

  // Get user location when component mounts
  // useEffect(() => {
  //   if (!userLocation) {
  //     getUserLocation();
  //   }
  // }, [userLocation]);

  // Get user location and fetch nearby blood banks
  const getUserLocation = () => {
    setLocationError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation({ longitude, latitude });
          fetchNearbyBloodBanks(longitude, latitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError('Unable to access your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleSelectBloodBank = (bloodBank) => {
    selectBloodBank(bloodBank);
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance.toFixed(1);
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Find Blood Banks Near You</h2>
      
      {locationError && (
        <div className="mb-4 text-red-500">{locationError}</div>
      )}
      
      <button 
        onClick={getUserLocation}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        disabled={isLoadingBloodBanks}
      >
        {isLoadingBloodBanks ? 'Locating...' : 'Share My Location'}
      </button>
      
      {bloodBankError && (
        <div className="mb-4 text-red-500">{bloodBankError}</div>
      )}
      
      {nearbyBloodBanks.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-2">Nearby Blood Banks</h3>
          <div className="space-y-3">
            {nearbyBloodBanks.map((bloodBank) => (
              <div 
                key={bloodBank._id} 
                className="border p-3 rounded cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectBloodBank(bloodBank)}
              >
                <h4 className="font-medium">{bloodBank.name}</h4>
                <p className="text-sm text-gray-600">{bloodBank.address}</p>
                {userLocation && (
                  <p className="text-sm text-gray-600">
                    Distance: {calculateDistance(
                      userLocation.latitude, 
                      userLocation.longitude, 
                      bloodBank.location.coordinates[1], 
                      bloodBank.location.coordinates[0]
                    )} km
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : !isLoadingBloodBanks && userLocation ? (
        <p>No blood banks found nearby. Please try a different location.</p>
      ) : null}
    </div>
  );
};

export default BloodBankLocator;