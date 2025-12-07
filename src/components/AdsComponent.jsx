import React, { useState } from "react";
import Ads from "../modal/Ads";
import { useGetModalData } from "../Controllers/UseGetModalData";
import { askQuestion, getQuestions, answerQuestion } from "../api/questions";

const AdsComponent = () => {
  const { data: ads, loading, error } = useGetModalData(new Ads());
  const [selectedAd, setSelectedAd] = useState(null);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);

  // Load all Q&A for an ad
  const loadQuestions = async (adId) => {
    try {
      const data = await getQuestions(adId);
      setQuestions(data);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  const handleAskQuestion = (ad) => {
    setSelectedAd(ad);
    loadQuestions(ad._id || ad.id);
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await askQuestion(selectedAd._id || selectedAd.id, question);
      alert("Question sent!");
      setQuestion("");
      loadQuestions(selectedAd._id || selectedAd.id);
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedAd(null);
    setQuestion("");
    setQuestions([]);
  };

  const handleAnswer = async (e, qId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const answer = e.target.elements["answer"].value;

    try {
      await answerQuestion(qId, answer, token);
      alert("Answer posted!");

      loadQuestions(selectedAd._id || selectedAd.id);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading ads…</p>;
  if (error)
    return <p className="text-danger text-center">Error: {error.message}</p>;

  return (
    <div>
      <h1 className="market-hero-title">Marketplace</h1>
      <p className="market-hero-subtitle">
        Find used products and great deals.
      </p>

      <div className="row g-4">
        {ads.map((ad) => (
          <div className="col-12 col-sm-6 col-lg-4" key={ad.id || ad._id}>
            <div className="product-card">
              <div className="product-card-body">
                <div
                  style={{
                    height: "170px",
                    background: "#e5e7eb",
                    borderRadius: "12px",
                    marginBottom: "1rem",
                  }}
                ></div>

                <h2 className="product-title">{ad.title}</h2>
                <p>{ad.description}</p>
                <p className="product-price">${ad.price}</p>
              </div>

              <div className="product-card-footer">
                <button
                  onClick={() => handleAskQuestion(ad)}
                  className="btn btn-sm product-btn-view"
                >
                  View details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedAd && (
        <>
          {/* 1. Backdrop is now a sibling, sitting "behind" the modal */}
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseModal}
          ></div>

          {/* 2. Modal Container */}
          <div
            className="modal fade show"
            style={{ display: "block" }}
            // Optional: Close if clicking the empty space around the dialog
            onClick={handleCloseModal}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              // Prevent closing when clicking INSIDE the modal
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedAd.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* ... content (Price, Description, Questions) ... */}
                  <p>
                    <strong>Price:</strong> ${selectedAd.price}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedAd.description}
                  </p>
                  <hr />

                  {/* Show Questions */}
                  <h6>Questions</h6>
                  {questions.length === 0 && <p>No questions yet.</p>}

                  {questions.map((q) => (
                    <div key={q._id} className="border p-2 rounded mb-2">
                      <strong>Q:</strong> {q.text}
                      {q.answer ? (
                        <p className="text-success">
                          <strong>A:</strong> {q.answer}
                        </p>
                      ) : (
                        // Only ad owner can answer`
                        selectedAd.owner === localStorage.getItem("userId") && (
                          <form
                            onSubmit={(e) => handleAnswer(e, q._id)}
                            className="mt-2"
                          >
                            <input
                              name="answer"
                              className="form-control mb-2"
                              placeholder="Type your answer..."
                            />
                            <button className="btn btn-primary btn-sm">
                              Submit Answer
                            </button>
                          </form>
                        )
                      )}
                    </div>
                  ))}

                  <hr />

                  {/* Ask new question */}
                  <form onSubmit={handleSendQuestion}>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Ask a question…"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    ></textarea>

                    <button className="btn btn-primary mt-2 w-100">
                      Send Question
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdsComponent;
