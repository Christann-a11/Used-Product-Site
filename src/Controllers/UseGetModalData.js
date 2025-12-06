// src/Controllers/UseGetModalData.js
import { useState, useEffect } from "react";
import { getModelName } from "./utils/getModelName";

export const useGetModalData = (modelClass) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const modelName = getModelName(modelClass);
  const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // FIXED: Correct class reference
        const transformed = Array.isArray(result)
          ? result.map((item) => modelClass.constructor.fromJSON(item))
          : [modelClass.constructor.fromJSON(result)];

        // Remove null entries caused by conversion errors
        setData(transformed.filter((x) => x !== null));
      } catch (err) {
        console.error("Error fetching modal data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
