import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const useReportStore = create((set, get) => ({
  // State
  reports: [],
  loading: false,
  error: null,

  // Actions
  clearError: () => set({ error: null }),

  // Async Actions
  createReport: async (reportData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post('/report/create', reportData);
      set((state) => ({ 
        loading: false, 
        reports: [response.data.data, ...state.reports] 
      }));
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create report';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchReports: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/report/get');
      set({ 
        loading: false, 
        reports: response.data.data 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch reports';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteReport: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/report/remove/${id}`);
      set((state) => ({
        loading: false,
        reports: state.reports.filter(report => report._id !== id)
      }));
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete report';
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  getReportsCount: async () => {
    try {
      const response = await axiosInstance.get(`/report/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching reports count:', error);
      throw error;
    }
  }
}));

export default useReportStore;