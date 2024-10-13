import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Use the environment variable

// Function to register a new user
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/api/auth/register`, userData, { withCredentials: true });
};

// Function to validate email availability
export const checkEmailAvailability = async (email) => {
  return await axios.get(`${API_URL}/api/auth/check-email/${email}`);
};

// Function to validate username availability
export const checkUsernameAvailability = async (username) => {
  return await axios.get(`${API_URL}/api/auth/check-username/${username}`);
};

