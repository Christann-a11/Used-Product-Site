import { useState, useEffect } from 'react';
import { getModelName } from './utils/getModelName';

export const useGetModalData = (modalInstance) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modelName = getModelName(modalInstance);
  const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        // Use the class, not the instance
        const ModelClass = modalInstance.constructor;
        const transformed = result.map((item) => ModelClass.fromJSON(item));

        setData(transformed);

      } catch (err) {
        console.error("Error fetching model data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
