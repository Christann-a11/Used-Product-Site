// src/components/AdsManagementComponent.jsx
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

  // 🔐 Protect page
  useEffect(() => {
    if (!authed) {
      navigate("/login");
    }
  }, [authed, navigate]);

  if (!authed) return null;

  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 🔥 LOAD ALL ADS FROM BACKEND
  const loadAds = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/ads`, { headers });

      if (!res.ok) {
        throw new Error(`Failed to load ads: ${res.status} ${res.statusText}`);
      }

      const allAds = await res.json();
      // ✅ SHOW ALL ADS (no owner filtering so you can SEE what you create)
      setAds(allAds);
    } catch (err) {
      console.error("Error loading ads:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Load once when authed
  useEffect(() => {
    if (authed) {
      loadAds();
    }
  }, [authed]);

  // ✏️ Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ CREATE or UPDATE AD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      // backend will handle owner & status (default active)
    };

    const url = editingId
      ? `${API_BASE}/api/ads/${editingId}`
      : `${API_BASE}/api/ads`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to save ad (${res.status})`);
      }

      // reload list from backend so you SEE your new / updated ad
      await loadAds();
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving ad:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE AD
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ad?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/ads/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to delete ad (${res.status})`);
      }

      await loadAds();
    } catch (err) {
      console.error("Error deleting ad:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 🚫 DISABLE AD (uses /api/ads/:id/disable from backend)
  const handleDisable = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/ads/${id}/disable`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: "inactive" }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed to disable ad (${res.status})`);
      }

      await loadAds();
    } catch (err) {
      console.error("Error disabling ad:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="two-column-layout mt-4">
      {/* LEFT PANEL — CREATE / EDIT FORM */}
      <div className="panel">
        <h3>{editingId ? "Edit Listing" : "Create Listing"}</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="input"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Listing"
              : "Create Listing"}
          </button>
        </form>
      </div>

      {/* RIGHT PANEL — ALL ADS (READ, EDIT, DISABLE, DELETE) */}
      <div className="panel">
        <h3>My Listings</h3>

        {loading && ads.length === 0 && <p>Loading ads…</p>}

        {!loading && ads.length === 0 && <p>No ads found yet.</p>}

        {ads.map((ad) => (
          <div key={ad._id} className="my-ads-item">
            <div>
              <div className="my-ads-title">{ad.title}</div>
              <div className="my-ads-meta">${ad.price}</div>
              <div className="my-ads-meta">
                Status: {ad.status || "active"}
              </div>
            </div>

            <div className="my-ads-actions">
              <button
                className="btn btn-primary btn-small"
                onClick={() => {
                  setEditingId(ad._id);
                  setForm({
                    title: ad.title || "",
                    description: ad.description || "",
                    price: ad.price || "",
                  });
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-warning btn-small"
                onClick={() => handleDisable(ad._id)}
              >
                Disable
              </button>

              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(ad._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdsManagementComponent;
