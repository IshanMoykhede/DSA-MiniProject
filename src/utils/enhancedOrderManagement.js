import { dijkstra } from "./dijkstra.js";
import { OrderPriorityQueue } from "./priorityQueue.js";
import { DeliveryLinkedList } from "./deliveryLinkedList.js";

export class EnhancedOrderManagementSystem {
  constructor(graph, storeLocation) {
    this.graph = graph;
    this.storeLocation = storeLocation;
    this.orderQueue = new OrderPriorityQueue();
    this.activeDeliveries = new DeliveryLinkedList();
    this.completedDeliveries = [];
    this.orderIdCounter = 1;
  }

  // Calculate priority score for an order (lower score = higher priority)
  calculateOrderPriority(order) {
    const { orderValue, deliveryLocation } = order;

    // Calculate actual distance using Dijkstra
    const distanceResult = dijkstra(
      this.graph,
      this.storeLocation,
      deliveryLocation
    );
    const actualDistance = distanceResult.distance;

    // Priority calculation with custom weighting
    // Lower distance = higher priority (inverse relationship)
    // Higher order value = higher priority (direct relationship)

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
      priorityScore,
      actualDistance,
      normalizedDistance,
      normalizedValue,
    };
  }

  // Add new order to the priority queue
  addOrder(orderData) {
    const order = {
      id: this.orderIdCounter++,
      ...orderData,
      status: "pending",
      orderTime: Date.now(),
    };

    const priorityInfo = this.calculateOrderPriority(order);
    order.priorityScore = priorityInfo.priorityScore;
    order.actualDistance = priorityInfo.actualDistance;
    order.priorityDetails = priorityInfo;

    this.orderQueue.enqueue(order);

    console.log(
      `Order ${
        order.id
      } added with priority score: ${priorityInfo.priorityScore.toFixed(3)}`
    );
    return order;
  }

  // Find nearest available delivery partner using Dijkstra
  findNearestAvailablePartner(deliveryPartners, targetLocation) {
    let nearestPartner = null;
    let minDistance = Infinity;
    let bestPath = [];

    for (let partner of deliveryPartners) {
      if (partner.isAvailable) {
        const result = dijkstra(this.graph, partner.location, targetLocation);

        if (result.distance < minDistance) {
          minDistance = result.distance;
          nearestPartner = partner;
          bestPath = result.path;
        }
      }
    }

    return {
      partner: nearestPartner,
      distance: minDistance,
      path: bestPath,
    };
  }

  // Process the next highest priority order
  processNextOrder(deliveryPartners) {
    if (this.orderQueue.isEmpty()) {
      console.log("No pending orders to process");
      return null;
    }

    // Get the highest priority order
    const order = this.orderQueue.dequeue();

    if (!order) {
      console.log("No orders available for processing");
      return null;
    }

    console.log(
      `Processing order ${
        order.id
      } with priority score: ${order.priorityScore.toFixed(3)}`
    );

    // Find nearest available partner to the store (pickup location)
    const partnerResult = this.findNearestAvailablePartner(
      deliveryPartners,
      this.storeLocation
    );

    if (!partnerResult.partner) {
      console.log("No available delivery partners");
      // Put the order back in queue
      this.orderQueue.enqueue(order);
      return null;
    }

    // Calculate delivery route (store to customer)
    const deliveryRoute = dijkstra(
      this.graph,
      this.storeLocation,
      order.deliveryLocation
    );

    // Create assignment
    const assignment = {
      orderId: order.id,
      partnerId: partnerResult.partner.id,
      partnerName: partnerResult.partner.name,
      partnerToStoreDistance: partnerResult.distance,
      partnerToStorePath: partnerResult.path,
      storeToDeliveryDistance: deliveryRoute.distance,
      storeToDeliveryPath: deliveryRoute.path,
      totalDistance: partnerResult.distance + deliveryRoute.distance,
      order: order,
      assignedAt: new Date(),
      estimatedDeliveryTime: this.calculateEstimatedDeliveryTime(
        partnerResult.distance + deliveryRoute.distance
      ),
    };

    // Mark partner as busy and update their location to store
    partnerResult.partner.isAvailable = false;
    partnerResult.partner.currentOrder = order.id;

    // Update order status
    order.status = "assigned";
    order.assignedPartner = partnerResult.partner.name;
    order.assignedAt = new Date();

    // Add to active deliveries linked list
    this.activeDeliveries.addDelivery(assignment);

    console.log(`Order ${order.id} assigned to ${partnerResult.partner.name}`);
    console.log(`Total distance: ${assignment.totalDistance} units`);

    return assignment;
  }

  // Process multiple orders in batch
  processBatchOrders(deliveryPartners, batchSize = 3) {
    const assignments = [];

    for (let i = 0; i < batchSize && !this.orderQueue.isEmpty(); i++) {
      const assignment = this.processNextOrder(deliveryPartners);
      if (assignment) {
        assignments.push(assignment);
      } else {
        break; // No more available partners
      }
    }

    return assignments;
  }

  // Complete a delivery and free up the partner
  completeDelivery(orderId, deliveryPartners) {
    const deliveryNode = this.activeDeliveries.removeDeliveryByOrderId(orderId);

    if (!deliveryNode) {
      console.log(`Delivery with order ID ${orderId} not found`);
      return false;
    }

    const assignment = deliveryNode.assignment;

    // Find and update the partner
    const partner = deliveryPartners.find((p) => p.id === assignment.partnerId);
    if (partner) {
      partner.isAvailable = true;
      partner.location = assignment.order.deliveryLocation; // Partner is now at delivery location
      partner.currentOrder = null;
    }

    // Update order status
    assignment.order.status = "delivered";
    assignment.deliveredAt = new Date();

    // Move to completed deliveries
    this.completedDeliveries.push(assignment);

    console.log(`Order ${orderId} delivered by ${assignment.partnerName}`);
    return true;
  }

  // Calculate estimated delivery time based on distance
  calculateEstimatedDeliveryTime(totalDistance) {
    const baseTime = 10; // 10 minutes base time
    const timePerUnit = 2; // 2 minutes per distance unit
    return baseTime + totalDistance * timePerUnit;
  }

  // Get current system status
  getSystemStatus() {
    return {
      pendingOrders: this.orderQueue.size(),
      activeDeliveries: this.activeDeliveries.getSize(),
      completedDeliveries: this.completedDeliveries.length,
      totalOrders: this.orderIdCounter - 1,
    };
  }

  // Get all pending orders (for display)
  getPendingOrders() {
    return this.orderQueue
      .getAllOrders()
      .sort((a, b) => a.priorityScore - b.priorityScore);
  }

  // Get all active deliveries
  getActiveDeliveries() {
    return this.activeDeliveries.getAllDeliveries();
  }

  // Get completed deliveries
  getCompletedDeliveries() {
    return [...this.completedDeliveries];
  }

  // Cancel an order (remove from queue)
  cancelOrder(orderId) {
    const removedOrder = this.orderQueue.removeOrderById(orderId);
    if (removedOrder) {
      console.log(`Order ${orderId} cancelled`);
      return true;
    }
    console.log(`Order ${orderId} not found in pending queue`);
    return false;
  }

  // Simulate the entire order processing cycle
  simulateOrderProcessing(deliveryPartners, orders) {
    console.log("=== Starting Order Processing Simulation ===");

    // Add all orders to the priority queue
    orders.forEach((orderData) => {
      this.addOrder(orderData);
    });

    console.log(`\nAdded ${orders.length} orders to priority queue`);
    console.log("Order priority ranking:");
    this.getPendingOrders().forEach((order, index) => {
      console.log(
        `${index + 1}. Order ${
          order.id
        } - Priority: ${order.priorityScore.toFixed(3)} - Value: ₹${
          order.orderValue
        } - Distance: ${order.actualDistance}`
      );
    });

    // Process orders one by one
    console.log("\n=== Processing Orders ===");
    while (!this.orderQueue.isEmpty()) {
      const assignment = this.processNextOrder(deliveryPartners);
      if (!assignment) {
        console.log("No more available partners. Waiting...");
        break;
      }

      // Simulate some deliveries completing to free up partners
      if (Math.random() > 0.7 && this.activeDeliveries.getSize() > 0) {
        const activeDeliveries = this.getActiveDeliveries();
        const randomDelivery =
          activeDeliveries[Math.floor(Math.random() * activeDeliveries.length)];
        this.completeDelivery(randomDelivery.orderId, deliveryPartners);
      }
    }

    console.log("\n=== Final System Status ===");
    const status = this.getSystemStatus();
    console.log(`Pending Orders: ${status.pendingOrders}`);
    console.log(`Active Deliveries: ${status.activeDeliveries}`);
    console.log(`Completed Deliveries: ${status.completedDeliveries}`);

    return status;
  }
}
