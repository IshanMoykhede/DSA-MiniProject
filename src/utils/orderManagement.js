import { dijkstra } from "./dijkstra.js";
import { OrderPriorityQueue } from "./priorityQueue.js";
import { DeliveryLinkedList } from "./deliveryLinkedList.js";

// Global priority queue and delivery list for the system
let globalOrderQueue = new OrderPriorityQueue();
let globalDeliveryList = new DeliveryLinkedList();
let orderIdCounter = 1;

// Enhanced priority calculation using Priority Queue system
export function calculateOrderPriority(order, graph, store) {
  const { orderValue, deliveryLocation } = order;

  // Calculate actual distance using Dijkstra
  const distanceResult = dijkstra(graph, store, deliveryLocation);
  const actualDistance = distanceResult.distance;

  // Priority calculation with custom weighting (lower score = higher priority)
  const distanceWeight = 0.6; // 60% weight for distance
  const valueWeight = 0.4; // 40% weight for order value

  // Normalize distance (closer orders get lower scores = higher priority)
  const maxDistance = 20; // Assume max distance in graph
  const normalizedDistance = Math.min(actualDistance / maxDistance, 1);

  // Normalize order value (higher values get lower scores = higher priority)
  const maxOrderValue = 1000; // Assume max order value
  const normalizedValue = 1 - Math.min(orderValue / maxOrderValue, 1);

  // Calculate final priority score (lower = higher priority)
  const priorityScore =
    distanceWeight * normalizedDistance + valueWeight * normalizedValue;

  return {
    priority: priorityScore, // For backward compatibility
    priorityScore,
    actualDistance,
    normalizedDistance,
    normalizedValue,
  };
}

// Replace array sorting with Priority Queue system
export function prioritizeOrders(orders, graph, store) {
  // Clear existing queue
  globalOrderQueue.clear();

  // Add all orders to priority queue with calculated priorities
  const prioritizedOrders = orders.map((order) => {
    const priorityInfo = calculateOrderPriority(order, graph, store);
    const enhancedOrder = {
      ...order,
      priority: priorityInfo.priority,
      priorityScore: priorityInfo.priorityScore,
      actualDistance: priorityInfo.actualDistance,
    };

    // Add to priority queue
    globalOrderQueue.enqueue(enhancedOrder);

    return enhancedOrder;
  });

  // Return orders sorted by priority for display (but queue handles the actual ordering)
  return globalOrderQueue
    .getAllOrders()
    .sort((a, b) => a.priorityScore - b.priorityScore);
}

// Enhanced assignment using Priority Queue + Dijkstra + Linked List
export function assignDeliveryPartners(orders, deliveryPartners, graph, store) {
  const assignments = [];
  const availablePartners = [...deliveryPartners];

  // Process orders from priority queue instead of array iteration
  while (
    !globalOrderQueue.isEmpty() &&
    availablePartners.some((p) => p.isAvailable)
  ) {
    // Get highest priority order from queue
    const order = globalOrderQueue.dequeue();

    if (!order || order.status !== "pending") continue;

    // Find nearest available partner using Dijkstra
    let bestPartner = null;
    let minTotalCost = Infinity;
    let bestPartnerToStore = 0;
    let bestStoreToDelivery = 0;
    let bestPartnerToStorePath = [];
    let bestStoreToDeliveryPath = [];

    for (let partner of availablePartners) {
      if (!partner.isAvailable) continue;

      // Calculate partner to store distance using Dijkstra
      const partnerToStore = dijkstra(graph, partner.location, store);

      // Calculate store to delivery distance using Dijkstra
      const storeToDelivery = dijkstra(graph, store, order.deliveryLocation);

      // Total cost = partner→store + store→customer
      const totalCost = partnerToStore.distance + storeToDelivery.distance;

      if (totalCost < minTotalCost) {
        minTotalCost = totalCost;
        bestPartner = partner;
        bestPartnerToStore = partnerToStore.distance;
        bestStoreToDelivery = storeToDelivery.distance;
        bestPartnerToStorePath = partnerToStore.path;
        bestStoreToDeliveryPath = storeToDelivery.path;
      }
    }

    if (bestPartner) {
      const assignment = {
        orderId: order.id,
        partnerId: bestPartner.id,
        partnerName: bestPartner.name,
        partnerToStoreDistance: bestPartnerToStore,
        storeToDeliveryDistance: bestStoreToDelivery,
        totalDistance: minTotalCost,
        partnerToStorePath: bestPartnerToStorePath,
        storeToDeliveryPath: bestStoreToDeliveryPath,
        order: order,
        assignedAt: new Date(),
        estimatedDeliveryTime: calculateEstimatedDeliveryTime(minTotalCost),
      };

      assignments.push(assignment);

      // Add to delivery linked list
      globalDeliveryList.addDelivery(assignment);

      // Mark partner as busy
      bestPartner.isAvailable = false;
      bestPartner.currentOrder = order.id;

      // Update order status
      order.status = "assigned";
      order.assignedPartner = bestPartner.name;
      order.assignedAt = new Date();
    } else {
      // No available partners, put order back in queue
      globalOrderQueue.enqueue(order);
      break;
    }
  }

  return assignments;
}

