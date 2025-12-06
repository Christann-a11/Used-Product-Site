import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuthentication } from "../../Controllers/UseAuthentication";

const NavbarComponent = () => {
  const { isAuthenticated, logout } = useAuthentication();

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // force re-render and redirect
  };

  return (
    <nav className="navbar navbar-expand-lg market-navbar fixed-top">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand market-logo" to="/">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">ProductSell</span>
        </Link>

        <button
          className="navbar-toggler market-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#marketNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="marketNavbar">

          {/* Search */}
          <form className="market-search ms-lg-3 me-lg-3 my-3 my-lg-0">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              className="form-control market-search-input"
              placeholder="Search listings"
            />
          </form>

          {/* Nav section */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <li className="nav-item">
              <NavLink to="/ads" className="nav-link market-nav-link">
                Browse Ads
              </NavLink>
            </li>

            {/* Manage Listings - only for logged in users */}
            {isAuthenticated() && (
              <li className="nav-item d-none d-lg-block">
                <NavLink to="/admin" className="btn btn-sm market-btn-primary">
                  Manage Listings
                </NavLink>
              </li>
            )}

            {/* Not logged in → Show Login / Signup */}
            {!isAuthenticated() && (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link market-nav-link">
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-sm market-btn-accent">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}

            {/* Logged in → Show Logout */}
            {isAuthenticated() && (
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-sm market-btn-secondary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}

            <li className="nav-item d-none d-lg-flex align-items-center ms-1">
              <span className="profile-circle">👤</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
