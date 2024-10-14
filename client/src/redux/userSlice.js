import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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
    dispatch(setUser(JSON.parse(savedUser)));
  } else {
    // Fallback to loading user from cookies (if you want to)
    const token = Cookies.get('propertyHubAuthToken');
    if (token) {
      const userData = { token }; // You can decode token here or fetch data from API
      dispatch(setUser(userData));
    }
  }
};

// Export reducer
export default userSlice.reducer;
