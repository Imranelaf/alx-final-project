import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import {jwtDecode }from 'jwt-decode'; // Ensure jwt-decode is imported

const USER_STORAGE_KEY = 'propertyHubUser';

// Initial state
const initialState = {
  currentUser: null,
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      // Save user to localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.currentUser = null;
      // Remove user from localStorage
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Thunk to load user data from localStorage or cookies
export const loadUserFromStorage = () => (dispatch) => {
  // Try to load user from localStorage
  const savedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser); // Safely parse JSON
      dispatch(setUser(parsedUser)); // Set user in Redux
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem(USER_STORAGE_KEY); // Clear corrupted data
    }
  } else {
    // Fallback to loading user from cookies (if you want to)
    const token = Cookies.get('propertyHubAuthToken');
    if (token) {
      try {
        const userData = jwtDecode(token); // Decode the token to get user data
        
        
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
};

// Export reducer
export default userSlice.reducer;
