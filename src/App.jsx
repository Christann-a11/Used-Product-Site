import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/authentication/NavbarComponent';
import LoginComponent from './components/authentication/LoginComponent';
import RegisterComponent from './components/authentication/RegisterComponent';
import HomeComponent from './components/HomeComponent';
import NotFoundComponent from './components/NotFoundComponent';
import ManageAdsPage from "./components/ads/ManageAdsPage";


function App() {
  return (
    <Router>
      {/* The Navbar is now here, so it will appear on every page */}
      <NavbarComponent />
      <main className="container mt-4">
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="*" element={<NotFoundComponent />} />
            <Route path="/my-ads" element={<ProtectedRoute> <ManageAdsPage /> </ProtectedRoute> }
/>
          </Routes>
      </main>
    </Router>
  );
}

export default App;