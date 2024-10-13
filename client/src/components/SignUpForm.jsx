import React, { useState } from 'react';
import InputField from './InputField';
import FormInput from './FormInput';
import { registerUser, checkEmailAvailability, checkUsernameAvailability } from '../services/authServices';
import { validateField } from '../services/validationHelper'; // Validation helper
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signupForm.css';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Email state
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // 'valid', 'invalid', or 'error'
  const [emailError, setEmailError] = useState('');

  // Username state
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'valid', 'invalid', or 'error'
  const [usernameError, setUsernameError] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Clear the error message on input change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError('');  // Clear error when user types
    setUsernameStatus(null); // Reset status when user types
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');  // Clear error when user types
    setEmailStatus(null); // Reset status when user types
  };

  // Handle validation for email
  const handleEmailBlur = () =>
    validateField('email', email, setEmailLoading, setEmailStatus, setEmailError, checkEmailAvailability);

  // Handle validation for username
  const handleUsernameBlur = () =>
    validateField('username', username, setUsernameLoading, setUsernameStatus, setUsernameError, checkUsernameAvailability);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerUser({ firstName, lastName, username, email, password });
      if (response.data.success) {
        navigate('/verify-email');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
      if (errorMessage === 'User already exists, please sign in') {
        navigate(`/signin?message=${encodeURIComponent(errorMessage)}`);
      } else {
        setErrorMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Create an Account</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSignUp}>
        <div className="name-fields">
          <FormInput
            type="text"
            placeholder="First Name*"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="input-firstname"
          />
          <FormInput
            type="text"
            placeholder="Last Name*"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="input-lastname"
          />
        </div>

        {/* Username Input Field with validation */}
        <InputField
          type="text"
          placeholder="Username*"
          value={username}
          onChange={handleUsernameChange}  // Handle username change to clear errors
          onBlur={handleUsernameBlur}      // Trigger validation on blur
          status={usernameStatus}          // 'valid' or 'invalid'
          loading={usernameLoading}        // Show loading icon while checking
        />
        {/* Error message when username is invalid */}
        {!usernameLoading && usernameStatus === 'invalid' && (
          <p className="error-message">{usernameError}</p>  // Show only if username is invalid
        )}

        {/* Email Input Field with validation */}
        <InputField
          type="email"
          placeholder="Email Address*"
          value={email}
          onChange={handleEmailChange}     // Handle email change to clear errors
          onBlur={handleEmailBlur}         // Trigger validation on blur
          status={emailStatus}             // 'valid' or 'invalid'
          loading={emailLoading}           // Show loading icon while checking
        />
        {/* Error message when email is invalid */}
        {!emailLoading && emailStatus === 'invalid' && (
          <p className="error-message">{emailError}</p>  // Show only if email is invalid
        )}

        {/* Password Input */}
        <FormInput
          type="password"
          placeholder="Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="continue-button"
          disabled={loading || emailStatus === 'invalid' || usernameStatus === 'invalid' || !emailStatus || !usernameStatus}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;

