// Simple test to verify the Priority Queue system works
import {
  calculateOrderPriority,
  prioritizeOrders,
  assignDeliveryPartners,
  addOrderToSystem,
  getPendingOrdersFromQueue,
  getSystemStatus,
  resetSystem,
} from "./src/utils/orderManagement.js";
import {
  mapGraph,
  initialDeliveryPartners,
  storeLocation,
} from "./src/data/mapData.js";

console.log("🧪 Testing Priority Queue System Integration");
console.log("===========================================");

// Reset system
resetSystem();

// Test data
const testOrders = [
  {
    customerName: "High Value Close",
    restaurant: "Premium Restaurant",
    orderValue: 1000,
    deliveryLocation: "B", // Close to store (A)
    items: ["Premium meal"],
  },
  {
    customerName: "Low Value Far",
    restaurant: "Budget Food",
    orderValue: 200,
    deliveryLocation: "J", // Far from store (A)
    items: ["Budget meal"],
  },
  {
    customerName: "Medium Value Medium",
    restaurant: "Regular Restaurant",
    orderValue: 500,
    deliveryLocation: "E", // Medium distance
    items: ["Regular meal"],
  },
];

console.log("\n📦 Adding orders to Priority Queue system...");
testOrders.forEach((orderData, index) => {
  const order = addOrderToSystem(orderData, mapGraph, storeLocation);
  console.log(
    `${index + 1}. ${order.customerName}: ₹${order.orderValue} to ${
      order.deliveryLocation
    } (Priority: ${order.priorityScore.toFixed(4)})`
  );
});

console.log("\n🏆 Orders in Priority Queue (sorted by priority):");
const pendingOrders = getPendingOrdersFromQueue();
pendingOrders.forEach((order, index) => {
  console.log(
    `${index + 1}. ${order.customerName} - Score: ${order.priorityScore.toFixed(
      4
    )} (Value: ₹${order.orderValue}, Distance: ${order.actualDistance})`
  );
});

console.log("\n📊 System Status:");
const status = getSystemStatus();
console.log(`- Pending Orders: ${status.pendingOrders}`);
console.log(`- Active Deliveries: ${status.activeDeliveries}`);
console.log(`- Total Processed: ${status.totalProcessed}`);

console.log("\n✅ Priority Queue system integration test completed!");
console.log("The system now uses:");
console.log("- Priority Queue (Heap) for order management");
console.log("- Dijkstra's Algorithm for partner assignment");
console.log("- Linked List for active delivery tracking");
console.log("- Same UI as before, enhanced backend algorithms");
