import { useState } from "react";
import { getModelName } from "./utils/getModelName";

export const useUpdateModalData = (modalInstance) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (itemToUpdate) => {
    if (!itemToUpdate.id) {
      const err = new Error("Item to update must have an ID.");
      setError(err);
      throw err;
    }

    const modelName = getModelName(modalInstance);
    const url = `https://used-products-selling-site-backend-api.onrender.com/api/${modelName}/${itemToUpdate.id}`;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const payload =
        typeof itemToUpdate.toJSON === "function"
          ? itemToUpdate.toJSON()
          : itemToUpdate;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let backendMessage = `Server error: ${response.status}`;
        try {
          const json = await response.json();
          if (json?.message) backendMessage = json.message;
        } catch {}
        throw new Error(backendMessage);
      }

      const result = await response.json();

      // Use the constructor class (not the instance!)
      const ModelClass = modalInstance.constructor;
      const updatedItem = ModelClass.fromJSON(result);

      setData(updatedItem);
      return updatedItem;
    } catch (err) {
      console.error("Error updating modal data:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateData, data, loading, error };
};
