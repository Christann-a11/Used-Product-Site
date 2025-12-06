import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import RootLayout from "./components/routes/RootLayout";
import HomeComponent from "./components/HomeComponent";
import LoginComponent from "./components/authentication/LoginComponent";
import RegisterComponent from "./components/authentication/RegisterComponent";
import NotFoundComponent from "./components/NotFoundComponent";
import AdsComponent from "./components/AdsComponent";
import AdminComponent from "./components/AdminComponent";

import { useAuthentication } from "./Controllers/UseAuthentication";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Wrapper for routes that must be logged in (CRUD pages)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthentication();
  const authed = isAuthenticated();

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomeComponent /> },
      { path: "ads", element: <AdsComponent /> },
      { path: "login", element: <LoginComponent /> },
      { path: "register", element: <RegisterComponent /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminComponent />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
