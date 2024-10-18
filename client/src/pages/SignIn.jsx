import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/authServices';  // Import the login function from authServices
import '../assets/styles/signin.css';
import Navbar from '../components/navbar';
import axiosWithHeader from '../services/axios'

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  // Handle Google OAuth login redirection
  const redirectToGoogleSignin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/signin`;
  };

  // Handle Email and Password Sign-In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call loginUser function from authServices
      const response = await loginUser({ email, password }, dispatch);
      localStorage.setItem('token', response.data.token);
      // Set the token as a default header for future requests
      axiosWithHeader.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      if (response.data.success) {
        // Navigate to success page after login
        navigate('/signin/success');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      navigate(`/signin/failure?message=${encodeURIComponent(errorMessage)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h1>Welcome back</h1>

       
          <form onSubmit={handleEmailSignIn}>
            <input
              type="email"
              placeholder="Email address*"
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
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        <div className="divider">
          <hr /> <span>OR</span> <hr />
        </div>

        {/* Google OAuth sign-in */}
        <div className="social-login">
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

export default SignIn;
