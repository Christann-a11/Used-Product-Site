import React, { useState } from "react";
import { Link } from "react-router-dom";
import Ads from "../modal/Ads";
import { useGetModalData } from "../Controllers/UseGetModalData";

const AdsComponent = () => {
  const { data: ads, loading, error } = useGetModalData(new Ads());
  const [selectedAd, setSelectedAd] = useState(null);
  const [question, setQuestion] = useState("");

  const handleAskQuestion = (ad) => setSelectedAd(ad);

  const handleCloseModal = () => {
    setSelectedAd(null);
    setQuestion("");
  };

  const handleSendQuestion = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    alert(`Your question about "${selectedAd.title}" has been sent!`);
    handleCloseModal();
  };

  // ---------------------------
  //  LOADING & ERROR STATES
  // ---------------------------
  if (loading) {
    return <p className="text-center mt-5">Loading ads…</p>;
  }

  if (error) {
    return (
      <p className="text-center text-danger mt-5">
        Error loading ads: {error.message}
      </p>
    );
  }

  return (
    <div>
      <div className="market-hero">
        <h1 className="market-hero-title">Marketplace</h1>
        <p className="market-hero-subtitle">
          Browse used items from other users. Find great deals on things you
          actually need.
        </p>
      </div>

      {/* If no ads exist ---------------------------- */}
      {ads.length === 0 && (
        <div className="text-center mt-5">
          <h4>No ads found</h4>
          <p>Be the first to post something for sale!</p>

          <Link to="/admin" className="btn market-btn-primary">
            Create Your First Ad
          </Link>
        </div>
      )}

      {/* Ads Grid ---------------------------------- */}
      <div className="row g-4">
        {ads.map((ad) => (
          <div className="col-12 col-sm-6 col-lg-4" key={ad.id}>
            <div className="product-card">
              <div className="product-card-body">
                {/* Placeholder image */}
                <div
                  style={{
                    background: "#e5e7eb",
                    borderRadius: "14px",
                    height: "170px",
                    marginBottom: "0.8rem",
                  }}
                />

                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h2 className="product-title mb-0">{ad.title}</h2>
                </div>

                <p className="product-meta mb-2">{ad.description}</p>
                <p className="product-price mb-0">${ad.price}</p>
              </div>

              <div className="product-card-footer">
                <button
                  className="btn btn-sm product-btn-view"
                  onClick={() => handleAskQuestion(ad)}
                >
                  View details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal ------------------------------------ */}
      {selectedAd && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseModal}
          ></div>

          <div
            className="modal-dialog modal-dialog-centered"
            style={{ zIndex: 1060 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Ask a question about: {selectedAd.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                />
              </div>

              <form onSubmit={handleSendQuestion}>
                <div className="modal-body">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Type your question…"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  ></textarea>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>

                  <button type="submit" className="btn market-btn-primary">
                    Send Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsComponent;
