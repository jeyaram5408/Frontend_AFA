import React from "react";
import SmartRecommendations from "../components/SmartRecommendations";

const AIAdvise = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4">
      
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
           <span>AI Financial Advice</span>
        </h2>

        <p className="text-xs sm:text-sm text-gray-500">
          Get smart insights and personalized savings tips
        </p>
      </div>

      {/* Content */}
      <div className="w-full">
        <SmartRecommendations />
      </div>

    </div>
  );
};

export default AIAdvise;