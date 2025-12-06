import React, { useEffect, useState } from "react";
import { API_BASE } from "../config.js";
import { useAuthentication } from "../Controllers/UseAuthentication";

const ProfilePage = () => {
  const { isAuthenticated } = useAuthentication();
  const authed = isAuthenticated();

  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authed) return;

    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          username: data.username,
          email: data.email,
        });
      });
  }, [authed]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    const data = await res.json();

    setMessage("Profile Updated!");
  };

  if (!authed) return <p>You must log in to view this page.</p>;

  return (
    <div className="container mt-5">
      <h2>My Profile</h2>

      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
