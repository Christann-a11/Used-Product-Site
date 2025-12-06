// src/main.jsx is your entry point.
// src/App.jsx should look like this:

import React from "react";
import { Routes, Route } from "react-router-dom";

import RootLayout from "./components/routes/RootLayout.jsx";

// Authentication
import LoginComponent from "./components/authentication/LoginComponent.jsx";
import RegisterComponent from "./components/authentication/RegisterComponent.jsx";
import NavbarComponent from "./components/authentication/NavbarComponent.jsx";

// Route Components
import HomeComponent from "./components/HomeComponent.jsx";
import AdsComponent from "./components/AdsComponent.jsx";
import AdminComponent from "./components/AdminComponent.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import NotFoundComponent from "./components/NotFoundComponent.jsx";

const App = () => {
  return (
    <>
      <NavbarComponent />

      <div className="container mt-5 pt-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeComponent />} />
          <Route path="/ads" element={<AdsComponent />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />

          {/* Protected Routes */}
          <Route path="/admin" element={<AdminComponent />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Catch-All */}
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
