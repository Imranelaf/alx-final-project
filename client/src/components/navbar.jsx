import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/styles/navbar.css'

export default function Navbar() {
  return (
    <>
      <nav className='container'>
        <div className='logo'>propertyHUB</div>
        <div>
          <NavLink className='link' to="/">Home</NavLink>
          <NavLink className='link' to="/properties">Properties</NavLink>
          <NavLink className='link' to="/faq">FAQ</NavLink> {/* Updated from 'About' to 'FAQ' */}
          <NavLink className='link' to="/signin">Sign In</NavLink> {/* Fixed "Sing In" to "Sign In" */}
        </div>
      </nav>
    </>
  );
};

