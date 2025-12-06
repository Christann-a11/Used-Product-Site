import React from "react";
import AdsManagementComponent from "./AdsManagementComponent";

const AdminComponent = () => {
  return (
    <div className="mt-5 pt-4">
      <h2>Admin Dashboard</h2>
      <p>Manage your ads here.</p>
      <hr />
      <AdsManagementComponent />
    </div>
  );
};

export default AdminComponent;
