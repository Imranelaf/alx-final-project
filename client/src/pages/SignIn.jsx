import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../assets/styles/signin.css';
import Navbar from '../components/navbar';

const googleSignIn = () => {
  const [searchParams] = useSearchParams(); // To get query parameters from the URL
  const navigate = useNavigate(); // To handle redirection after success
  const [error, setError] = useState(null); // Error state for Google sign-in
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  // Handle the response from Google OAuth (success or failure)
  useEffect(() => {
    const message = searchParams.get('message');

    // If the user is redirected back after successful Google sign-in
    if (window.location.pathname === '/signin/success') {
      setSuccessMessage(message || 'Sign-in successful!');
    }

    // If the user is redirected back after Google sign-in failure
    if (window.location.pathname === '/signin/failure') {
      setError(message || 'Failed to sign in. Please try again.');
    }
  }, [searchParams, navigate]);

  // Handle Google OAuth login redirection
  const redirectToGoogleSignin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/signin`;
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h1>Welcome back</h1>

        {/* Sign-in using email (keep this unchanged) */}
        <form>
          <input type="email" placeholder="Email address*" required className="input-email" />
          <button type="submit" className="continue-button">Continue</button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        <div className="divider">
          <hr /> <span>OR</span> <hr />
        </div>

        {/* Display success or error messages for Google sign-in */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="social-login">
          {/* Google OAuth sign-in */}
          <button className="social-button google" onClick={redirectToGoogleSignin}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
            Continue with Google
          </button>

          {/* Other social logins (disabled for now) */}
          <button className="social-button microsoft" disabled>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" alt="Microsoft Logo" />
            Continue with Microsoft Account
          </button>

          <button className="social-button apple" disabled>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" />
            Continue with Apple
          </button>
        </div>
      </div>
    </>
  );
};

export default googleSignIn;

