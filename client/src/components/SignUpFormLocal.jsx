import React, { useState } from 'react';
import InputField from './InputField';
import FormInput from './FormInput';
import { registerUser, checkEmailAvailability, checkUsernameAvailability } from '../services/authServices';
import { validateField } from '../services/validationHelper';
import { useNavigate } from 'react-router-dom';
import ErrorDisplay from './ErrorDisplay'; // Import the ErrorDisplay component
import '../assets/styles/signupLocalForm.css';
import { useDispatch } from 'react-redux';
import axiosWithHeader from '../services/axios'


const SignUpForm = () => {
  const dispatch = useDispatch()
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

  // Error and Success Messages
  const [errorMessages, setErrorMessages] = useState([]); // List of general error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success message
  const [errors, setErrors] = useState([]); // Validation errors from the API

  const navigate = useNavigate();

  // Clear the error message on input change for username
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError('');  // Clear error when user types
    setUsernameStatus(null); // Reset status when user types
  };

  // Clear the error message on input change for email
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');  // Clear error when user types
    setEmailStatus(null); // Reset status when user types
  };

  // Handle validation for email on blur
  const handleEmailBlur = () =>
    validateField('email', email, setEmailLoading, setEmailStatus, setEmailError, checkEmailAvailability);

  // Handle validation for username on blur
  const handleUsernameBlur = () =>
    validateField('username', username, setUsernameLoading, setUsernameStatus, setUsernameError, checkUsernameAvailability);

  // Handle form submission
  const handleSignUp = async (e) => {
    
    e.preventDefault();
    console.log('Sign Up button clicked'); // Debug log

    // Check if the button is disabled
    if (loading || emailStatus === 'invalid' || usernameStatus === 'invalid' || !emailStatus || !usernameStatus) {
      console.log('Button is disabled, form submission prevented');
      return;
    }

    setLoading(true);
    setErrorMessages([]);  // Clear previous error messages
    setSuccessMessage(''); // Clear previous success message

    console.log('Attempting to register user with:', { firstName, lastName, username, email, password }); // Debug log

    try {
      console.log('Calling registerUser function'); // Debug log
      const response = await registerUser({ firstName, lastName, username, email, password }, dispatch);
      
      localStorage.setItem('token', response.data.token);
      // Set the token as a default header for future requests
      axiosWithHeader.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log('Received response:', response); // Debug log
      
      if (response.data.message === "User registered successfully.") {
        // Redirect to the success page on successful registration
        navigate('/signup/success'); // Redirect to AuthSuccess page
      } else {
        setErrorMessages(["An unexpected error occurred. Please try again."]);
      }
    } catch (err) {
      console.error('Error during registration:', err); // Debug log
      if (err.response && err.response.data && err.response.data.error) {
        const validationErrors = err.response.data.error.errors || [];
        setErrors(validationErrors); // Set validation errors from the server response
      } else if (err.request) {
        setErrorMessages(["No response received from server. Please try again."]);
      } else {
        setErrorMessages([`Error: ${err.message}`]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Create an Account</h1>

      {/* Display success message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Display general error messages */}
      {errorMessages.length > 0 && (
        <div className="error-messages">
          {errorMessages.map((message, index) => (
            <p key={index} className="error-message">{message}</p>
          ))}
        </div>
      )}

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

        {/* Display validation errors */}
        <ErrorDisplay errors={errors} />

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

