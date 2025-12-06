import { useState } from 'react';
import { getModelName } from './utils/getModelName';

export const useUpdateModalData = (modal) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (itemToUpdate) => {
    // The item to update must have an ID
    if (!itemToUpdate.id) {
      setError(new Error("Item to update must have an ID."));
      return;
    }

    const modelName = getModelName(modal);
    const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}/${itemToUpdate.id}`;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authorized, no token');
      }
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(itemToUpdate.toJSON()),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const updatedItem = modal.fromJSON(result);
      setData(updatedItem);
    } catch (err) {
      setError(err);
      console.error("Error updating modal data:", err);
    } finally {
      setLoading(false);
    }
  };

  return { updateData, data, loading, error };
};
