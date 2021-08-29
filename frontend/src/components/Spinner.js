import React from "react";

const Spinner = React.memo(({ isLoading }) => {
  return (
    isLoading && (
      <div className="spinner">
        <div className="spinner__container">
          <div className="spinner__animation"></div>
        </div>
      </div>
    )
  );
});

export default Spinner;
