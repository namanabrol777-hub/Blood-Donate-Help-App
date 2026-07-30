// services/donorService.js
import { axiosInstance } from "../lib/axios.js";

const API_URL = '/donor';

export const getDonorsCount = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/count`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching donors count:', error);
    throw error;
  }
};

export const getAllDonors = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching donors:', error);
    throw error;
  }
};

export const getDonorById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donor with id ${id}:`, error);
    throw error;
  }
};

export const createDonor = async (donorData) => {
  try {
    const response = await axiosInstance.post(API_URL, donorData);
    return response.data;
  } catch (error) {
    console.error('Error creating donor:', error);
    throw error;
  }
};

export const updateDonor = async (id, donorData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, donorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating donor with id ${id}:`, error);
    throw error;
  }
};

export const deleteDonor = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting donor with id ${id}:`, error);
    throw error;
  }
};