import { useState } from 'react';
import { getModelName } from './utils/getModelName';

export const useDeleteModalData = (modal) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteData = async (id) => {
    if (!id) {
      setError(new Error("An ID must be provided to delete an item."));
      return;
    }

    const modelName = getModelName(modal);
    const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}/${id}`;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authorized, no token');
      }
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      setSuccess(true);
    } catch (err) {
      setError(err);
      console.error("Error deleting modal data:", err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error, success };
};
