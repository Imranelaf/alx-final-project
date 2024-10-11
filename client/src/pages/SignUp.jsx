import React from 'react';
import axios from 'axios';  // For making API requests
import '../assets/styles/signup.css';  // Ensure correct path

const Register = () => {
  // Handle Google login by redirecting the user to the backend
  const handleGoogleLogin = async () => {
    try {
      // Redirect to the backend's Google OAuth route
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Error redirecting to Google OAuth:', error);
    }
  };

  return (
    <div className="register-container">
      <h1>Create an Account</h1>
      <form>
        <input type="email" placeholder="Email Address*" required className="input-email" />
        <button type="submit" className="continue-button">Continue</button>
      </form>
      <p className="login-link">
        Already have an account? <a href="/login">Login</a>
      </p>
      <div className="divider">
        <hr /> <span>OR</span> <hr />
      </div>
      <div className="social-login">
        {/* When clicked, the user is redirected to Google OAuth via the backend */}
        <button className="social-button google" onClick={handleGoogleLogin}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
          Continue with Google
        </button>
        <button className="social-button microsoft">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" alt="Microsoft Logo" />
          Continue with Microsoft
        </button>
        <button className="social-button apple">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default Register;

