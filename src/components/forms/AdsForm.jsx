import React, { useEffect, useState } from "react";

const AdsForm = ({ initialValues, mode, isOpen, title, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    status: "active",
    expirationDate: "",
  });

  // Load values when editing
  useEffect(() => {
    if (initialValues) {
      setFormValues({
        title: initialValues.title || "",
        description: initialValues.description || "",
        price: initialValues.price || "",
        status: initialValues.status || "active",
        expirationDate: initialValues.expirationDate
          ? initialValues.expirationDate.substring(0, 10) // format yyyy-mm-dd
          : "",
      });
    }
  }, [initialValues]);

  // Handle input changes
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValues.expirationDate) {
      alert("Expiration date is required.");
      return;
    }

    onSubmit(formValues);
  };

  if (!isOpen) return null;

  return (
    <div className="card shadow p-3 mb-4">
      <h5 className="mb-3">{title}</h5>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formValues.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            rows="3"
            className="form-control"
            value={formValues.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formValues.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={formValues.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        {/* EXPIRATION DATE — REQUIRED BY BACKEND */}
        <div className="mb-3">
          <label className="form-label">Expiration Date</label>
          <input
            type="date"
            name="expirationDate"
            className="form-control"
            value={formValues.expirationDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit" className="btn btn-primary">
            {mode === "edit" ? "Update Ad" : "Create Ad"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdsForm;
