import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirecting
import '../assets/styles/signin.css';
import Navbar from '../components/navbar';

const googleOAuthSignIn = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initialize navigate for redirection

  // Handle Google OAuth login redirection
  const redirectToGoogleSignin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/signin`;
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Placeholder API call for email sign-in (replace with your API call)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email },
        { withCredentials: true }
      );

      // On successful sign-in, redirect to the success page
      if (response.data.success) {
        navigate('/signin/success');  // Redirect to SignIn Success page
      }
    } catch (err) {
      // Redirect to the failure page and pass the error message as a query param
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

        {/* Sign-in using email */}
        <form onSubmit={handleEmailSignIn}>
          <input
            type="email"
            placeholder="Email address*"
            required
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default googleOAuthSignIn;

