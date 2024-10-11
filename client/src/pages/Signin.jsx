import React from 'react';
import '../assets/styles/signin.css'; // Ensure the correct path to the styles

const Login = () => {
  return (
    <div className="login-container">
      <h1>Welcome back</h1>
      <form>
        <input type="email" placeholder="Email address*" required className="input-email" />
        <button type="submit" className="continue-button">Continue</button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/register">Sign Up</a>
      </p>
      <div className="divider">
        <hr /> <span>OR</span> <hr />
      </div>
      <div className="social-login">
        <button className="social-button google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
          Continue with Google
        </button>
        <button className="social-button microsoft">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" alt="Microsoft Logo" />
          Continue with Microsoft Account
        </button>
        <button className="social-button apple">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Logo" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default Login;

