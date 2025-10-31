import React from "react";
import { nodePositions, mapGraph } from "../data/mapData";

const MapComponent = ({
  agentToStorePath = [],
  storeToCustomerPath = [],
  selectedAssignment = null,
}) => {
  const svgWidth = 700;
  const svgHeight = 500;

  // Check if an edge is in the agent-to-store path (blue)
  const isEdgeInAgentPath = (from, to) => {
    if (!agentToStorePath.length) return false;

    for (let i = 0; i < agentToStorePath.length - 1; i++) {
      if (
        (agentToStorePath[i] === from && agentToStorePath[i + 1] === to) ||
        (agentToStorePath[i] === to && agentToStorePath[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  // Check if an edge is in the store-to-customer path (orange)
  const isEdgeInDeliveryPath = (from, to) => {
    if (!storeToCustomerPath.length) return false;

    for (let i = 0; i < storeToCustomerPath.length - 1; i++) {
      if (
        (storeToCustomerPath[i] === from &&
          storeToCustomerPath[i + 1] === to) ||
        (storeToCustomerPath[i] === to && storeToCustomerPath[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  // Get edge color based on path type
  const getEdgeColor = (from, to) => {
    if (isEdgeInAgentPath(from, to)) return "#3b82f6"; // Blue for agent to store
    if (isEdgeInDeliveryPath(from, to)) return "#f97316"; // Orange for store to customer
    return "#d1d5db"; // Default gray
  };

  // Get edge width based on highlighting
  const getEdgeWidth = (from, to) => {
    return isEdgeInAgentPath(from, to) || isEdgeInDeliveryPath(from, to)
      ? "4"
      : "2";
  };

  // Check if a node is in any highlighted path
  const isNodeHighlighted = (node) => {
    return (
      agentToStorePath.includes(node) || storeToCustomerPath.includes(node)
    );
  };

  // Get special node styling
  const getNodeColor = (node) => {
    if (node === "A") return "#dc2626"; // Store is always red
    if (agentToStorePath.includes(node) && storeToCustomerPath.includes(node)) {
      return "#8b5cf6"; // Purple for nodes in both paths
    }
    if (agentToStorePath.includes(node)) return "#3b82f6"; // Blue for agent path
    if (storeToCustomerPath.includes(node)) return "#f97316"; // Orange for delivery path
    return "#6b7280"; // Default gray
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">🗺️ Delivery Map</h3>
          {selectedAssignment && (
            <div className="text-sm text-gray-500 mt-1">
              {agentToStorePath.length > 0 &&
                storeToCustomerPath.length > 0 && (
                  <span>🛣️ Showing complete route</span>
                )}
              {agentToStorePath.length > 0 &&
                storeToCustomerPath.length === 0 && (
                  <span>🚚 Showing agent → store path</span>
                )}
              {agentToStorePath.length === 0 &&
                storeToCustomerPath.length > 0 && (
                  <span>🏪 Showing store → customer path</span>
                )}
            </div>
          )}
        </div>
        {selectedAssignment && (
          <div className="text-right">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Total Distance: </span>
              {selectedAssignment.totalDistance} km
            </div>
            {agentToStorePath.length > 0 && storeToCustomerPath.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Agent: {selectedAssignment.partnerToStoreDistance}km + Delivery:{" "}
                {selectedAssignment.storeToDeliveryDistance}km
              </div>
            )}
          </div>
        )}
      </div>

      <svg
        width={svgWidth}
        height={svgHeight}
        className="border border-gray-200 rounded"
      >
        {/* Define arrow markers */}
        <defs>
          <marker
            id="arrowBlue"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
          </marker>
          <marker
            id="arrowOrange"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#f97316" />
          </marker>
        </defs>

        {/* Draw edges */}
        {Object.entries(mapGraph).map(([from, connections]) =>
          Object.entries(connections).map(([to, weight]) => {
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];
            const isAgentPath = isEdgeInAgentPath(from, to);
            const isDeliveryPath = isEdgeInDeliveryPath(from, to);

            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={getEdgeColor(from, to)}
                  strokeWidth={getEdgeWidth(from, to)}
                  className="transition-all duration-300"
                  strokeDasharray={isAgentPath ? "8,4" : "none"}
                  markerEnd={
                    isAgentPath
                      ? "url(#arrowBlue)"
                      : isDeliveryPath
                      ? "url(#arrowOrange)"
                      : "none"
                  }
                />
                {/* Edge weight label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 8}
                  fill={
                    getEdgeColor(from, to) === "#d1d5db"
                      ? "#6b7280"
                      : getEdgeColor(from, to)
                  }
                  fontSize="12"
                  textAnchor="middle"
                  className="font-semibold"
                  style={{
                    textShadow:
                      isAgentPath || isDeliveryPath
                        ? "1px 1px 2px rgba(255,255,255,0.8)"
                        : "none",
                  }}
                >
                  {weight}km
                </text>
              </g>
            );
          })
        )}

        {/* Draw nodes */}
        {Object.entries(nodePositions).map(([node, pos]) => {
          const isHighlighted = isNodeHighlighted(node);
          const isStore = node === "A";

          return (
            <g key={node}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isStore ? "25" : isNodeHighlighted(node) ? "22" : "18"}
                fill={getNodeColor(node)}
                stroke="#ffffff"
                strokeWidth={isNodeHighlighted(node) ? "4" : "2"}
                className="transition-all duration-300"
              />
              {/* Add glow effect for highlighted nodes */}
              {isNodeHighlighted(node) && !isStore && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="28"
                  fill="none"
                  stroke={getNodeColor(node)}
                  strokeWidth="2"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
              <text
                x={pos.x}
                y={pos.y + 5}
                fill="white"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {isStore ? "🏪" : node}
              </text>
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y - 35}
                fill="#374151"
                fontSize="12"
                fontWeight="semibold"
                textAnchor="middle"
              >
                {isStore ? "Store" : `Location ${node}`}
              </text>
            </g>
          );
        })}

        {/* Enhanced Legend */}
        <g transform="translate(20, 20)">
          <rect
            x="0"
            y="0"
            width="200"
            height="130"
            fill="white"
            stroke="#d1d5db"
            rx="8"
            fillOpacity="0.95"
          />
          <text x="10" y="20" fontSize="14" fontWeight="bold" fill="#374151">
            🗺️ Route Legend
          </text>

          {/* Store */}
          <circle
            cx="20"
            cy="40"
            r="10"
            fill="#dc2626"
            stroke="white"
            strokeWidth="2"
          />
          <text x="15" y="46" fontSize="12" fill="white">
            🏪
          </text>
          <text x="40" y="46" fontSize="11" fill="#374151">
            Store (Hub)
          </text>

          {/* Regular Location */}
          <circle
            cx="20"
            cy="60"
            r="8"
            fill="#6b7280"
            stroke="white"
            strokeWidth="2"
          />
          <text x="17" y="65" fontSize="10" fill="white">
            📍
          </text>
          <text x="40" y="66" fontSize="11" fill="#374151">
            Location
          </text>

          {/* Agent Path */}
          <line
            x1="10"
            y1="80"
            x2="30"
            y2="80"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeDasharray="8,4"
            markerEnd="url(#arrowBlue)"
          />
          <text x="40" y="85" fontSize="11" fill="#374151">
            Agent → Store (Dashed)
          </text>

          {/* Delivery Path */}
          <line
            x1="10"
            y1="100"
            x2="30"
            y2="100"
            stroke="#f97316"
            strokeWidth="4"
            markerEnd="url(#arrowOrange)"
          />
          <text x="40" y="105" fontSize="11" fill="#374151">
            Store → Customer (Solid)
          </text>

          {/* Active Node */}
          <circle
            cx="20"
            cy="120"
            r="8"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="2"
          />
          <text x="40" y="125" fontSize="11" fill="#374151">
            Active Route Node
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MapComponent;
