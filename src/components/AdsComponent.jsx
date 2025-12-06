import React, { useState } from 'react';
import { useGetModalData } from '../Controllers/UseGetModalData';
import Ads from '../modal/Ads';

// Sample ad data
const sampleAds = [
    { id: 1, title: 'Vintage Bicycle', description: 'A classic 10-speed bike from the 80s.', price: 150 },
    { id: 2, title: 'Used Textbook', description: 'Intro to Computer Science, 2nd Edition.', price: 45 },
    { id: 3, title: 'Acoustic Guitar', description: 'Slightly used, great for beginners.', price: 80 },
];

const AdsComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedAd, setSelectedAd] = useState(null);
     const { data, loading, error } = useGetModalData(new Ads());
    const handleAskQuestion = (ad) => {
        setSelectedAd(ad);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAd(null);
    };

    const handleSendQuestion = () => {
        alert(`Your question about "${selectedAd.title}" has been sent!`);
        handleCloseModal();
    };

    return (
        <div className="mt-4">
            <h2>Ads</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleAds.map(ad => (
                            <tr key={ad.id}>
                                <td>{ad.title}</td>
                                <td>{ad.description}</td>
                                <td>${ad.price}</td>
                                <td>
                                    <button className="btn btn-info btn-sm" onClick={() => handleAskQuestion(ad)}>
                                        Ask a Question
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedAd && (
                <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Ask a question about: {selectedAd.title}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="question" className="form-label">Your Question</label>
                                        <textarea className="form-control" id="question" rows="4" placeholder="Type your question here..."></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSendQuestion}>Send Question</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdsComponent;
