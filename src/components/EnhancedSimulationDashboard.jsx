import React, { useState, useEffect, useRef } from "react";
import MapComponent from "./MapComponent";
import OrderCard from "./OrderCard";
import DeliveryPartnerCard from "./DeliveryPartnerCard";
import { EnhancedOrderManagementSystem } from "../utils/enhancedOrderManagement";
import {
  runOrderManagementDemo,
  demonstratePriorityCalculation,
} from "../utils/orderManagementDemo";
import {
  mapGraph,
  initialDeliveryPartners,
  storeLocation,
} from "../data/mapData";

const EnhancedSimulationDashboard = () => {
  const [orderSystem] = useState(
    () => new EnhancedOrderManagementSystem(mapGraph, storeLocation)
  );
  const [deliveryPartners, setDeliveryPartners] = useState([
    ...initialDeliveryPartners,
  ]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [agentToStorePath, setAgentToStorePath] = useState([]);
  const [storeToCustomerPath, setStoreToCustomerPath] = useState([]);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRouteType, setSelectedRouteType] = useState("both");
  const [systemStatus, setSystemStatus] = useState({
    pendingOrders: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    totalOrders: 0,
  });
  const [autoProcessing, setAutoProcessing] = useState(false);
  const autoProcessRef = useRef(null);

  // Sample order templates for generating new orders
  const orderTemplates = [
    {
      customerName: "Alice Johnson",
      restaurant: "Pizza Palace",
      orderValue: 850,
      deliveryLocation: "J",
      items: ["Large Margherita Pizza", "Garlic Bread", "Coke"],
    },
    {
      customerName: "Bob Smith",
      restaurant: "Burger King",
      orderValue: 320,
      deliveryLocation: "C",
      items: ["Whopper Meal", "Fries"],
    },
    {
      customerName: "Carol Davis",
      restaurant: "Sushi Express",
      orderValue: 1200,
      deliveryLocation: "I",
      items: ["Premium Sushi Platter", "Miso Soup", "Green Tea"],
    },
    {
      customerName: "David Wilson",
      restaurant: "Taco Bell",
      orderValue: 180,
      deliveryLocation: "B",
      items: ["Taco Combo"],
    },
    {
      customerName: "Eva Martinez",
      restaurant: "Pizza Palace",
      orderValue: 650,
      deliveryLocation: "F",
      items: ["Medium Pepperoni", "Wings", "Sprite"],
    },
    {
      customerName: "Frank Chen",
      restaurant: "Chinese Garden",
      orderValue: 420,
      deliveryLocation: "G",
      items: ["Fried Rice", "Sweet & Sour Pork"],
    },
    {
      customerName: "Grace Kim",
      restaurant: "Korean BBQ",
      orderValue: 890,
      deliveryLocation: "H",
      items: ["BBQ Platter", "Kimchi", "Rice"],
    },
  ];

  const locations = ["B", "C", "D", "E", "F", "G", "H", "I", "J"];

  useEffect(() => {
    updateSystemStatus();

    // Set up global functions for compatibility
    window.updateOrderStatus = (orderId, newStatus) => {
      if (newStatus === "delivered") {
        orderSystem.completeDelivery(orderId, deliveryPartners);
        updateSystemStatus();
      }
    };

    window.completeDelivery = (assignment) => {
      orderSystem.completeDelivery(assignment.orderId, deliveryPartners);
      updateSystemStatus();
      clearRouteSelection();
    };

    return () => {
      delete window.updateOrderStatus;
      delete window.completeDelivery;
      if (autoProcessRef.current) {
        clearInterval(autoProcessRef.current);
      }
    };
  }, []);

  const updateSystemStatus = () => {
    const status = orderSystem.getSystemStatus();
    setSystemStatus(status);
  };

  const addSampleOrders = () => {
    console.log("🎲 Adding sample orders to priority queue...");

    // Add 3-5 random orders
    const numOrders = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numOrders; i++) {
      const template =
        orderTemplates[Math.floor(Math.random() * orderTemplates.length)];
      const randomLocation =
        locations[Math.floor(Math.random() * locations.length)];

      const orderData = {
        ...template,
        customerName: `${template.customerName.split(" ")[0]} ${Math.floor(
          Math.random() * 100
        )}`,
        orderValue: Math.floor(Math.random() * 800) + 200, // ₹200-₹1000
        deliveryLocation: randomLocation,
      };

      orderSystem.addOrder(orderData);
    }

    updateSystemStatus();
    console.log(`✅ Added ${numOrders} orders to the priority queue`);
  };

  const addCustomOrder = () => {
    const template =
      orderTemplates[Math.floor(Math.random() * orderTemplates.length)];
    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];

    const orderData = {
      ...template,
      customerName: `${template.customerName.split(" ")[0]} ${
        Date.now() % 1000
      }`,
      orderValue: Math.floor(Math.random() * 800) + 200,
      deliveryLocation: randomLocation,
    };

    const order = orderSystem.addOrder(orderData);
    updateSystemStatus();
    console.log(
      `➕ Added new order: ${order.customerName} - ₹${order.orderValue} to ${order.deliveryLocation}`
    );
  };

  const processNextOrder = () => {
    console.log("🔄 Processing next highest priority order...");

    const assignment = orderSystem.processNextOrder(deliveryPartners);

    if (assignment) {
      updateSystemStatus();
      console.log(
        `✅ Order ${assignment.orderId} assigned to ${assignment.partnerName}`
      );
      return assignment;
    } else {
      console.log("❌ No orders to process or no available partners");
      return null;
    }
  };

  const processBatchOrders = () => {
    console.log("🚀 Processing batch of orders...");

    const assignments = orderSystem.processBatchOrders(deliveryPartners, 3);
    updateSystemStatus();

    if (assignments.length > 0) {
      console.log(`✅ Processed ${assignments.length} orders in batch`);
    } else {
      console.log("❌ No orders processed - check availability");
    }
  };

  const simulateDeliveryCompletion = () => {
    const activeDeliveries = orderSystem.getActiveDeliveries();

    if (activeDeliveries.length === 0) {
      console.log("No active deliveries to complete");
      return;
    }

    // Complete a random active delivery
    const randomDelivery =
      activeDeliveries[Math.floor(Math.random() * activeDeliveries.length)];
    orderSystem.completeDelivery(randomDelivery.orderId, deliveryPartners);
    updateSystemStatus();

    console.log(`🎯 Completed delivery for order ${randomDelivery.orderId}`);

    // Clear route selection if this was the selected assignment
    if (
      selectedAssignment &&
      selectedAssignment.orderId === randomDelivery.orderId
    ) {
      clearRouteSelection();
    }
  };

  const startAutoProcessing = () => {
    if (autoProcessing) {
      clearInterval(autoProcessRef.current);
      setAutoProcessing(false);
      console.log("⏹️ Stopped auto-processing");
    } else {
      setAutoProcessing(true);
      console.log("▶️ Started auto-processing");

      autoProcessRef.current = setInterval(() => {
        // Randomly add new orders
        if (Math.random() > 0.7) {
          addCustomOrder();
        }

        // Process orders if available
        if (orderSystem.orderQueue.size() > 0) {
          processNextOrder();
        }

        // Complete some deliveries
        if (Math.random() > 0.6 && orderSystem.activeDeliveries.getSize() > 0) {
          simulateDeliveryCompletion();
        }
      }, 2000); // Every 2 seconds
    }
  };

  const resetSystem = () => {
    console.log("🔄 Resetting entire system...");

    // Stop auto-processing
    if (autoProcessRef.current) {
      clearInterval(autoProcessRef.current);
      setAutoProcessing(false);
    }

    // Clear all orders and deliveries
    orderSystem.orderQueue.clear();
    orderSystem.activeDeliveries.clear();
    orderSystem.completedDeliveries = [];
    orderSystem.orderIdCounter = 1;

    // Reset delivery partners
    setDeliveryPartners([...initialDeliveryPartners]);

    // Clear UI state
    clearRouteSelection();
    updateSystemStatus();

    console.log("✅ System reset complete");
  };

  const viewRoute = (assignment) => {
    setSelectedAssignment(assignment);
    setShowRouteOptions(true);
    setSelectedRouteType("both");
    console.log("👁️ Showing route options for order:", assignment.orderId);
  };

  const selectRouteType = (routeType) => {
    setSelectedRouteType(routeType);
    setShowRouteOptions(false);

    if (routeType === "agent") {
      setAgentToStorePath(selectedAssignment.partnerToStorePath);
      setStoreToCustomerPath([]);
    } else if (routeType === "delivery") {
      setAgentToStorePath([]);
      setStoreToCustomerPath(selectedAssignment.storeToDeliveryPath);
    } else if (routeType === "both") {
      setAgentToStorePath(selectedAssignment.partnerToStorePath);
      setStoreToCustomerPath(selectedAssignment.storeToDeliveryPath);
    }
  };

  const clearRouteSelection = () => {
    setSelectedAssignment(null);
    setAgentToStorePath([]);
    setStoreToCustomerPath([]);
    setShowRouteOptions(false);
    setSelectedRouteType("both");
  };

  const runDemo = () => {
    console.log("🎬 Running complete system demo...");
    runOrderManagementDemo();
  };

  const showPriorityDemo = () => {
    console.log("🧮 Demonstrating priority calculation...");
    demonstratePriorityCalculation();
  };

  // Get current data for display
  const pendingOrders = orderSystem.getPendingOrders();
  const activeDeliveries = orderSystem.getActiveDeliveries();
  const completedDeliveries = orderSystem.getCompletedDeliveries();
  const availablePartners = deliveryPartners.filter((p) => p.isAvailable);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚚 Enhanced Priority Queue Delivery System
          </h1>
          <p className="text-gray-600 mb-4">
            Advanced order management using Priority Queue (Heap) + Dijkstra's
            Algorithm
          </p>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={addSampleOrders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🎲 Add Sample Orders
            </button>
            <button
              onClick={addCustomOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ➕ Add Single Order
            </button>
            <button
              onClick={processNextOrder}
              disabled={pendingOrders.length === 0}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔄 Process Next Order
            </button>
            <button
              onClick={processBatchOrders}
              disabled={pendingOrders.length === 0}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🚀 Process Batch
            </button>
            <button
              onClick={simulateDeliveryCompletion}
              disabled={activeDeliveries.length === 0}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🎯 Complete Delivery
            </button>
            <button
              onClick={startAutoProcessing}
              className={`${
                autoProcessing
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-4 py-2 rounded-lg font-medium transition-colors`}
            >
              {autoProcessing ? "⏹️ Stop Auto" : "▶️ Start Auto"}
            </button>
            <button
              onClick={resetSystem}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🔄 Reset System
            </button>
          </div>

          {/* Demo Buttons */}
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={runDemo}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🎬 Run Full Demo
            </button>
            <button
              onClick={showPriorityDemo}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🧮 Priority Demo
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {systemStatus.pendingOrders}
            </div>
            <div className="text-sm text-gray-600">Pending Orders</div>
            <div className="text-xs text-gray-500">In Priority Queue</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">
              {systemStatus.activeDeliveries}
            </div>
            <div className="text-sm text-gray-600">Active Deliveries</div>
            <div className="text-xs text-gray-500">In Linked List</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {systemStatus.completedDeliveries}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xs text-gray-500">Total Delivered</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-purple-600">
              {availablePartners.length}
            </div>
            <div className="text-sm text-gray-600">Available Partners</div>
            <div className="text-xs text-gray-500">Ready for Assignment</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {systemStatus.totalOrders}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-xs text-gray-500">System Lifetime</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <MapComponent
              agentToStorePath={agentToStorePath}
              storeToCustomerPath={storeToCustomerPath}
              selectedAssignment={selectedAssignment}
            />
          </div>

          {/* Delivery Partners */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Delivery Partners ({availablePartners.length}/
              {deliveryPartners.length} available)
            </h3>
            <div className="space-y-4">
              {deliveryPartners.map((partner) => (
                <DeliveryPartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Orders (Priority Queue) */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🏆 Priority Queue ({pendingOrders.length})
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Sorted by Priority)
                </span>
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingOrders.map((order, index) => (
                  <div key={order.id} className="relative">
                    <div className="absolute -left-2 top-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <OrderCard
                      order={order}
                      onViewRoute={() => {}}
                      showPriority={true}
                    />
                  </div>
                ))}
                {pendingOrders.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📭</div>
                    <p>No pending orders</p>
                    <p className="text-sm">
                      Add some orders to see the priority queue in action!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Deliveries (Linked List) */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🚛 Active Deliveries ({activeDeliveries.length})
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Linked List)
                </span>
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeDeliveries.map((assignment) => (
                  <OrderCard
                    key={assignment.orderId}
                    order={assignment.order}
                    assignment={assignment}
                    onViewRoute={viewRoute}
                    isSelected={
                      selectedAssignment?.orderId === assignment.orderId
                    }
                  />
                ))}
                {activeDeliveries.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🚚</div>
                    <p>No active deliveries</p>
                    <p className="text-sm">
                      Process some orders to see active deliveries!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Deliveries */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ✅ Completed ({completedDeliveries.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {completedDeliveries
                  .slice(-10)
                  .reverse()
                  .map((assignment) => (
                    <OrderCard
                      key={assignment.orderId}
                      order={assignment.order}
                      assignment={assignment}
                      onViewRoute={() => {}}
                    />
                  ))}
                {completedDeliveries.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📦</div>
                    <p>No completed deliveries</p>
                    <p className="text-sm">
                      Complete some deliveries to see them here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Route Selection Modal */}
        {showRouteOptions && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🛣️ Select Route to View - Order #{selectedAssignment.orderId}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => selectRouteType("agent")}
                  className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <div className="text-blue-700 font-semibold mb-2">
                    🚚 Agent → Store
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {selectedAssignment.partnerName} travels to store
                  </div>
                  <div className="text-xs text-blue-600">
                    {selectedAssignment.partnerToStorePath.join(" → ")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Distance: {selectedAssignment.partnerToStoreDistance} units
                  </div>
                </button>

                <button
                  onClick={() => selectRouteType("delivery")}
                  className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all"
                >
                  <div className="text-orange-700 font-semibold mb-2">
                    🏪 Store → Customer
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Delivery route to customer
                  </div>
                  <div className="text-xs text-orange-600">
                    {selectedAssignment.storeToDeliveryPath.join(" → ")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Distance: {selectedAssignment.storeToDeliveryDistance} units
                  </div>
                </button>

                <button
                  onClick={() => selectRouteType("both")}
                  className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                >
                  <div className="text-purple-700 font-semibold mb-2">
                    🛣️ Complete Route
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Full delivery journey
                  </div>
                  <div className="text-xs text-purple-600">
                    Complete Agent + Delivery Path
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {selectedAssignment.totalDistance} units
                  </div>
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={clearRouteSelection}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Route Details Panel */}
        {selectedAssignment && !showRouteOptions && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Route Details - Order #{selectedAssignment.orderId}
              </h3>
              <button
                onClick={clearRouteSelection}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ← Back
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Route Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Partner:</span>
                    <span className="font-medium">
                      {selectedAssignment.partnerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Partner to Store:</span>
                    <span className="font-medium">
                      {selectedAssignment.partnerToStoreDistance} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store to Customer:</span>
                    <span className="font-medium">
                      {selectedAssignment.storeToDeliveryDistance} units
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-semibold">
                      Total Distance:
                    </span>
                    <span className="font-bold text-orange-600">
                      {selectedAssignment.totalDistance} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-medium">
                      {selectedAssignment.estimatedDeliveryTime} min
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Path Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">🚚 Partner Route:</span>
                    <div className="font-mono text-blue-600 bg-blue-50 p-2 rounded mt-1">
                      {selectedAssignment.partnerToStorePath.join(" → ")}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">🏪 Delivery Route:</span>
                    <div className="font-mono text-orange-600 bg-orange-50 p-2 rounded mt-1">
                      {selectedAssignment.storeToDeliveryPath.join(" → ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSimulationDashboard;
