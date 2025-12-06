import { useState } from 'react';
import { getModelName } from './utils/getModelName';

const useCreateModalData = (modal) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const create = async (data) => {
    setLoading(true);
    setError(null);

    const modelName = getModelName(modal);
    if (!modelName) {
      const errorMsg = 'Modal or modal name is not defined.';
      console.error(errorMsg);
      setError(new Error('Registration failed: Invalid configuration.'));
      setLoading(false);
      throw new Error(errorMsg);
    }

    const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}`;
    const payload = typeof data?.toJSON === 'function' ? data.toJSON() : data;

    console.log(`Creating modal data for ${modelName} at: ${url}`);
    console.log(`Input data:${JSON.stringify(payload)}`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) {
            errorMsg = errorBody.message;
          }
        } catch (parseErr) {
          console.warn('Failed to parse error response:', parseErr);
        }
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export { useCreateModalData };
export default useCreateModalData;
