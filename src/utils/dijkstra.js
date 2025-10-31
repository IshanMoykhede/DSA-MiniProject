// Dijkstra's Algorithm Implementation with proper Min-Heap Priority Queue
class PriorityQueue {
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
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  // Insert new element with priority
  enqueue(node, priority) {
    const element = { node, priority };
    this.heap.push(element);
    this.heapifyUp();
  }

  // Remove and return highest priority element
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown();
    }

    return min;
  }

  // Check if queue is empty
  isEmpty() {
    return this.heap.length === 0;
  }

  // Move element up to maintain heap property
  heapifyUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      
      if (this.heap[parentIndex].priority <= this.heap[index].priority) {
        break;
      }

      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  // Move element down to maintain heap property
  heapifyDown() {
    let index = 0;

    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (rightChildIndex < this.heap.length && 
          this.heap[rightChildIndex].priority < this.heap[smallerChildIndex].priority) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[index].priority <= this.heap[smallerChildIndex].priority) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }
}

export function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = new PriorityQueue();

  // Initialize distances
  for (let node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
  }

  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const { node: currentNode } = pq.dequeue();

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    if (currentNode === end) break;

    for (let neighbor in graph[currentNode]) {
      const distance = graph[currentNode][neighbor];
      const newDistance = distances[currentNode] + distance;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
        pq.enqueue(neighbor, newDistance);
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    distance: distances[end],
    path: distances[end] === Infinity ? [] : path,
  };
}

export function findNearestPartner(graph, store, deliveryPartners) {
  let nearestPartner = null;
  let minDistance = Infinity;

  for (let partner of deliveryPartners) {
    if (partner.isAvailable) {
      const result = dijkstra(graph, partner.location, store);
      if (result.distance < minDistance) {
        minDistance = result.distance;
        nearestPartner = partner;
      }
    }
  }

  return { partner: nearestPartner, distance: minDistance };
}
