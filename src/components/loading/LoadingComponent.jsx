const LoadingComponent = (props) => {
  return (
    /*use bootstrap spinner for loading*/ 

    <div className="loading-container">
      <div className="spinner"></div>
      <p> `Loading {props.message} ...`</p>
    </div>
  );
};

export default LoadingComponent;

// CSS styles can be added in a separate CSS file to style the loading component and spinner.   