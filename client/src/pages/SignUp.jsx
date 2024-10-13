import React from 'react';
import Navbar from '../components/navbar';
import SignUpOAuth from '../components/SignUpOAuth';
import SignUpForm from '../components/SignUpFormLocal';

const SignUp = () => {
  return (
    <>
      <Navbar />
      <div className="signup-page-container">
        
        {/* Local Email/Password Sign-Up Section */}
        <SignUpForm />

        {/* Divider between Local and OAuth sign-up form */}
        <div className="divider">
          <hr />
          <span>Or sign up with</span>
          <hr />
        </div>

        {/* OAuth Sign-Up Section */}
        <SignUpOAuth />

      </div>
    </>
  );
};

export default SignUp;

