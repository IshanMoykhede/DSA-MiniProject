// Linked List implementation for active/completed deliveries
export class DeliveryNode {
  constructor(assignment) {
    this.assignment = assignment;
    this.next = null;
    this.timestamp = new Date();
  }
}

export class DeliveryLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Add new delivery assignment to the end of the list
  addDelivery(assignment) {
    const newNode = new DeliveryNode(assignment);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
    return newNode;
  }

  // Remove delivery by order ID
  removeDeliveryByOrderId(orderId) {
    if (!this.head) return null;

    // If head node matches
    if (this.head.assignment.orderId === orderId) {
      const removedNode = this.head;
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null;
      }
      this.size--;
      return removedNode;
    }

    // Search for the node to remove
    let current = this.head;
    while (current.next && current.next.assignment.orderId !== orderId) {
      current = current.next;
    }

    if (current.next) {
      const removedNode = current.next;
      current.next = current.next.next;

      // Update tail if we removed the last node
      if (removedNode === this.tail) {
        this.tail = current;
      }

      this.size--;
      return removedNode;
    }

    return null;
  }

  // Get delivery by order ID
  getDeliveryByOrderId(orderId) {
    let current = this.head;
    while (current) {
      if (current.assignment.orderId === orderId) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  // Get delivery by partner ID
  getDeliveryByPartnerId(partnerId) {
    let current = this.head;
    while (current) {
      if (current.assignment.partnerId === partnerId) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  // Get all active deliveries
  getAllDeliveries() {
    const deliveries = [];
    let current = this.head;
    while (current) {
      deliveries.push(current.assignment);
      current = current.next;
    }
    return deliveries;
  }

  // Get deliveries by status
  getDeliveriesByStatus(status) {
    const deliveries = [];
    let current = this.head;
    while (current) {
      if (current.assignment.order.status === status) {
        deliveries.push(current.assignment);
      }
      current = current.next;
    }
    return deliveries;
  }

  // Update delivery status
  updateDeliveryStatus(orderId, newStatus) {
    const deliveryNode = this.getDeliveryByOrderId(orderId);
    if (deliveryNode) {
      deliveryNode.assignment.order.status = newStatus;
      if (newStatus === "delivered") {
        deliveryNode.assignment.deliveredAt = new Date();
      }
      return true;
    }
    return false;
  }

  // Get current size
  getSize() {
    return this.size;
  }

  // Check if list is empty
  isEmpty() {
    return this.size === 0;
  }

  // Clear all deliveries
  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Display all deliveries (for debugging)
  display() {
    const deliveries = [];
    let current = this.head;
    while (current) {
      deliveries.push({
        orderId: current.assignment.orderId,
        partnerId: current.assignment.partnerId,
        status: current.assignment.order.status,
        timestamp: current.timestamp,
      });
      current = current.next;
    }
    return deliveries;
  }
}
