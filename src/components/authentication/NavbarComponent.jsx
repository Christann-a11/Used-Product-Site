import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthentication } from '../../Controllers/UseAuthentication';

const NavbarComponent = () => {
  const { isAuthenticated, logout } = useAuthentication();
  const handleLogout = () => {
    logout();
    // Implement your logout logic here
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          ProductSell
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/ads">Ads</Link>
            </li>
           {isAuthenticated() ? (<li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </li>) : (
             <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
           )} 

            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default NavbarComponent;