// Helper function to calculate estimated delivery time
function calculateEstimatedDeliveryTime(totalDistance) {
  const baseTime = 10; // 10 minutes base time
  const timePerUnit = 2; // 2 minutes per distance unit
  return baseTime + totalDistance * timePerUnit;
}

// Enhanced delivery completion using Linked List
export function completeDelivery(assignment, deliveryPartners) {
  // Remove from active deliveries linked list
  const deliveryNode = globalDeliveryList.removeDeliveryByOrderId(
    assignment.orderId
  );

  // Update partner status and location
  const partner = deliveryPartners.find((p) => p.id === assignment.partnerId);
  if (partner) {
    partner.isAvailable = true;
    partner.location = assignment.order.deliveryLocation;
    partner.currentOrder = null;
  }

  // Update order status
  assignment.order.status = "delivered";
  assignment.deliveredAt = new Date();

  console.log(
    `✅ Delivery completed: Order ${assignment.orderId} by ${assignment.partnerName}`
  );
  return deliveryNode;
}

// Generate sample orders
export function generateSampleOrders() {
  const locations = ["B", "C", "E", "F", "G", "I", "J"];
  const restaurants = [
    "Pizza Palace",
    "Burger King",
    "Sushi Express",
    "Taco Bell",
  ];

  return Array.from({ length: 5 }, (_, i) => ({
    id: orderIdCounter++,
    customerName: `Customer ${i + 1}`,
    restaurant: restaurants[Math.floor(Math.random() * restaurants.length)],
    orderValue: Math.floor(Math.random() * 500) + 100,
    deliveryDistance: Math.floor(Math.random() * 10) + 1,
    customerRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    orderTime: Date.now() - Math.floor(Math.random() * 30) * 60 * 1000, // Random time in last 30 mins
    deliveryLocation: locations[Math.floor(Math.random() * locations.length)],
    status: "pending",
    items: [`Item ${i + 1}`, `Item ${i + 2}`],
  }));
}

// Utility functions to access global data structures
export function getPendingOrdersFromQueue() {
  return globalOrderQueue
    .getAllOrders()
    .sort((a, b) => a.priorityScore - b.priorityScore);
}

export function getActiveDeliveriesFromList() {
  return globalDeliveryList.getAllDeliveries();
}

export function getSystemStatus() {
  return {
    pendingOrders: globalOrderQueue.size(),
    activeDeliveries: globalDeliveryList.getSize(),
    totalProcessed: orderIdCounter - 1,
  };
}

export function resetSystem() {
  globalOrderQueue.clear();
  globalDeliveryList.clear();
  orderIdCounter = 1;
  console.log("🔄 Priority Queue system reset");
}

// Add single order to the system
export function addOrderToSystem(orderData, graph, store) {
  const order = {
    id: orderIdCounter++,
    ...orderData,
    status: "pending",
    orderTime: Date.now(),
  };

  const priorityInfo = calculateOrderPriority(order, graph, store);
  const enhancedOrder = {
    ...order,
    priority: priorityInfo.priority,
    priorityScore: priorityInfo.priorityScore,
    actualDistance: priorityInfo.actualDistance,
  };

  globalOrderQueue.enqueue(enhancedOrder);
  console.log(
    `📦 Order ${
      order.id
    } added to priority queue with score: ${priorityInfo.priorityScore.toFixed(
      4
    )}`
  );

  return enhancedOrder;
}
