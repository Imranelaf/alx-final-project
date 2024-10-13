import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance with a base URL and default options
const axiosInstance = axios.create({
  baseURL: API_URL,        // Base URL for all API requests
  withCredentials: true,   // Include credentials with every request (useful for authentication)
});

// Function to register a new user
export const registerUser = async (userData) => {
  console.log('registerUser called with:', userData);
  try {
    console.log('Sending request to:', `${API_URL}/api/auth/signup`); // Log API endpoint
    const response = await axiosInstance.post('/api/auth/signup', userData); // Use axiosInstance
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('API error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Function to validate email availability
export const checkEmailAvailability = async (email) => {
  console.log('checkEmailAvailability called with email:', email);
  try {
    const response = await axiosInstance.get(`/api/auth/check-email/${email}`); // Use axiosInstance
    console.log('Email availability response:', response);
    return response;
  } catch (error) {
    console.error('Error in checkEmailAvailability:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Function to validate username availability
export const checkUsernameAvailability = async (username) => {
  console.log('checkUsernameAvailability called with username:', username);
  try {
    const response = await axiosInstance.get(`/api/auth/check-username/${username}`); // Use axiosInstance
    console.log('Username availability response:', response);
    return response;
  } catch (error) {
    console.error('Error in checkUsernameAvailability:', error);
    throw error;
  }
};

