import React, { useState, useEffect } from 'react';


const defaultValues = {
  title: '',
  description: '',
  price: '',
  status: 'active',
};

const AdsForm = ({ initialValues = null, mode = 'create', onSubmit, onCancel, isOpen = false, title = 'Ad Form' }) => {
  const [formValues, setFormValues] = useState(() => ({
    ...defaultValues,
    ...(initialValues || {}),
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormValues({ ...defaultValues, ...initialValues });
    } else if (mode === 'create') {
      setFormValues({ ...defaultValues });
    }
  }, [initialValues, mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.title.trim()) newErrors.title = 'Title is required';
    if (!formValues.description.trim()) newErrors.description = 'Description is required';
    if (!formValues.price || Number(formValues.price) <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      ...formValues,
      price: Number(formValues.price),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onCancel}></button>
          </div>
          <form onSubmit={handleSubmit} className="text-start">
            <div className="modal-body text-start">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={formValues.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="col">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  value={formValues.description}
                  onChange={handleChange}
                  rows="3"
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    value={formValues.price}
                    onChange={handleChange}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formValues.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {mode === 'edit' ? 'Save Changes' : 'Create Ad'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdsForm;
