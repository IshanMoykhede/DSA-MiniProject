import React from "react";
import { motion } from "framer-motion";

const Hero = ({ onStartSimulation }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="text-orange-600">Smart Delivery</span>
              <br />
              Simulation
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Visualize how real-world delivery apps use Data Structures &
              Algorithms to optimize routes and prioritize orders. Experience
              Priority Queues, Dijkstra's Algorithm, and Linked Lists in action!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={onStartSimulation}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🚀 Start Simulation
              </button>
              <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
                📚 Learn More
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Priority Queue
                </h3>
                <p className="text-sm text-gray-600">
                  Heap-based order prioritization
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl mb-2">🗺️</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Dijkstra's Algorithm
                </h3>
                <p className="text-sm text-gray-600">
                  Shortest path optimization
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Linked List
                </h3>
                <p className="text-sm text-gray-600">
                  Delivery history management
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8 shadow-2xl">
              {/* Delivery Illustration */}
              <div className="relative">
                {/* Restaurant */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute top-4 left-4 bg-orange-600 text-white p-3 rounded-full shadow-lg"
                >
                  🏪
                </motion.div>

                {/* Delivery Routes */}
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.5, duration: 2 }}
                  className="absolute inset-0"
                >
                  <svg width="100%" height="300" viewBox="0 0 400 300">
                    {/* Route lines */}
                    <path
                      d="M 50 50 Q 200 100 350 50"
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 50 50 Q 200 150 350 200"
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 50 50 Q 200 200 350 250"
                      stroke="#f97316"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </motion.div>

                {/* Customer Locations */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg"
                >
                  🏠
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                  className="absolute top-20 right-8 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                >
                  🏠
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.4, duration: 0.5 }}
                  className="absolute top-36 right-4 bg-purple-500 text-white p-2 rounded-full shadow-lg"
                >
                  🏠
                </motion.div>

                {/* Delivery Agent */}
                <motion.div
                  initial={{ x: 50, y: 50 }}
                  animate={{ x: 350, y: 50 }}
                  transition={{
                    delay: 3,
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute bg-yellow-400 text-black p-2 rounded-full shadow-lg"
                >
                  🚚
                </motion.div>
              </div>

              {/* Stats Cards */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.5 }}
                  className="bg-white rounded-lg p-4 shadow-md"
                >
                  <div className="text-2xl font-bold text-orange-600">15</div>
                  <div className="text-sm text-gray-600">Orders Delivered</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.7, duration: 0.5 }}
                  className="bg-white rounded-lg p-4 shadow-md"
                >
                  <div className="text-2xl font-bold text-green-600">8.5</div>
                  <div className="text-sm text-gray-600">Avg Time (min)</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
