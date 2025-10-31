# 🚀 Quick Start Guide - Priority Queue Delivery System

## Getting Started

### 1. Run the Application

```bash
cd DSAPROJECT
npm install
npm run dev
```

### 2. Choose Your Experience

On the homepage, you'll see two options:

- **🚀 Priority Queue System** - New enhanced system with heap-based priority management
- **📊 Original System** - Traditional array-based sorting system

## 🎮 Using the Enhanced Priority Queue System

### Step 1: Add Orders

Click **"🎲 Add Sample Orders"** to add multiple orders with different priorities, or **"➕ Add Single Order"** for individual orders.

### Step 2: Understand Priority Ranking

Orders in the **Priority Queue** section are automatically sorted by priority score:

- **Lower score = Higher priority**
- Factors: Distance (60%) + Order Value (40%)
- Each order shows its priority score and ranking

### Step 3: Process Orders

- **"🔄 Process Next Order"** - Process the highest priority order
- **"🚀 Process Batch"** - Process multiple orders at once
- **"▶️ Start Auto"** - Enable automatic processing

### Step 4: Track Deliveries

- **Active Deliveries** - Shows orders currently being delivered (stored in linked list)
- **Completed** - Shows finished deliveries
- Click **"View Route on Map"** to see Dijkstra-calculated paths

### Step 5: Simulate Completions

Click **"🎯 Complete Delivery"** to simulate finishing a random active delivery.

## 🧮 Understanding the Priority System

### Priority Calculation Formula

```
Priority Score = (0.6 × Normalized Distance) + (0.4 × Normalized Value)
```

### Examples:

- **High Value + Close Distance** = Lowest score = **Highest Priority**
- **Low Value + Far Distance** = Highest score = **Lowest Priority**

### Visual Indicators:

- Orders are numbered 1, 2, 3... in priority order
- Priority scores shown as decimal values (e.g., 0.2341)
- Lower numbers = processed first

## 🗺️ Route Visualization

### Route Types:

1. **🚚 Agent → Store** (Blue dashed line)
   - Shows how delivery partner travels to pickup location
2. **🏪 Store → Customer** (Orange solid line)
   - Shows delivery route from store to customer
3. **🛣️ Complete Route** (Both paths)
   - Shows entire journey

### Dijkstra Algorithm:

- Automatically finds shortest path between any two points
- Considers actual graph distances, not straight-line distance
- Updates partner locations after each delivery

## 📊 System Statistics

Monitor real-time metrics:

- **Pending Orders** - In priority queue (heap)
- **Active Deliveries** - In linked list
- **Completed** - Total finished deliveries
- **Available Partners** - Ready for new assignments

## 🎬 Demo Functions

### Console Demos:

Open browser console and run:

```javascript
// Complete system demonstration
runOrderManagementDemo();

// Priority calculation explanation
demonstratePriorityCalculation();
```

### Test Functions:

```javascript
// Test all components
runAllTests();

// Test individual components
testPriorityQueueSystem();
testHeapOperations();
testLinkedListOperations();
```

## 🔧 Advanced Features

### Auto-Processing Mode:

- Automatically adds new orders every few seconds
- Processes orders when available
- Simulates delivery completions
- Great for watching the system in action

### Batch Processing:

- Process multiple orders simultaneously
- Efficient for high-volume scenarios
- Shows parallel assignment capabilities

### System Reset:

- Clears all orders and deliveries
- Resets partners to original positions
- Starts fresh simulation

## 🎯 Key Learning Points

### Data Structures in Action:

1. **Priority Queue (Heap)**

   - O(log n) insertion/removal
   - Always maintains order automatically
   - No need to sort entire array

2. **Linked List**

   - O(1) insertion
   - Efficient for tracking active deliveries
   - Dynamic memory management

3. **Dijkstra's Algorithm**
   - Finds optimal partner assignments
   - Calculates shortest delivery routes
   - Handles complex graph topologies

### Performance Benefits:

- **Old System**: O(n log n) for each order processing
- **New System**: O(log n) for order processing + O(V log V) for routing

## 🚨 Troubleshooting

### No Orders Processing?

- Check if delivery partners are available
- Add more orders to the queue
- Reset system if needed

### Routes Not Showing?

- Click "View Route on Map" on an active delivery
- Select route type in the modal
- Ensure assignment has valid paths

### Console Errors?

- Check browser console for detailed error messages
- Ensure all files are loaded correctly
- Try refreshing the page

## 🎉 Have Fun!

Experiment with different scenarios:

- Add high-value orders to far locations
- Add low-value orders to close locations
- Watch how the priority queue automatically reorders
- See how Dijkstra finds optimal routes
- Observe the linked list managing active deliveries

The system demonstrates real-world applications of advanced data structures and algorithms in modern delivery platforms!
