const ErrorComponent = ({ error, show, handleClose }) => {
  // Don't render the modal if the show prop is false
  if (!show) {
    return null;
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal Dialog */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Error Occurred</h5>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>{error?.message || "An unexpected error occurred."}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorComponent;