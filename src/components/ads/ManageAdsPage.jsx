import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  activationDate: "",
  expirationDate: "",
};

const ManageAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const loadMyAds = async () => {
    const res = await fetch(`${API_BASE}/api/ads`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allAds = await res.json();
    const mine = allAds.filter((ad) => ad.owner === userId);

    setAds(mine);
  };

  useEffect(() => {
    loadMyAds();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = { ...form, price: Number(form.price) };

    const url = editingId
      ? `${API_BASE}/api/ads/${editingId}`
      : `${API_BASE}/api/ads`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    setEditingId(null);
    setForm(emptyForm);
    loadMyAds();
  };

  const disableAd = async (id) => {
    await fetch(`${API_BASE}/api/ads/${id}/disable`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status: "inactive" }),
    });

    loadMyAds();
  };

  return (
    <section className="two-column-layout">
      <div className="panel">
        <h3>{editingId ? "Edit Ad" : "Create Ad"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            className="input"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            className="input"
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <button className="btn btn-primary" type="submit">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>My Listings</h3>

        {ads.map((ad) => (
          <div key={ad._id} className="my-ads-item">
            <div>
              <div className="my-ads-title">{ad.title}</div>
              <div className="my-ads-meta">${ad.price}</div>
            </div>

            <div className="my-ads-actions">
              <button
                className="btn btn-primary btn-small"
                onClick={() => {
                  setEditingId(ad._id);
                  setForm(ad);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-secondary btn-small"
                onClick={() => disableAd(ad._id)}
              >
                Disable
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManageAdsPage;
