import { EnhancedOrderManagementSystem } from "./enhancedOrderManagement.js";
import {
  mapGraph,
  initialDeliveryPartners,
  storeLocation,
} from "../data/mapData.js";

// Demo function to test the new order management system
export function runOrderManagementDemo() {
  console.log("🚀 Enhanced Order Management System Demo");
  console.log("==========================================");

  // Initialize the system
  const orderSystem = new EnhancedOrderManagementSystem(
    mapGraph,
    storeLocation
  );

  // Create a copy of delivery partners for simulation
  const deliveryPartners = JSON.parse(JSON.stringify(initialDeliveryPartners));

  // Sample orders with different priorities
  const sampleOrders = [
    {
      customerName: "Alice Johnson",
      restaurant: "Pizza Palace",
      orderValue: 850, // High value
      deliveryLocation: "J", // Far location
      items: ["Large Margherita Pizza", "Garlic Bread", "Coke"],
    },
    {
      customerName: "Bob Smith",
      restaurant: "Burger King",
      orderValue: 320, // Medium value
      deliveryLocation: "C", // Close location
      items: ["Whopper Meal", "Fries"],
    },
    {
      customerName: "Carol Davis",
      restaurant: "Sushi Express",
      orderValue: 1200, // Very high value
      deliveryLocation: "I", // Medium distance
      items: ["Premium Sushi Platter", "Miso Soup", "Green Tea"],
    },
    {
      customerName: "David Wilson",
      restaurant: "Taco Bell",
      orderValue: 180, // Low value
      deliveryLocation: "B", // Very close
      items: ["Taco Combo"],
    },
    {
      customerName: "Eva Martinez",
      restaurant: "Pizza Palace",
      orderValue: 650, // High value
      deliveryLocation: "F", // Medium distance
      items: ["Medium Pepperoni", "Wings", "Sprite"],
    },
  ];

  console.log("\n📦 Adding Orders to Priority Queue");
  console.log("==================================");

  // Add orders and show priority calculation
  sampleOrders.forEach((orderData, index) => {
    const order = orderSystem.addOrder(orderData);
    console.log(`Order ${order.id}: ${order.customerName}`);
    console.log(
      `  Value: ₹${order.orderValue} | Location: ${order.deliveryLocation} | Distance: ${order.actualDistance}`
    );
    console.log(
      `  Priority Score: ${order.priorityScore.toFixed(
        4
      )} (lower = higher priority)`
    );
    console.log("");
  });

  console.log("\n🏆 Priority Queue Ranking");
  console.log("=========================");
  const pendingOrders = orderSystem.getPendingOrders();
  pendingOrders.forEach((order, index) => {
    console.log(
      `${index + 1}. Order ${order.id} (${
        order.customerName
      }) - Score: ${order.priorityScore.toFixed(4)}`
    );
  });

  console.log("\n🚚 Processing Orders with Dijkstra Partner Assignment");
  console.log("====================================================");

  // Process orders one by one
  let processedCount = 0;
  while (!orderSystem.orderQueue.isEmpty() && processedCount < 5) {
    console.log(`\n--- Processing Order ${processedCount + 1} ---`);

    // Show available partners
    const availablePartners = deliveryPartners.filter((p) => p.isAvailable);
    console.log(
      `Available Partners: ${availablePartners
        .map((p) => `${p.name}(${p.location})`)
        .join(", ")}`
    );

    const assignment = orderSystem.processNextOrder(deliveryPartners);

    if (assignment) {
      console.log(
        `✅ Order ${assignment.orderId} assigned to ${assignment.partnerName}`
      );
      console.log(
        `   Partner→Store: ${assignment.partnerToStoreDistance} units`
      );
      console.log(
        `   Store→Customer: ${assignment.storeToDeliveryDistance} units`
      );
      console.log(`   Total Distance: ${assignment.totalDistance} units`);
      console.log(
        `   Estimated Time: ${assignment.estimatedDeliveryTime} minutes`
      );
      console.log(
        `   Path: ${assignment.partnerToStorePath.join(
          "→"
        )} → ${assignment.storeToDeliveryPath.join("→")}`
      );

      processedCount++;

      // Simulate delivery completion for some orders
      if (Math.random() > 0.6) {
        console.log(`   🎯 Simulating delivery completion...`);
        setTimeout(() => {
          orderSystem.completeDelivery(assignment.orderId, deliveryPartners);
        }, 100);
      }
    } else {
      console.log("❌ No available partners");
      break;
    }
  }

  // Show final system status
  console.log("\n📊 Final System Status");
  console.log("======================");
  const status = orderSystem.getSystemStatus();
  console.log(`Pending Orders: ${status.pendingOrders}`);
  console.log(`Active Deliveries: ${status.activeDeliveries}`);
  console.log(`Completed Deliveries: ${status.completedDeliveries}`);
  console.log(`Total Orders Processed: ${status.totalOrders}`);

  // Show active deliveries
  if (status.activeDeliveries > 0) {
    console.log("\n🚛 Active Deliveries");
    console.log("===================");
    const activeDeliveries = orderSystem.getActiveDeliveries();
    activeDeliveries.forEach((delivery) => {
      console.log(
        `Order ${delivery.orderId}: ${delivery.partnerName} → ${delivery.order.deliveryLocation}`
      );
      console.log(`  Customer: ${delivery.order.customerName}`);
      console.log(`  Status: ${delivery.order.status}`);
      console.log(`  Total Distance: ${delivery.totalDistance} units`);
    });
  }

  // Show completed deliveries
  if (status.completedDeliveries > 0) {
    console.log("\n✅ Completed Deliveries");
    console.log("=======================");
    const completedDeliveries = orderSystem.getCompletedDeliveries();
    completedDeliveries.forEach((delivery) => {
      console.log(
        `Order ${delivery.orderId}: Delivered by ${delivery.partnerName}`
      );
      console.log(`  Customer: ${delivery.order.customerName}`);
      console.log(`  Delivered to: ${delivery.order.deliveryLocation}`);
      console.log(`  Total Distance: ${delivery.totalDistance} units`);
    });
  }

  return {
    orderSystem,
    deliveryPartners,
    status,
  };
}

// Function to demonstrate priority calculation
export function demonstratePriorityCalculation() {
  console.log("\n🧮 Priority Calculation Demonstration");
  console.log("====================================");

  const orderSystem = new EnhancedOrderManagementSystem(
    mapGraph,
    storeLocation
  );

  const testOrders = [
    {
      orderValue: 500,
      deliveryLocation: "B",
      description: "Medium value, very close",
    },
    {
      orderValue: 500,
      deliveryLocation: "J",
      description: "Medium value, far away",
    },
    {
      orderValue: 1000,
      deliveryLocation: "J",
      description: "High value, far away",
    },
    {
      orderValue: 200,
      deliveryLocation: "B",
      description: "Low value, very close",
    },
  ];

  testOrders.forEach((orderData, index) => {
    const priority = orderSystem.calculateOrderPriority(orderData);
    console.log(`\nOrder ${index + 1}: ${orderData.description}`);
    console.log(
      `  Value: ₹${orderData.orderValue} | Location: ${orderData.deliveryLocation}`
    );
    console.log(`  Distance: ${priority.actualDistance} units`);
    console.log(
      `  Priority Score: ${priority.priorityScore.toFixed(
        4
      )} (lower = higher priority)`
    );
    console.log(
      `  Normalized Distance: ${priority.normalizedDistance.toFixed(3)}`
    );
    console.log(`  Normalized Value: ${priority.normalizedValue.toFixed(3)}`);
  });
}

// Export for use in components
export { EnhancedOrderManagementSystem };
