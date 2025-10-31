import React, { useState } from "react";
import Hero from "./components/Hero";
import SimulationDashboard from "./components/SimulationDashboard_Fixed";

const App = () => {
  const [showSimulation, setShowSimulation] = useState(false);

  const handleStartSimulation = () => {
    setShowSimulation(true);
  };

  const handleBackToHome = () => {
    setShowSimulation(false);
  };

  return (
    <div>
      {!showSimulation ? (
        <Hero onStartSimulation={handleStartSimulation} />
      ) : (
        <div>
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                <span>←</span>
                <span>Back to Home</span>
              </button>
            </div>
          </div>
          <SimulationDashboard />
        </div>
      )}
    </div>
  );
};

export default App;
