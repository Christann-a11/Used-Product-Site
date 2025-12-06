// src/components/forms/AdsForm.jsx
import React, { useEffect, useState } from "react";

const buildDefaultDates = () => {
  const today = new Date();
  const in30 = new Date(today);
  in30.setDate(today.getDate() + 30);

  return {
    activationDate: today.toISOString().slice(0, 10),
    expirationDate: in30.toISOString().slice(0, 10),
  };
};

const AdsForm = ({
  initialValues,
  mode = "create",
  isOpen,
  title = "Create Ad",
  onSubmit,
  onCancel,
}) => {
  const defaults = buildDefaultDates();

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    status: "active",
    activationDate: defaults.activationDate,
    expirationDate: defaults.expirationDate,
  });

  // When editing, populate fields (including dates)
  useEffect(() => {
    if (initialValues) {
      setFormValues({
        title: initialValues.title || "",
        description: initialValues.description || "",
        price: initialValues.price || "",
        status: initialValues.status || "active",
        activationDate: initialValues.activationDate
          ? initialValues.activationDate.slice(0, 10)
          : defaults.activationDate,
        expirationDate: initialValues.expirationDate
          ? initialValues.expirationDate.slice(0, 10)
          : defaults.expirationDate,
      });
    } else {
      setFormValues((prev) => ({
        ...prev,
        activationDate: defaults.activationDate,
        expirationDate: defaults.expirationDate,
      }));
    }
  }, [initialValues]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make sure expirationDate is present
    if (!formValues.expirationDate) {
      alert("Please choose an expiration date.");
      return;
    }

    const payload = {
      ...formValues,
      price: Number(formValues.price),
    };

    onSubmit(payload);
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <button type="button" className="btn-close" onClick={onCancel} />
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formValues.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Activation Date</label>
            <input
              type="date"
              className="form-control"
              name="activationDate"
              value={formValues.activationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Expiration Date</label>
            <input
              type="date"
              className="form-control"
              name="expirationDate"
              value={formValues.expirationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 d-flex justify-content-end gap-2 mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "edit" ? "Update Ad" : "Create Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdsForm;
