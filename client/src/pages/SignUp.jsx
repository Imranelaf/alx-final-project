import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/signup.css';
import Navbar from '../components/navbar';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();  // To read query parameters
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the backend has redirected with an error message (if any)
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(message);  // Set the error message in the state
    }
  }, [searchParams]);

  // Redirect for Google OAuth sign-up
  const redirectToGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/signup`;
  };

  // Handle Email/Password Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { email, password }, // Including password in the registration request
        { withCredentials: true }
      );

      // If signup is successful, redirect to email verification page
      if (response.data.success) {
        navigate('/verify-email');  // Redirect to email verification page
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      
      // Handle "User already exists" case or other errors
      if (errorMessage === 'User already exists, please sign in') {
        navigate(`/signin?message=${encodeURIComponent(errorMessage)}`);
      } else {
        navigate(`/signup/failure?message=${encodeURIComponent(errorMessage)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h1>Create an Account</h1>

        {/* Show any error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Email/Password Sign-Up Form */}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email Address*"
            required
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password*"
            required
            className="input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/signin">Login</a>
        </p>

        <div className="divider">
          <hr /> <span>OR</span> <hr />
        </div>

        {/* Social OAuth Buttons */}
        <div className="social-login">
          <button className="social-button google" onClick={redirectToGoogleSignUp}>
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

export default SignUp;

