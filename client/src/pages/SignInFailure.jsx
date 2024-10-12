import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';  // Failure icon
import '../assets/styles/signupFailure.css';  // Using the same styles as signup failure

const SignInFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract error message from the query params or provide a default message
  const errorMessage = searchParams.get('message') || 'Failed to sign in. Please try again.';

  useEffect(() => {
    // Redirect to the signin page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="error-container">
      <div className="error-icon">
        <FaExclamationTriangle className="icon" /> {/* Failure icon */}
      </div>
      <h1 className="error-title">Sign In Failed</h1>
      <p className="error-message">{errorMessage}</p>
      <p className="redirect-message">You will be redirected to the sign-in page shortly...</p>
    </div>
  );
};

export default SignInFailure;

