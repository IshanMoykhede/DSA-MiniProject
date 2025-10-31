// Test file to demonstrate the Priority Queue system
import { EnhancedOrderManagementSystem } from "./enhancedOrderManagement.js";
import {
  mapGraph,
  initialDeliveryPartners,
  storeLocation,
} from "../data/mapData.js";

export function testPriorityQueueSystem() {
  console.log("🧪 Testing Priority Queue System");
  console.log("================================");

  // Initialize system
  const orderSystem = new EnhancedOrderManagementSystem(
    mapGraph,
    storeLocation
  );
  const partners = JSON.parse(JSON.stringify(initialDeliveryPartners));

  // Test orders with different priorities
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
    {
      customerName: "High Value Far",
      restaurant: "Expensive Restaurant",
      orderValue: 1200,
      deliveryLocation: "I", // Far but high value
      items: ["Luxury meal"],
    },
  ];

  console.log("\n📦 Adding test orders...");
  testOrders.forEach((orderData, index) => {
    const order = orderSystem.addOrder(orderData);
    console.log(
      `${index + 1}. ${order.customerName}: ₹${order.orderValue} to ${
        order.deliveryLocation
      } (Priority: ${order.priorityScore.toFixed(4)})`
    );
  });

  console.log("\n🏆 Priority Queue Order (Highest to Lowest Priority):");
  const pendingOrders = orderSystem.getPendingOrders();
  pendingOrders.forEach((order, index) => {
    console.log(
      `${index + 1}. ${
        order.customerName
      } - Score: ${order.priorityScore.toFixed(4)} (Value: ₹${
        order.orderValue
      }, Distance: ${order.actualDistance})`
    );
  });

  console.log("\n🚚 Processing orders in priority order...");
  let processCount = 0;
  while (!orderSystem.orderQueue.isEmpty() && processCount < 4) {
    const assignment = orderSystem.processNextOrder(partners);
    if (assignment) {
      console.log(
        `${processCount + 1}. Processed: ${assignment.order.customerName} → ${
          assignment.partnerName
        } (Total distance: ${assignment.totalDistance})`
      );
      processCount++;
    } else {
      console.log("No more available partners");
      break;
    }
  }

  console.log("\n📊 Final System Status:");
  const status = orderSystem.getSystemStatus();
  console.log(`- Pending: ${status.pendingOrders}`);
  console.log(`- Active: ${status.activeDeliveries}`);
  console.log(`- Completed: ${status.completedDeliveries}`);

  return { orderSystem, partners, status };
}

export function testHeapOperations() {
  console.log("\n🔧 Testing Heap Operations");
  console.log("==========================");

  const orderSystem = new EnhancedOrderManagementSystem(
    mapGraph,
    storeLocation
  );

  // Add orders in random order
  const randomOrders = [
    { customerName: "Order 1", orderValue: 300, deliveryLocation: "F" },
    { customerName: "Order 2", orderValue: 800, deliveryLocation: "B" },
    { customerName: "Order 3", orderValue: 150, deliveryLocation: "J" },
    { customerName: "Order 4", orderValue: 600, deliveryLocation: "C" },
    { customerName: "Order 5", orderValue: 900, deliveryLocation: "G" },
  ];

  console.log("Adding orders in random order:");
  randomOrders.forEach((orderData) => {
    const order = orderSystem.addOrder(orderData);
    console.log(
      `- ${order.customerName}: Priority ${order.priorityScore.toFixed(4)}`
    );
  });

  console.log("\nExtracting orders in priority order:");
  let extractCount = 1;
  while (!orderSystem.orderQueue.isEmpty()) {
    const order = orderSystem.orderQueue.dequeue();
    console.log(
      `${extractCount}. ${
        order.customerName
      }: Priority ${order.priorityScore.toFixed(4)}`
    );
    extractCount++;
  }

  console.log("✅ Heap operations test completed!");
}

export function testLinkedListOperations() {
  console.log("\n🔗 Testing Linked List Operations");
  console.log("=================================");

  const orderSystem = new EnhancedOrderManagementSystem(
    mapGraph,
    storeLocation
  );
  const partners = JSON.parse(JSON.stringify(initialDeliveryPartners));

  // Add and process some orders
  const orders = [
    { customerName: "Test 1", orderValue: 400, deliveryLocation: "B" },
    { customerName: "Test 2", orderValue: 600, deliveryLocation: "C" },
    { customerName: "Test 3", orderValue: 500, deliveryLocation: "D" },
  ];

  orders.forEach((orderData) => orderSystem.addOrder(orderData));

  console.log("Processing orders to create active deliveries:");
  let assignments = [];
  for (let i = 0; i < 3; i++) {
    const assignment = orderSystem.processNextOrder(partners);
    if (assignment) {
      assignments.push(assignment);
      console.log(
        `- Added delivery: Order ${assignment.orderId} → ${assignment.partnerName}`
      );
    }
  }

  console.log("\nActive deliveries in linked list:");
  const activeDeliveries = orderSystem.getActiveDeliveries();
  activeDeliveries.forEach((delivery, index) => {
    console.log(
      `${index + 1}. Order ${delivery.orderId}: ${
        delivery.order.customerName
      } via ${delivery.partnerName}`
    );
  });

  console.log("\nCompleting middle delivery:");
  if (assignments.length >= 2) {
    const middleAssignment = assignments[1];
    orderSystem.completeDelivery(middleAssignment.orderId, partners);
    console.log(`- Completed: Order ${middleAssignment.orderId}`);
  }

  console.log("\nRemaining active deliveries:");
  const remainingDeliveries = orderSystem.getActiveDeliveries();
  remainingDeliveries.forEach((delivery, index) => {
    console.log(
      `${index + 1}. Order ${delivery.orderId}: ${
        delivery.order.customerName
      } via ${delivery.partnerName}`
    );
  });

  console.log("✅ Linked list operations test completed!");
}

// Run all tests
export function runAllTests() {
  console.log("🚀 Running Complete Priority Queue System Tests");
  console.log("===============================================");

  testPriorityQueueSystem();
  testHeapOperations();
  testLinkedListOperations();

  console.log("\n🎉 All tests completed successfully!");
}
