import React from 'react';

import logo from '../assets/logo.png';  // Import logo from assets folder

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="/home">  {/* Replace "/home" with the correct URL */}
          <img src={logo} alt="Octawiz Logo" className="navbar-logo" />
        </a>

        {/* Book a Call Button */}
        <button className="btn btn-outline-light ms-auto navbar-book-btn">
          Book a Call
        </button>
      </div>
    </nav>
  );
}


