import axios from 'axios';
import { setUser } from '../redux/userSlice';
import Cookies from 'js-cookie';


const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance with a base URL and default options
const axiosInstance = axios.create({
  baseURL: API_URL,        // Base URL for all API requests
  withCredentials: true,   // Include credentials with every request (useful for authentication)
});

// Function to register a new user
export const registerUser = async (userData, dispatch) => {
  console.log('registerUser called with:', userData);
  try {
    console.log('Sending request to:', `${API_URL}/api/auth/signup`); // Log API endpoint
    const response = await axiosInstance.post('/api/auth/signup', userData); // Use axiosInstance
    console.log('API response:', response);

    // Dispatch the action after successful registration
    dispatch(setUser(response));

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
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Login function
export const loginUser = async (userData, dispatch) => {
  try {
    const response = await axiosInstance.post('/api/auth/signin', userData); // Use axiosInstance
    console.log('Login API response:', response);

    // Assuming your backend sends the token in response
    Cookies.set('propertyHubAuthToken', response.data.token); // Store token in cookies
    dispatch(setUser(response.data.user)); // Dispatch the action to update Redux and persist it

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
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



import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const SignOut = () => {
  const navigate = useNavigate(); // Using react-router-dom to navigate without full page reload

  try {
    axios.put(`${API_URL}/api/auth/signout`)
      .then(() => {
        // Clear cookies and local storage after successful sign-out
        Cookies.remove('propertyHubAuthToken');
        localStorage.clear();

        // Navigate to the homepage
        navigate('/');
      })
      .catch((error) => {
        console.error('Sign out failed:', error);
        setError('Failed to sign out. Please try again.');
      });
  } catch (error) {
    console.error('Sign out failed:', error);
    setError('Failed to sign out. Please try again.');
  }
};

