import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../assets/styles/signupOAuthForm.css';  // OAuth-specific styling

const SignUpOAuth = () => {
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(message);
    }
  }, [searchParams]);

  const redirectToGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/signup`;
  };

  const redirectToMicrosoftSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/microsoft/signup`;
  };

  const redirectToAppleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/apple/signup`;
  };

  return (
    <div className="register-container">
      <h1>Create an Account</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <div className="divider">
        <hr /> <span>Sign up with</span> <hr />
      </div>
      
      <div className="social-login">
        <button className="social-button google" onClick={redirectToGoogleSignUp}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
          Continue with Google
        </button>

        <button className="social-button microsoft" onClick={redirectToMicrosoftSignUp}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" alt="Microsoft Logo" />
          Continue with Microsoft
        </button>

        <button className="social-button apple" onClick={redirectToAppleSignUp}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default SignUpOAuth;

