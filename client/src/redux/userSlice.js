import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Thunk to load user data from cookies
export const loadUserFromCookies = () => (dispatch) => {
  const token = Cookies.get('propertyHubAuthToken');
  if (token) {
    // Optional: you can decode the token if it holds user information, or fetch the user data from backend
    const userData = { token };  // or fetch user info from a `/me` endpoint
    dispatch(setUser(userData));
  }
};

// Export reducer
export default userSlice.reducer;
