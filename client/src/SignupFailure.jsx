import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';  // Failure icon
import '../assets/styles/signupFailure.css';

const SignupFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract error message from the query params or provide a default message
  const errorMessage = searchParams.get('message') || 'Something went wrong. Please try again.';

  useEffect(() => {
    // Redirect to the signup page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/signup');
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="error-container">
      <div className="error-icon">
        <FaExclamationTriangle className="icon" /> {/* Failure icon */}
      </div>
      <h1 className="error-title">Signup Failed</h1>
      <p className="error-message">{errorMessage}</p>
      <p className="redirect-message">You will be redirected to the signup page shortly...</p>
    </div>
  );
};

export default SignupFailure;

