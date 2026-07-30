import { useState } from 'react';
import useBloodDonationStore from '../stores/useAppointmentStore';

const AppointmentForm = () => {
  const { 
    appointmentForm, 
    updateAppointmentForm, 
    createAppointment, 
    selectedBloodBank, 
    isLoadingAppointments, 
    appointmentError,
    appointmentSuccess,
    resetAppointmentSuccess
  } = useBloodDonationStore();
  
  const [formErrors, setFormErrors] = useState({});

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  // Blood types
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateAppointmentForm(name, value);
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!appointmentForm.date) errors.date = 'Please select a date';
    if (!appointmentForm.time) errors.time = 'Please select a time';
    if (!appointmentForm.firstName) errors.firstName = 'First name is required';
    if (!appointmentForm.lastName) errors.lastName = 'Last name is required';
    if (!appointmentForm.email) errors.email = 'Email is required';
    if (appointmentForm.email && !/\S+@\S+\.\S+/.test(appointmentForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!appointmentForm.phone) errors.phone = 'Phone number is required';
    if (!appointmentForm.bloodType) errors.bloodType = 'Blood type is required';
    if (!appointmentForm.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      await createAppointment();
    }
  };

  // Calculate minimum date (tomorrow)
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Calculate maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  if (appointmentSuccess) {
    return (
      <div className="p-4 bg-white text rounded-lg shadow-md">
        <div className="text-center p-6">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Appointment Booked Successfully!</h3>
          <p className="mt-1 text-sm text-gray-600">
            Thank you for scheduling your blood donation. You will receive a confirmation email shortly.
          </p>
          <div className="mt-6">
            <button
              onClick={resetAppointmentSuccess}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBloodBank) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-center">Please select a blood bank first to continue.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Schedule Blood Donation</h2>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h3 className="font-medium">Selected Blood Bank</h3>
        <p>{selectedBloodBank.name}</p>
        <p className="text-sm text-gray-600">{selectedBloodBank.address}</p>
      </div>
      
      {appointmentError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {appointmentError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={appointmentForm.date}
                onChange={handleInputChange}
                min={getTomorrowDate()}
                max={getMaxDate()}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
              <style jsx>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                  filter: invert(0.5);
                  padding: 0;
                  margin-left: 0;
                }
              `}</style>
            </div>
            {formErrors.date && <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>}
          </div>
          
          {/* Time Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <select
              name="time"
              value={appointmentForm.time}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select a time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {formErrors.time && <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>}
          </div>
          
          {/* Personal Information */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={appointmentForm.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {formErrors.firstName && <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={appointmentForm.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {formErrors.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={appointmentForm.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={appointmentForm.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <select
              name="bloodType"
              value={appointmentForm.bloodType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select blood type</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {formErrors.bloodType && <p className="mt-1 text-sm text-red-600">{formErrors.bloodType}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={appointmentForm.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-red-500 focus:border-red-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            {formErrors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{formErrors.dateOfBirth}</p>}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoadingAppointments}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-red-400"
          >
            {isLoadingAppointments ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;