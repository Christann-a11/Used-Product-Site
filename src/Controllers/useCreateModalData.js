import { useState } from "react";
import { getModelName } from "./utils/getModelName";

export const useCreateModalData = (modalInstance) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);

    const modelName = getModelName(modalInstance);

    if (!modelName) {
      const err = new Error("Invalid model configuration.");
      setError(err);
      throw err;
    }

    const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}`;

    // Force usage of toJSON() to include expirationDate + userId
    const payload =
      typeof data?.toJSON === "function" ? data.toJSON() : data;

    console.log(`POST → ${url}`);
    console.log("Payload:", payload);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      // Read backend error if request fails
      if (!res.ok) {
        let message = `Server error: ${res.status}`;

        try {
          const errJson = await res.json();
          if (errJson?.message) message = errJson.message;
        } catch (err) {}

        throw new Error(message);
      }

      // Successful response: return created object
      return await res.json();
    } catch (err) {
      console.error("Create request error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export default useCreateModalData;
