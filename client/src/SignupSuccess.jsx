import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Success icon
import '../assets/styles/signupSuccess.css';

const SignupSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the homepage after 2 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container">
      <div className="success-icon">
        <FaCheckCircle className="icon" />  {/* Success icon */}
      </div>
      <h1 className="success-title">Signup Successful!</h1>
      <p className="redirect-message">Redirecting to the homepage...</p>
    </div>
  );
};

export default SignupSuccess;

