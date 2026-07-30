// stores/bloodDonationStore.js
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useBloodDonationStore = create((set, get) => ({
  // Blood bank state
  nearbyBloodBanks: [],
  selectedBloodBank: null,
  isLoadingBloodBanks: false,
  bloodBankError: null,
  
  // Appointment state
  appointments: [],
  isLoadingAppointments: false,
  appointmentError: null,
  appointmentSuccess: false,
  
  // User location
  userLocation: null,
  
  // Form state
  appointmentForm: {
    bloodBankId: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodType: '',
    dateOfBirth: ''
  },
  
  // Actions
  setUserLocation: (location) => set({ userLocation: location }),
  
  // Reset appointment success
  resetAppointmentSuccess: () => set({ appointmentSuccess: false }),
  
  // Update form fields
  updateAppointmentForm: (field, value) => set(state => ({
    appointmentForm: {
      ...state.appointmentForm,
      [field]: value
    }
  })),
  
  // Reset form
  resetAppointmentForm: () => set({
    appointmentForm: {
      bloodBankId: '',
      date: '',
      time: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bloodType: '',
      dateOfBirth: ''
    }
  }),
  
  // Select a blood bank
  selectBloodBank: (bloodBank) => set({
    selectedBloodBank: bloodBank,
    appointmentForm: {
      ...get().appointmentForm,
      bloodBankId: bloodBank._id
    }
  }),
  
  // Fetch nearby blood banks
  fetchNearbyBloodBanks: async (longitude, latitude) => {
    try {
      set({ isLoadingBloodBanks: true, bloodBankError: null });
      
      const response = await axiosInstance.get('/bloodBank/nearby', {
        params: { longitude, latitude }
      });
      
      set({
        nearbyBloodBanks: response.data,
        isLoadingBloodBanks: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby blood banks:', error);
      set({ 
        bloodBankError: 'Failed to load nearby blood banks',
        isLoadingBloodBanks: false
      });
      return [];
    }
  },
  
  // Create appointment
  createAppointment: async () => {
    try {
      set({ isLoadingAppointments: true, appointmentError: null });
      
      const response = await axiosInstance.post('/appointment', get().appointmentForm);
      
      set({
        appointments: [...get().appointments, response.data],
        isLoadingAppointments: false,
        appointmentSuccess: true
      });
      
      // Reset the form after successful submission
      get().resetAppointmentForm();
      
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      set({
        appointmentError: error.response?.data?.message || 'Failed to create appointment',
        isLoadingAppointments: false
      });
      return null;
    }
  },
  
  // Get user appointments
  fetchUserAppointments: async (email) => {
    try {
      set({ isLoadingAppointments: true, appointmentError: null });
      
      const response = await axiosInstance.get('/appointment', {
        params: { email }
      });
      
      set({
        appointments: response.data,
        isLoadingAppointments: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      set({
        appointmentError: 'Failed to load appointments',
        isLoadingAppointments: false
      });
      return [];
    }
  },
  
  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    try {
      set({ isLoadingAppointments: true, appointmentError: null });
      
      const response = await axiosInstance.put(`/appointment/${appointmentId}/cancel`);
      
      // Update the appointment in the local state
      set({
        appointments: get().appointments.map(app => 
          app._id === appointmentId ? response.data : app
        ),
        isLoadingAppointments: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      set({
        appointmentError: 'Failed to cancel appointment',
        isLoadingAppointments: false
      });
      return null;
    }
  }
}));

export default useBloodDonationStore;