import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/routes/RootLayout';
import HomeComponent from './components/HomeComponent';
import LoginComponent from './components/authentication/LoginComponent';
import RegisterComponent from './components/authentication/RegisterComponent';
import NotFoundComponent from './components/NotFoundComponent';
import AdsComponent from './components/AdsComponent';
import AdminComponent from './components/AdminComponent';
//import './index.css'
 import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';






 const routes = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomeComponent /> },
        {path: "/ads", element: <AdsComponent />},
        {path: "/login", element: <LoginComponent/>},
        {path: "/register", element: <RegisterComponent/>},
        {path: "/admin", element: <AdminComponent />},
        {path: "*", element:  <NotFoundComponent/>},
      ]
    }
  ]);
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
) 
