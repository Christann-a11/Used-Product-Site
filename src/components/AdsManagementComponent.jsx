import React, { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { useAuthentication } from "../Controllers/UseAuthentication";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  title: "",
  description: "",
  price: "",
};

const AdsManagementComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();
  const authed = isAuthenticated();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!authed) navigate("/login");
  }, [authed, navigate]);

  if (!authed) return null;

  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadAds = async () => {
    const res = await fetch(`${API_BASE}/api/ads`, { headers });
    const allAds = await res.json();
    const mine = allAds.filter((ad) => ad.owner === userId);
    setAds(mine);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
    };

    const url = editingId
      ? `${API_BASE}/api/ads/${editingId}`
      : `${API_BASE}/api/ads`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (res.ok) {
      setMessage(editingId ? "Listing updated!" : "Listing created!");
      setForm(emptyForm);
      setEditingId(null);
      loadAds();
    } else {
      setMessage(result.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;

    await fetch(`${API_BASE}/api/ads/${id}`, {
      method: "DELETE",
      headers,
    });

    loadAds();
  };

  const handleDisable = async (id) => {
    await fetch(`${API_BASE}/api/ads/${id}/disable`, {
      method: "PUT",
      headers,
    });

    loadAds();
  };

  return (
    <div className="admin-page container">

      <h2 className="admin-title">Admin Dashboard</h2>
      <p className="admin-subtitle">Manage your ads here.</p>

      {/* CREATE LISTING CARD */}
      <div className="listing-card">
        <h3 className="section-title">Create New Listing</h3>

        {message && <div className="alert-message">{message}</div>}

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="input-group">
            <label>Title</label>
            <input
              className="styled-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter item title"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              className="styled-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item"
              required
            />
          </div>

          <div className="input-group">
            <label>Price ($)</label>
            <input
              type="number"
              className="styled-input"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />
          </div>

          <button className="create-btn" type="submit">
            {editingId ? "Update Listing" : "Create Listing"}
          </button>
        </form>
      </div>

      {/* MY LISTINGS */}
      <h3 className="section-title mt-4">My Listings</h3>

      <div className="listings-container">
        {ads.length === 0 && <p className="no-ads">You have no ads yet.</p>}

        {ads.map((ad) => (
          <div key={ad._id} className="listing-item-card">
            <div>
              <div className="listing-title">{ad.title}</div>
              <div className="listing-price">${ad.price}</div>
              <div className="listing-status">
                Status: <strong>{ad.status || "active"}</strong>
              </div>
            </div>

            <div className="listing-actions">
              <button
                className="btn-edit"
                onClick={() => {
                  setEditingId(ad._id);
                  setForm({
                    title: ad.title,
                    description: ad.description,
                    price: ad.price,
                  });
                }}
              >
                Edit
              </button>

              <button
                className="btn-disable"
                onClick={() => handleDisable(ad._id)}
              >
                Disable
              </button>

              <button
                className="btn-delete"
                onClick={() => handleDelete(ad._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdsManagementComponent;
