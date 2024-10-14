import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { loadUserFromCookies } from './redux/userSlice'; // Correct import

const root = createRoot(document.getElementById('root'));

store.dispatch(loadUserFromCookies()); // Load user from cookies on app start

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
