import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/signup.css';
import Navbar from '../components/navbar';

const googleOAuthSignUp = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const redirectToGoogleSignup = () => {
    // Redirect to Google OAuth route in the backend
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/signup`;
  };

  const handleGoogleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google/signup`,
        { email },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setSuccessMessage('Signup successful! Redirecting...');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h1>Create an Account</h1>
        {error && <p className="error-message">{error}</p>} {/* Display error if any */}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}

        <form onSubmit={handleGoogleSignUp}>
          <input
            type="email"
            placeholder="Email Address*"
            required
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Continue'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/signin">Login</a>
        </p>

        <div className="divider">
          <hr /> <span>OR</span> <hr />
        </div>

        <div className="social-login">
          {/* Google OAuth signup */}
          <button className="social-button google" onClick={redirectToGoogleSignup}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
            Continue with Google
          </button>

          <button className="social-button microsoft" disabled>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" alt="Microsoft Logo" />
            Continue with Microsoft
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

export default googleOAuthSignUp;

