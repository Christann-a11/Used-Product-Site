import { useState } from "react";
import { getModelName } from "./utils/getModelName";

export const useDeleteModalData = (modalInstance) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteData = async (id) => {
    if (!id) {
      setError(new Error("An ID must be provided to delete an item."));
      return null;
    }

    const modelName = getModelName(modalInstance);
    const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}/${id}`;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        let backendError = "";
        try {
          const errJson = await response.json();
          backendError = errJson.message || "";
        } catch {}

        throw new Error(
          backendError || `Server error: ${response.status} ${response.statusText}`
        );
      }

      setSuccess(true);
      return id; // let UI know which ad was deleted

    } catch (err) {
      console.error("Error deleting modal data:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error, success };
};
