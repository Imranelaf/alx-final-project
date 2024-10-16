import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { loadUserFromStorage } from './redux/userSlice'; // Correct import

const root = createRoot(document.getElementById('root'));

// Load user from localStorage on app start
store.dispatch(loadUserFromStorage());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);