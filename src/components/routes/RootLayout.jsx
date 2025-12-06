import React from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "../authentication/NavbarComponent";

const RootLayout = () => {
  return (
    <>
      <NavbarComponent />
      <main className="app-main">
        <div className="container py-4">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default RootLayout;
