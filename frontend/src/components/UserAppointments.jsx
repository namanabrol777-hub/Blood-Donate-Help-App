import { useState, useEffect } from 'react';
import useBloodDonationStore from '../stores/useAppointmentStore';

const UserAppointments = () => {
  const { 
    fetchUserAppointments, 
    appointments, 
    isLoadingAppointments, 
    appointmentError, 
    cancelAppointment 
  } = useBloodDonationStore();
  
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showAppointments, setShowAppointments] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userEmail) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    await fetchUserAppointments(userEmail);
    setShowAppointments(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    setCancellingId(appointmentId);
    await cancelAppointment(appointmentId);
    setCancellingId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if appointment is cancellable (more than 24 hours before appointment)
  const isCancellable = (appointmentDate) => {
    const now = new Date();
    const appDate = new Date(appointmentDate);
    
    // Calculate difference in hours
    const diffMs = appDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours > 24 && appDate > now;
  };

  // Get status text and color
  const getStatusInfo = (appointment) => {
    if (appointment.status === 'cancelled') {
      return { text: 'Cancelled', color: 'text-red-600' };
    }
    
    if (appointment.status === 'completed') {
      return { text: 'Completed', color: 'text-green-600' };
    }
    
    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
    if (appointmentDate < new Date()) {
      return { text: 'Expired', color: 'text-gray-600' };
    }
    
    return { text: 'Scheduled', color: 'text-blue-600' };
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl text-gray-600 font-semibold mb-4">View Your Appointments</h2>
      
      {!showAppointments ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={handleEmailChange}
              className="w-full text-black placeholder-gray-400 border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your email address"
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isLoadingAppointments}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-red-400"
          >
            {isLoadingAppointments ? 'Loading...' : 'Find My Appointments'}
          </button>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">Appointments for: {userEmail}</p>
            <button
              onClick={() => setShowAppointments(false)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Use different email
            </button>
          </div>
          
          {appointmentError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {appointmentError}
            </div>
          )}
          
          {isLoadingAppointments ? (
            <div className="text-center p-4">Loading your appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-gray-600">No appointments found for this email.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment);
                
                return (
                  <div key={appointment._id} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-600">{appointment.bloodBank.name}</h3>
                      <span className={`text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(appointment.date)} at {appointment.time}
                    </p>
                    
                    <div className="mt-3 text-gray-600 text-sm">
                      <p><span className="font-medium">Name:</span> {appointment.firstName} {appointment.lastName}</p>
                      <p><span className="font-medium">Blood Type:</span> {appointment.bloodType}</p>
                    </div>
                    
                    {appointment.status !== 'cancelled' && isCancellable(appointment.date) && (
                      <div className="mt-3">
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          disabled={cancellingId === appointment._id}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel Appointment'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserAppointments;