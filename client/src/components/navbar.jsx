import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import '../assets/styles/navbar.css';
import { FaBars, FaTimes, FaUser, FaGlobe, FaQuestionCircle } from 'react-icons/fa';  // Added FaQuestionCircle

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  return (
    <header className="navbar">
      {/* Hamburger & FAQ Icon */}
      <div className="hamburger-menu">
        {isMobileMenuOpen ? (
          <FaTimes onClick={toggleMobileMenu} className="icon" />
        ) : (
          <>
            <FaBars onClick={toggleMobileMenu} className="icon" />
            <FaQuestionCircle onClick={() => navigate('/faq')} className="icon faq-icon" /> {/* FAQ Icon */}
          </>
        )}
      </div>

      {/* Center Logo */}
      <div className="logo">propertyHUB</div>

      {/* Right-side Icons */}
      <div className="right-icons">
        {isLanguageMenuOpen ? (
          <FaTimes onClick={toggleLanguageMenu} className="icon" /> // Close button for language menu
        ) : (
          <FaGlobe onClick={toggleLanguageMenu} className="icon" /> // Language Icon
        )}
        <FaUser onClick={toggleProfileMenu} className="icon profile-icon" /> {/* Profile Icon */}
      </div>

      {/* Mobile Menu - Buy, Rent, Sell, Agents */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/buy" className="menu-link" onClick={toggleMobileMenu}>Buy</NavLink>
          <NavLink to="/rent" className="menu-link" onClick={toggleMobileMenu}>Rent</NavLink>
          <NavLink to="/sell" className="menu-link" onClick={toggleMobileMenu}>Sell</NavLink>
          <NavLink to="/agents" className="menu-link" onClick={toggleMobileMenu}>Agents</NavLink>
        </div>
      )}

      {/* Profile Menu - Sign In & Sign Up */}
      {isProfileMenuOpen && (
        <div className="profile-menu">
          <button onClick={() => navigate('/signin')} className="profile-button">Sign In</button>
          <button onClick={() => navigate('/signup')} className="profile-button">Sign Up</button>
        </div>
      )}

      {/* Language Menu */}
      {isLanguageMenuOpen && (
        <div className="language-menu">
          <div className="language-option">
            <Flag code="US" className="flag-icon" /> <span>English</span>
          </div>
          <div className="language-option">
            <Flag code="MA" className="flag-icon" /> <span>Arabic</span>
          </div>
          <div className="language-option">
            <Flag code="FR" className="flag-icon" /> <span>French</span>
          </div>
          <div className="language-option">
            <Flag code="ES" className="flag-icon" /> <span>Spanish</span>
          </div>
          <div className="language-option">
            <Flag code="DE" className="flag-icon" /> <span>German</span>
          </div>
          <div className="language-option">
            <Flag code="BR" className="flag-icon" /> <span>Portuguese</span>
          </div>
        </div>
      )}
    </header>
  );
}

