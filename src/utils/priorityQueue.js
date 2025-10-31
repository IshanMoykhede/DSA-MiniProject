// Priority Queue (Min-Heap) implementation for order management
export class OrderPriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Get parent index
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Get left child index
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // Get right child index
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // Swap two elements
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  // Insert new order with calculated priority
  enqueue(order) {
    this.heap.push(order);
    this.heapifyUp();
  }

  // Remove and return highest priority order (lowest priority value = highest priority)
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const highestPriorityOrder = this.heap[0];
    const lastOrder = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = lastOrder;
      this.heapifyDown();
    }

    return highestPriorityOrder;
  }

  // Peek at the highest priority order without removing it
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  // Check if queue is empty
  isEmpty() {
    return this.heap.length === 0;
  }

  // Get current size
  size() {
    return this.heap.length;
  }

  // Move element up to maintain min-heap property (lower priority value = higher priority)
  heapifyUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = this.getParentIndex(index);

      // Min-heap: parent should have lower priority value (higher priority)
      if (
        this.heap[parentIndex].priorityScore <= this.heap[index].priorityScore
      ) {
        break;
      }

      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  // Move element down to maintain min-heap property
  heapifyDown() {
    let index = 0;

    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      // Find child with smaller priority value (higher priority)
      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].priorityScore <
          this.heap[smallerChildIndex].priorityScore
      ) {
        smallerChildIndex = rightChildIndex;
      }

      // If current node has smaller priority value than its smallest child, heap property is satisfied
      if (
        this.heap[index].priorityScore <=
        this.heap[smallerChildIndex].priorityScore
      ) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  // Remove a specific order by ID (useful for cancellations)
  removeOrderById(orderId) {
    const index = this.heap.findIndex((order) => order.id === orderId);
    if (index === -1) return null;

    const removedOrder = this.heap[index];
    const lastOrder = this.heap.pop();

    if (index < this.heap.length) {
      this.heap[index] = lastOrder;

      // Restore heap property
      const parentIndex = this.getParentIndex(index);
      if (
        index > 0 &&
        this.heap[parentIndex].priorityScore > this.heap[index].priorityScore
      ) {
        this.heapifyUp();
      } else {
        this.heapifyDown();
      }
    }

    return removedOrder;
  }

  // Get all orders (for display purposes)
  getAllOrders() {
    return [...this.heap];
  }

  // Clear all orders
  clear() {
    this.heap = [];
  }
}
