import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarComponent from '../authentication/NavbarComponent';

const RouotLayout = () => {
    return (
        <>
              {/* The Navbar is now here, so it will appear on every page */}
      <NavbarComponent />
       <main className="container mt-5 pt-3">
        <Outlet />  {/* Renders the matched child route inside the container */}
       </main>
      
        </>
    );
};

export default RouotLayout;

 