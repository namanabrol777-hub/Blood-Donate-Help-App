import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore.js"; // Assuming correct path
import { Camera, Mail, Phone, MapPin, Calendar, X, Loader2 } from "lucide-react"; // Added X for close, Loader2 for modals
import NavBar from "./NavBar.jsx";

const ProfilePage = () => {
  const {
    authUser,
    logout,
    isUpdatingProfile, // Used for profile pic loading state
    updateProfile,
    updatePhone,
    updateAddress,
    // Assuming loading states exist for phone/address updates
    // Add them if available: isUpdatingPhone, isUpdatingAddress
  } = useAuthStore();

  // Extract the user data correctly
  const userData = authUser?.data || authUser;

  const [selectedImg, setSelectedImg] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  // Keep view state if you plan to add other views (like settings, etc.) later
  // const [view, setView] = useState("profile");

  // --- State for modal loading ---
  // Initialize these based on your store's state if available
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);

  // Format address object to string (Remains the same)
  const formatAddress = (addressObj) => {
    if (!addressObj) return "No Address Provided";
    if (typeof addressObj === 'string') return addressObj.trim() ? addressObj : "No Address Provided";
    if (typeof addressObj === 'object') {
      const { street, city, state, zipCode, country } = addressObj;
      const parts = [street, city, state, zipCode, country].filter(part => part && String(part).trim());
      return parts.length > 0 ? parts.join(', ') : "No Address Provided";
    }
    return "No Address Provided";
  };

  // Handle image upload (Remains the same functionality)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image); // Update local state immediately for preview
      try {
        // updateProfile likely handles its own loading state via isUpdatingProfile
        await updateProfile({ profilePic: base64Image });
        // Optionally refetch user data or rely on store update
      } catch (error) {
        console.error("Failed to update profile picture:", error);
        setSelectedImg(userData?.profilePic || "/avatar.png"); // Revert preview on error
        // Add user feedback (e.g., toast notification)
      }
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      // Add user feedback
    };
  };


  // Handle address update (Remains the same functionality)
  const handleAddressUpdate = async () => {
    if (newAddress.trim()) {
      setIsSavingAddress(true); // Start loading
      try {
        await updateAddress({ address: newAddress.trim() });
        if (authUser) {
          if (authUser.data) authUser.data.address = newAddress.trim();
          else authUser.address = newAddress.trim();
        } // Clear input after success
        // Add success feedback (toast)
      } catch (error) {
        console.error("Failed to update address:", error);
        // Add error feedback (toast)
      } finally {
        setIsSavingAddress(false); // Stop loading
      }
    } else {
      // Feedback: Address cannot be empty
      alert("Address cannot be empty.");
    }
  };

  // Handle phone update (Remains the same functionality)
  const handlePhoneUpdate = async () => {
    // Basic validation for phone numbers
    if (newPhone.trim() && /^[+]?[0-9\s\-()]+$/.test(newPhone.trim())) {
      setIsSavingPhone(true); // Start loading
      try {
        // ✅ Backend expects { phone }
        await updatePhone({ phone: newPhone.trim() });

        // ✅ Update local store (so UI updates instantly)
        if (authUser) {
          if (authUser.data) authUser.data.phoneNumber = newPhone.trim();
          else authUser.phoneNumber = newPhone.trim();
        }

        // ✅ Close modal & clear input
        setIsPhoneModalOpen(false);
        setNewPhone("");

        // ✅ Optional: show success feedback
        alert("Phone number updated successfully!");
      } catch (error) {
        console.error("Failed to update phone:", error);
        alert("Failed to update phone number. Please try again.");
      } finally {
        setIsSavingPhone(false); // Stop loading
      }
    } else {
      // Invalid phone number
      alert("Please enter a valid phone number.");
    }
  };



  // Set initial selected image from user data
  useEffect(() => {
    if (userData?.profilePic) {
      setSelectedImg(userData.profilePic);
    } else {
      setSelectedImg("/avatar.png"); // Set default if no profile pic
    }
  }, [userData?.profilePic]); // Depend only on profilePic

  // Show loading state if user data isn't available yet
  if (!userData) {
    return (
      // Use the theme background
      <div className="flex items-center justify-center p-6 bg-[#fdf6f7] min-h-screen mt-16">
        <Loader2 className="h-8 w-8 text-[#dc3545] animate-spin" />
        <span className="ml-3 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  return (
    // Main container with theme background and padding
    <>
      <NavBar />
      <div className="p-6 bg-[#fdf6f7] min-h-screen mt-20"> {/* Added mt-16 */}
        {/* Main profile card - White background, rounded, shadow */}
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end mb-8 gap-6"> {/* Adjusted gap and alignment */}
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              {/* Loading spinner overlay for profile picture update */}
              {isUpdatingProfile && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 rounded-full z-10">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <img
                src={selectedImg || "/avatar.png"} // Use state for preview, fallback to default
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-200 shadow-sm" // Added border
              />
              {/* Camera icon for upload - Themed red background */}
              <label
                htmlFor="file-upload"
                className="absolute bottom-1 right-1 p-2 bg-[#dc3545] hover:bg-[#c82333] rounded-full cursor-pointer shadow-md transition-colors"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" color="white" /> {/* Smaller icon */}
              </label>
              <input
                type="file"
                id="file-upload"
                accept="image/*" // Specify accepted file types
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Name and Email */}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {userData?.fullName || "User Name"}
              </h2>
              <div className="flex items-center justify-center sm:justify-start text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                <span>{userData?.email || "user@example.com"}</span>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-5">Personal Information</h3>

            <div className="space-y-4"> {/* Added space between items */}
              {/* Phone Number */}
              <div className="flex flex-wrap items-center text-gray-700 gap-x-4 gap-y-2">
                <div className="flex items-center flex-shrink-0 w-32"> {/* Fixed width label */}
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium">Phone:</span>
                </div>
                <span className="flex-grow break-words">{userData?.phoneNumber || <span className="text-gray-400 italic">Not Provided</span>}</span>
                {/* Update Button - Subtle red link style */}
                <button
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors focus:outline-none"
                  onClick={() => setIsPhoneModalOpen(true)}
                >
                  Update
                </button>
              </div>

              {/* Address */}
              <div className="flex flex-wrap items-center text-gray-700 gap-x-4 gap-y-2">
                <div className="flex items-center flex-shrink-0 w-32"> {/* Fixed width label */}
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium">Address:</span>
                </div>
                <span className="flex-grow break-words">{formatAddress(userData?.address) === "No Address Provided" ? <span className="text-gray-400 italic">Not Provided</span> : formatAddress(userData?.address)}</span>
                {/* Update Button - Subtle red link style */}
                <button
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors focus:outline-none"
                  onClick={() => setIsAddressModalOpen(true)}
                >
                  Update
                </button>
              </div>

              {/* Member Since */}
              <div className="flex flex-wrap items-center text-gray-700 gap-x-4 gap-y-2">
                <div className="flex items-center flex-shrink-0 w-32"> {/* Fixed width label */}
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="font-medium">Member Since:</span>
                </div>
                <span className="flex-grow break-words">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 border-t border-gray-200 pt-6">
            {/* Logout Button - Themed Red */}
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#dc3545] hover:bg-[#c82333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              onClick={logout}
            >
              Logout
            </button>
            {/* Add other buttons like "Edit Profile" here if needed */}
          </div>
        </div>


        {/* --- Modals --- */}

        {/* Address Modal */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
              {/* Close button */}
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-semibold text-gray-800 mb-5">Update Address</h3>
              <textarea
                // Themed textarea style
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm mb-4 resize-none" // Changed resize
                rows="4"
                placeholder="Enter your full address (Street, City, State, Zip, Country)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-3">
                {/* Cancel Button - Gray outline */}
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                  onClick={() => setIsAddressModalOpen(false)}
                  disabled={isSavingAddress}
                >
                  Cancel
                </button>
                {/* Save Button - Themed Red */}
                <button
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSavingAddress
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-[#dc3545] hover:bg-[#c82333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    } transition-colors`}
                  onClick={handleAddressUpdate}
                  disabled={isSavingAddress}
                >
                  {isSavingAddress ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Address
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phone Modal */}
        {isPhoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
              {/* Close button */}
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-semibold text-gray-800 mb-5">Update Phone Number</h3>
              <input
                type="tel" // Use tel type for phone numbers
                // Themed input style
                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm mb-4"
                placeholder="Enter your new phone number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                {/* Cancel Button - Gray outline */}
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                  onClick={() => setIsPhoneModalOpen(false)}
                  disabled={isSavingPhone}
                >
                  Cancel
                </button>
                {/* Save Button - Themed Red */}
                <button
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSavingPhone
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-[#dc3545] hover:bg-[#c82333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    } transition-colors`}
                  onClick={handlePhoneUpdate}
                  disabled={isSavingPhone}
                >
                  {isSavingPhone ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Phone
                </button>
              </div>
            </div>
          </div>
        )}
      </div> // End main container
    </>
  );
};

export default ProfilePage;