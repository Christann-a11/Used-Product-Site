import React, { useState, useEffect } from "react";
import Ads from "../modal/Ads";
import { useGetModalData } from "../Controllers/UseGetModalData";
import useCreateModalData from "../Controllers/useCreateModalData";
import { useUpdateModalData } from "../Controllers/useUpdateModalData";
import { useDeleteModalData } from "../Controllers/useDeleteModalData";
import AdsForm from "./forms/AdsForm";
import { useAuthentication } from "../Controllers/UseAuthentication";
import { useNavigate } from "react-router-dom";

const LoadingComponent = ({ message }) => <p>Loading {message}...</p>;
const ErrorComponent = ({ message, error }) => (
  <p>Error loading {message}: {error.message}</p>
);

const AdsManagementComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("You must be logged in to manage ads.");
      navigate("/login");
    }
  }, []);

  const { data: fetchedAds, loading: getLoading, error: getError } =
    useGetModalData(new Ads());
  const {
    create: createAdRequest,
    loading: createLoading,
    error: createError,
  } = useCreateModalData(new Ads());
  const {
    updateData,
    loading: updateLoading,
    error: updateError,
  } = useUpdateModalData(new Ads());
  const {
    deleteData,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteModalData(new Ads());

  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [activeAd, setActiveAd] = useState(null);

  // Load ads from backend
  useEffect(() => {
    if (fetchedAds) {
      setAds(fetchedAds);
      setFilteredAds(fetchedAds);
    }
  }, [fetchedAds]);

  const loading = getLoading || createLoading || updateLoading || deleteLoading;
  const error = getError || createError || updateError || deleteError;

  if (loading && !filteredAds.length) {
    return <LoadingComponent message="Ads" />;
  }

  if (error) {
    return <ErrorComponent message="Ads" error={error} />;
  }

  // Open create form
  const handleAdd = () => {
    setFormMode("create");
    setActiveAd(null);
    setIsFormVisible(true);
  };

  // Load ad into edit form
  const handleUpdate = (adId) => {
    const foundAd = ads.find((ad) => (ad.id || ad._id) === adId);
    if (!foundAd) return;

    setFormMode("edit");
    setActiveAd({
      id: foundAd.id || foundAd._id,
      title: foundAd.title,
      description: foundAd.description,
      price: foundAd.price,
      status: foundAd.status || "active",
      activationDate: foundAd.activationDate?.split("T")[0] || "",
      expirationDate: foundAd.expirationDate?.split("T")[0] || "",
    });

    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setActiveAd(null);
  };

  // Create or Update Ad
  const handleFormSubmit = async (formValues) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // FIXED: backend requires activationDate + expirationDate
    const buildAdModel = (id = null) =>
      new Ads(
        id,
        formValues.title,
        formValues.description,
        formValues.price,
        formValues.status,
        userId,
        formValues.activationDate,
        formValues.expirationDate
      );

    if (formMode === "edit" && activeAd) {
      const updated = buildAdModel(activeAd.id);
      await updateData(updated);

      // Update UI
      setAds((prev) =>
        prev.map((ad) =>
          (ad.id || ad._id) === activeAd.id
            ? { ...ad, ...formValues, id: activeAd.id }
            : ad
        )
      );

      setFilteredAds((prev) =>
        prev.map((ad) =>
          (ad.id || ad._id) === activeAd.id
            ? { ...ad, ...formValues, id: activeAd.id }
            : ad
        )
      );
    } else {
      // Create new ad
      const newAd = buildAdModel(null);
      const created = await createAdRequest(newAd);

      const normalized = Ads.fromJSON
        ? Ads.fromJSON(created)
        : {
            ...formValues,
            id: created?.id || created?._id,
          };

      setAds((prev) => [normalized, ...prev]);
      setFilteredAds((prev) => [normalized, ...prev]);
    }

    closeForm();
  };

  // Delete ad
  const handleDelete = async (adId) => {
    if (window.confirm(`Delete ad ${adId}?`)) {
      await deleteData(adId);

      setAds((prev) => prev.filter((ad) => (ad.id || ad._id) !== adId));
      setFilteredAds((prev) =>
        prev.filter((ad) => (ad.id || ad._id) !== adId)
      );

      if (activeAd && activeAd.id === adId) {
        closeForm();
      }
    }
  };

  // Disable / Enable ad (frontend only)
  const handleDisable = (adId) => {
    setAds((prev) =>
      prev.map((ad) =>
        (ad.id || ad._id) === adId
          ? { ...ad, status: ad.status === "active" ? "disabled" : "active" }
          : ad
      )
    );
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Manage Ads</h4>
        <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
          Add New Ad
        </button>
      </div>

      <AdsForm
        initialValues={activeAd || undefined}
        mode={formMode}
        isOpen={isFormVisible}
        title={formMode === "edit" ? "Update Ad" : "Create Ad"}
        onSubmit={handleFormSubmit}
        onCancel={closeForm}
      />

      <div className="table-responsive mt-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ width: "230px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAds.map((ad, index) => {
              const id = ad.id || ad._id || index;

              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{ad.title}</td>
                  <td>{ad.description}</td>
                  <td>${ad.price}</td>

                  <td>
                    <span
                      className={`badge bg-${
                        ad.status === "active" ? "success" : "secondary"
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-info me-1"
                      onClick={() => handleUpdate(id)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-sm btn-danger me-1"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleDisable(id)}
                    >
                      {ad.status === "active" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdsManagementComponent;
