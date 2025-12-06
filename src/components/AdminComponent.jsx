import React from 'react';
import AdsManagementComponent from './AdsManagementComponent';

const AdminComponent = () => {
  return (
    <div className="mt-5 pt-4">
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin area. You can manage users and site content here.</p>
      <hr />
     <center><AdsManagementComponent /></center>  
    </div>
  );
};

export default AdminComponent;