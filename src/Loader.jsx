import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="loader"></div>

      <style>{`
        .loader {
          width: 22px;
          height: 22px;
          border: 3px solid white;
          border-top: 3px solid transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
