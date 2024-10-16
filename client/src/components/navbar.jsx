import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import '../assets/styles/navbar.css';
import { FaBars, FaTimes, FaUser, FaGlobe, FaQuestionCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { SignOut } from '../services/authServices';

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  
  const [toggle, setToggle] = useState({
    isMobileMenuOpen: false,
    isProfileMenuOpen: false,
    isLanguageMenuOpen: false,
    isProfileOpen: false
  });

  const navigate = useNavigate();

  const handleToggle = (menu) => {
    setToggle((prevState) => ({
      isMobileMenuOpen: menu === 'mobile' ? !prevState.isMobileMenuOpen : false,
      isProfileMenuOpen: menu === 'profile' ? !prevState.isProfileMenuOpen : false,
      isLanguageMenuOpen: menu === 'language' ? !prevState.isLanguageMenuOpen : false,
      isProfileOpen: menu === 'profileLogged' ? !prevState.isProfileOpen : false,
    }));
  };

  return (
    <header className="navbar">
      {/* Hamburger & FAQ Icon */}
      <div className="hamburger-menu">
        {toggle.isMobileMenuOpen ? (
          <FaTimes onClick={() => handleToggle('mobile')} className="icon" />
        ) : (
          <>
            <FaBars onClick={() => handleToggle('mobile')} className="icon" />
            <FaQuestionCircle onClick={() => navigate('/faq')} className="icon faq-icon" /> {/* FAQ Icon */}
          </>
        )}
      </div>

      {/* Center Logo */}
      <div className="logo">
        <NavLink to="/">
          <img 
            src="https://i.ibb.co/mv6JJbL/Property-Hub-Logo-White.png" 
            alt="PropertyHub Logo" 
            className="logo-img"
          />
        </NavLink>
      </div>

      {/* Right-side Icons */}
      <div className="right-icons">
        {toggle.isLanguageMenuOpen ? (
          <FaTimes onClick={() => handleToggle('language')} className="icon" />
        ) : (
          <FaGlobe onClick={() => handleToggle('language')} className="icon" />
        )}
        {currentUser ? (
          <div className="name-text profile-icon" onClick={() => handleToggle('profileLogged')}>
            {currentUser.username}
          </div>
        ) : (
          <FaUser onClick={() => handleToggle('profile')} className="icon profile-icon" />
        )}
      </div>

      {/* Mobile Menu - Buy, Rent, Sell, Agents */}
      {toggle.isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/buy" className="menu-link" onClick={() => handleToggle('mobile')}>Buy</NavLink>
          <NavLink to="/rent" className="menu-link" onClick={() => handleToggle('mobile')}>Rent</NavLink>
          <NavLink to="/sell" className="menu-link" onClick={() => handleToggle('mobile')}>Sell</NavLink>
          <NavLink to="/agents" className="menu-link" onClick={() => handleToggle('mobile')}>Agents</NavLink>
        </div>
      )}

      {/* Profile Menu - Sign In & Sign Up */}
      {toggle.isProfileMenuOpen && (
        <div className="profile-menu">
          <button onClick={() => navigate('/signin')} className="profile-button">Sign In</button>
          <button onClick={() => navigate('/signup')} className="profile-button">Sign Up</button>
        </div>
      )}

      {/* Logged-in Profile Menu */}
      {toggle.isProfileOpen && (
        <div className="profile-menu">
          <button onClick={() => navigate('/profile')} className="profile-button">Profile</button>
          <button onClick={() => SignOut()} className="profile-button">Sign Out</button>
        </div>
      )}

      {/* Language Menu */}
      {toggle.isLanguageMenuOpen && (
        <div className="language-menu">
          <div className="language-option">
            <Flag code="US" className="flag-icon" /> <span>English</span>
          </div>
          <div className="language-option">
            <Flag code="MA" className="flag-icon" /> <span>العربية</span>
          </div>
          <div className="language-option">
            <Flag code="FR" className="flag-icon" /> <span>Français</span>
          </div>
          <div className="language-option">
            <Flag code="ES" className="flag-icon" /> <span>Español</span>
          </div>
          <div className="language-option">
            <Flag code="DE" className="flag-icon" /> <span>Deutsch</span>
          </div>
          <div className="language-option">
            <Flag code="BR" className="flag-icon" /> <span>Português</span>
          </div>
        </div>
      )}
    </header>
  );
}