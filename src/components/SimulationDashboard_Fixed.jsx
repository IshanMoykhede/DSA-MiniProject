import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import OrderCard from "./OrderCard";
import DeliveryPartnerCard from "./DeliveryPartnerCard";
import {
  generateSampleOrders,
  prioritizeOrders,
  assignDeliveryPartners,
} from "../utils/orderManagement";
import {
  mapGraph,
  initialDeliveryPartners,
  storeLocation,
} from "../data/mapData";

const SimulationDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [agentToStorePath, setAgentToStorePath] = useState([]);
  const [storeToCustomerPath, setStoreToCustomerPath] = useState([]);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRouteType, setSelectedRouteType] = useState("both"); // "agent", "delivery", "both"

  useEffect(() => {
    try {
      console.log("🚀 Initializing SimulationDashboard...");

      // Generate initial orders
      const initialOrders = generateSampleOrders();
      console.log("📦 Generated orders:", initialOrders);
      setOrders(initialOrders);

      // Set delivery partners
      setDeliveryPartners([...initialDeliveryPartners]);
      console.log("👥 Set delivery partners:", initialDeliveryPartners);

      // Set up global functions for order status updates
      window.updateOrderStatus = (orderId, newStatus) => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      };

      window.completeDelivery = (assignment) => {
        // Update partner location and availability
        setDeliveryPartners((prev) => {
          const updated = [...prev];
          const partner = updated.find((p) => p.id === assignment.partnerId);
          if (partner) {
            partner.isAvailable = true;
            partner.location = assignment.order.deliveryLocation;
          }
          return updated;
        });

        // Update order status
        setOrders((prev) =>
          prev.map((order) =>
            order.id === assignment.orderId
              ? { ...order, status: "delivered" }
              : order
          )
        );

        // Remove from assignments
        setAssignments((prev) =>
          prev.filter((a) => a.orderId !== assignment.orderId)
        );

        // Clear route selection if this was the selected assignment
        setSelectedAssignment((prevSelected) => {
          if (prevSelected && prevSelected.orderId === assignment.orderId) {
            setAgentToStorePath([]);
            setStoreToCustomerPath([]);
            return null;
          }
          return prevSelected;
        });
      };

      console.log("✅ SimulationDashboard initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing SimulationDashboard:", error);
    }

    return () => {
      delete window.updateOrderStatus;
      delete window.completeDelivery;
    };
  }, []);

  const startSimulation = () => {
    console.log("🚀 Starting simulation...");

    try {
      const pendingOrders = orders.filter((o) => o.status === "pending");
      console.log("Pending orders:", pendingOrders);

      if (pendingOrders.length === 0) {
        console.log("⚠️ No pending orders to simulate");
        return;
      }

      // Step 1: Prioritize orders
      const prioritizedOrders = prioritizeOrders(
        pendingOrders,
        mapGraph,
        storeLocation
      );
      console.log("Prioritized orders:", prioritizedOrders);

      // Update orders with priorities
      setOrders((prev) =>
        prev.map((order) => {
          const prioritized = prioritizedOrders.find((p) => p.id === order.id);
          return prioritized || order;
        })
      );

      // Step 2: Assign delivery partners (use fresh copy)
      const partnersCopy = JSON.parse(JSON.stringify(deliveryPartners));
      const newAssignments = assignDeliveryPartners(
        prioritizedOrders,
        partnersCopy,
        mapGraph,
        storeLocation
      );
      console.log("🔍 Assignment Debug:");
      console.log("- Prioritized orders:", prioritizedOrders);
      console.log(
        "- Available partners before:",
        deliveryPartners.filter((p) => p.isAvailable)
      );
      console.log("- New assignments created:", newAssignments);
      console.log(
        "- Available partners after:",
        partnersCopy.filter((p) => p.isAvailable)
      );

      // Test dijkstra function
      try {
        const testPath = dijkstra(mapGraph, "A", "B");
        console.log("- Dijkstra test A->B:", testPath);
      } catch (error) {
        console.error("- Dijkstra test failed:", error);
      }

      if (newAssignments.length > 0) {
        setAssignments((prev) => {
          const updated = [...prev, ...newAssignments];
          console.log("Updated assignments:", updated);
          return updated;
        });

        // Update delivery partners with the modified state
        setDeliveryPartners(partnersCopy);
        setSimulationStarted(true);
        console.log(
          "✅ Simulation started successfully with",
          newAssignments.length,
          "assignments"
        );
      } else {
        console.log(
          "⚠️ No assignments created - check if partners are available"
        );
      }
      console.log("✅ Simulation started successfully");
    } catch (error) {
      console.error("❌ Error starting simulation:", error);
    }
  };

  const addNewOrder = () => {
    try {
      const newOrder = generateSampleOrders()[0];
      newOrder.id = Math.max(...orders.map((o) => o.id)) + 1;
      setOrders((prev) => [...prev, newOrder]);
      console.log("➕ Added new order:", newOrder);
    } catch (error) {
      console.error("❌ Error adding new order:", error);
    }
  };

  const viewRoute = (assignment) => {
    try {
      setSelectedAssignment(assignment);
      setShowRouteOptions(true);
      setSelectedRouteType("both");
      console.log("👁️ Showing route options for order:", assignment.orderId);
    } catch (error) {
      console.error("❌ Error viewing route:", error);
    }
  };

  const selectRouteType = (routeType) => {
    try {
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

      console.log("🛣️ Selected route type:", routeType);
    } catch (error) {
      console.error("❌ Error selecting route type:", error);
    }
  };

  const clearRouteSelection = () => {
    setSelectedAssignment(null);
    setAgentToStorePath([]);
    setStoreToCustomerPath([]);
    setShowRouteOptions(false);
    setSelectedRouteType("both");
  };

  const resetSimulation = () => {
    // Reset all orders to pending
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        status: "pending",
        assignedPartner: null,
        priority: undefined,
      }))
    );

    // Reset all delivery partners to available at their original locations
    setDeliveryPartners([
      { id: 1, name: "Ravi", location: "A", isAvailable: true },
      { id: 2, name: "Neha", location: "D", isAvailable: true },
      { id: 3, name: "Arjun", location: "H", isAvailable: true },
    ]);

    // Clear assignments and selections
    setAssignments([]);
    setSelectedAssignment(null);
    setAgentToStorePath([]);
    setStoreToCustomerPath([]);
    setShowRouteOptions(false);
    setSelectedRouteType("both");
    setSimulationStarted(false);

    console.log(
      "🔄 Simulation reset - all orders pending, all partners available"
    );
  };

  const testAssignment = () => {
    console.log("🧪 Testing assignment function manually...");

    // Create a simple test order
    const testOrder = {
      id: 999,
      status: "pending",
      deliveryLocation: "B",
      customerName: "Test Customer",
      orderValue: 200,
      customerRating: 5,
      orderTime: Date.now(),
    };

    // Test partners
    const testPartners = [
      { id: 1, name: "Ravi", location: "A", isAvailable: true },
      { id: 2, name: "Neha", location: "D", isAvailable: true },
    ];

    console.log("Test order:", testOrder);
    console.log("Test partners:", testPartners);

    try {
      const testAssignments = assignDeliveryPartners(
        [testOrder],
        testPartners,
        mapGraph,
        storeLocation
      );
      console.log("Test assignments result:", testAssignments);
    } catch (error) {
      console.error("Test assignment failed:", error);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const activeOrders = orders
    .filter((o) => ["assigned", "out_for_delivery"].includes(o.status))
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  // Debug logging (only when needed)
  if (assignments.length === 0 && activeOrders.length > 0) {
    console.log("⚠️ Issue detected: Active orders without assignments");
    console.log(
      "Active orders:",
      activeOrders.map((o) => ({ id: o.id, status: o.status }))
    );
    console.log("Assignments:", assignments);
    console.log(
      "Available partners:",
      deliveryPartners.filter((p) => p.isAvailable)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚚 Smart Delivery Simulation Dashboard
          </h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startSimulation}
              disabled={pendingOrders.length === 0}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              🚀 Start Simulation ({pendingOrders.length} pending)
            </button>
            <button
              onClick={addNewOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              ➕ Add New Order
            </button>
            <button
              onClick={resetSimulation}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              🔄 Reset Simulation
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingOrders.length}
            </div>
            <div className="text-sm text-gray-600">Pending Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600">
              {activeOrders.length}
            </div>
            <div className="text-sm text-gray-600">Active Deliveries</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600">
              {deliveredOrders.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600">
              {deliveryPartners.filter((p) => p.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600">Available Partners</div>
          </div>
        </div>

        {/* Main Content */}
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
              Delivery Partners
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
            {/* Pending Orders */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Pending Orders ({pendingOrders.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewRoute={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Active Orders */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Active Deliveries ({activeOrders.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activeOrders.map((order) => {
                  const assignment = assignments.find(
                    (a) => a.orderId === order.id
                  );
                  return (
                    <OrderCard
                      key={order.id}
                      order={order}
                      assignment={assignment}
                      onViewRoute={viewRoute}
                      isSelected={selectedAssignment?.orderId === order.id}
                    />
                  );
                })}
              </div>
            </div>

            {/* Delivered Orders */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Delivered Orders ({deliveredOrders.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {deliveredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewRoute={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Route Selection Options */}
        {showRouteOptions && selectedAssignment && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🛣️ Select Route to View - Order #{selectedAssignment.orderId}
            </h3>
            <p className="text-gray-600 mb-6">
              Choose which part of the delivery route you want to visualize on
              the map:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Agent to Store Route */}
              <button
                onClick={() => selectRouteType("agent")}
                className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 bg-blue-500 rounded mr-2"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, #3b82f6 0px, #3b82f6 8px, transparent 8px, transparent 12px)",
                    }}
                  ></div>
                  <span className="font-semibold text-blue-700">
                    Agent → Store
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Shows how <strong>{selectedAssignment.partnerName}</strong>{" "}
                  travels to the store
                </p>
                <div className="text-xs text-blue-600">
                  📍 {selectedAssignment.partnerToStorePath.join(" → ")}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Distance: {selectedAssignment.partnerToStoreDistance} km
                </div>
              </button>

              {/* Store to Customer Route */}
              <button
                onClick={() => selectRouteType("delivery")}
                className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                  <span className="font-semibold text-orange-700">
                    Store → Customer
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Shows the delivery route from store to customer
                </p>
                <div className="text-xs text-orange-600">
                  🏪 {selectedAssignment.storeToDeliveryPath.join(" → ")}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Distance: {selectedAssignment.storeToDeliveryDistance} km
                </div>
              </button>

              {/* Both Routes */}
              <button
                onClick={() => selectRouteType("both")}
                className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded mr-2"></div>
                  <span className="font-semibold text-purple-700">
                    Complete Route
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Shows the entire delivery journey
                </p>
                <div className="text-xs text-purple-600">
                  🚚 Full Agent + Delivery Path
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Total Distance: {selectedAssignment.totalDistance} km
                </div>
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={clearRouteSelection}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Cancel</span>
              </button>
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
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Viewing:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedRouteType === "agent"
                      ? "bg-blue-100 text-blue-800"
                      : selectedRouteType === "delivery"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {selectedRouteType === "agent"
                    ? "🚚 Agent → Store"
                    : selectedRouteType === "delivery"
                    ? "🏪 Store → Customer"
                    : "🛣️ Complete Route"}
                </span>
              </div>
            </div>

            {/* Route Type Switcher */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => selectRouteType("agent")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedRouteType === "agent"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                🚚 Agent Path
              </button>
              <button
                onClick={() => selectRouteType("delivery")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedRouteType === "delivery"
                    ? "bg-orange-600 text-white"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              >
                🏪 Delivery Path
              </button>
              <button
                onClick={() => selectRouteType("both")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  selectedRouteType === "both"
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                🛣️ Both Paths
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
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
                      {selectedAssignment.partnerToStoreDistance} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store to Delivery:</span>
                    <span className="font-medium">
                      {selectedAssignment.storeToDeliveryDistance} km
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-semibold">
                      Total Distance:
                    </span>
                    <span className="font-bold text-orange-600">
                      {selectedAssignment.totalDistance} km
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Path Sequence
                </h4>
                <div className="text-sm">
                  {(selectedRouteType === "agent" ||
                    selectedRouteType === "both") && (
                    <div className="mb-2">
                      <span className="text-gray-600">🚚 Partner Route:</span>
                      <div className="font-mono text-blue-600 bg-blue-50 p-2 rounded mt-1">
                        {selectedAssignment.partnerToStorePath.join(" → ")}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Distance: {selectedAssignment.partnerToStoreDistance} km
                      </div>
                    </div>
                  )}
                  {(selectedRouteType === "delivery" ||
                    selectedRouteType === "both") && (
                    <div className={selectedRouteType === "both" ? "mt-4" : ""}>
                      <span className="text-gray-600">🏪 Delivery Route:</span>
                      <div className="font-mono text-orange-600 bg-orange-50 p-2 rounded mt-1">
                        {selectedAssignment.storeToDeliveryPath.join(" → ")}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Distance: {selectedAssignment.storeToDeliveryDistance}{" "}
                        km
                      </div>
                    </div>
                  )}
                  {selectedRouteType === "both" && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-semibold">
                          🛣️ Complete Journey:
                        </span>
                        <span className="font-bold text-purple-600">
                          {selectedAssignment.totalDistance} km
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Full path:{" "}
                        {selectedAssignment.partnerToStorePath.join(" → ")} →{" "}
                        {selectedAssignment.storeToDeliveryPath
                          .slice(1)
                          .join(" → ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={clearRouteSelection}
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationDashboard;
