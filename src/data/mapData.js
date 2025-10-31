// Map graph with weighted edges (distances)
export const mapGraph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 1, D: 5, E: 3 },
  C: { A: 2, B: 1, D: 8, F: 10 },
  D: { B: 5, C: 8, E: 2, G: 3 },
  E: { B: 3, D: 2, F: 4, H: 6 },
  F: { C: 10, E: 4, I: 1 },
  G: { D: 3, H: 2, J: 4 },
  H: { E: 6, G: 2, I: 3, J: 1 },
  I: { F: 1, H: 3, J: 2 },
  J: { G: 4, H: 1, I: 2 },
};

// Node positions for visualization
export const nodePositions = {
  A: { x: 100, y: 100 },
  B: { x: 200, y: 150 },
  C: { x: 150, y: 250 },
  D: { x: 300, y: 100 },
  E: { x: 350, y: 200 },
  F: { x: 250, y: 350 },
  G: { x: 450, y: 150 },
  H: { x: 500, y: 250 },
  I: { x: 400, y: 350 },
  J: { x: 550, y: 300 },
};

// Initial delivery partners
export const initialDeliveryPartners = [
  { id: 1, name: "Ravi", location: "A", isAvailable: true },
  { id: 2, name: "Neha", location: "D", isAvailable: true },
  { id: 3, name: "Arjun", location: "H", isAvailable: true },
];

// Store location
export const storeLocation = "A";
